const { Server } = require("socket.io");

const admins = [];
let activeChats = [];

function get_random(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const configureSocketIO = (httpServer) => {
  const io = new Server(httpServer, { cors: { origin: "*" } });

  //set up an event listener for the "connection" event.
  io.on("connection", (socket) => {
    //listen message from client then send to admin
    socket.on("client sends message", (msg) => {
      //if no admin online send back response
      if (admins.length === 0) {
        // If there are no admins available
        socket.emit("no admin", "");
      } else {
        let client = activeChats.find(
          (client) => client.clientId === socket.id
        );
        let targetAdminId;
        if (client) {
          // If the client already has an active chat
          targetAdminId = client.adminId;
        } else {
          // If the client doesn't have an active chat, assign a random admin
          let admin = get_random(admins);
          activeChats.push({ clientId: socket.id, adminId: admin.id });
          targetAdminId = admin.id;
        }
        // Emit the message from client to the target admin
        socket.broadcast
          .to(targetAdminId)
          .emit("server sends message from client to admin", {
            user: socket.id,
            message: msg,
          });
      }
    });

    //listen message from admin then send to clients
    socket.on("admin sends message", ({ message }) => {
      socket.broadcast.emit(
        "server sends message from admin to client",
        message
      );
    });
    //listen signal whether admin is online or not
    socket.on("admin connected with server", (adminName) => {
      admins.push({ id: socket.id, admin: adminName });
    });

    //For get disconnect signal from admin logout
    socket.on("disconnect", (reason) => {
      //find disconnected admin in the admins index and remove them
      const removeIndex = admins.findIndex((item) => item.id === socket.id);
      if (removeIndex !== -1) {
        admins.splice(removeIndex, 1);
      }
      //remove disconnected admin from active chat
      activeChats = activeChats.filter((item) => item.adminId !== socket.id);
      // Remove client from active chats
      const removeIndexClient = activeChats.findIndex(
        (item) => item.clientId === socket.id
      );
      if (removeIndexClient !== -1) {
        activeChats.splice(removeIndexClient, 1);
      }

      // Emit "disconnected" event to inform other sockets
      socket.broadcast.emit("disconnected", {
        reason: reason,
        socketId: socket.id,
      });
    });

    //listen to admin closes chat then close chat window and send the close chat box message to user
    socket.on("admin closes chat", (socketId) => {
      socket.broadcast.to(socketId).emit("admin closed chat", "");
      const clientSocket = io.sockets.sockets.get(socketId);
      if (clientSocket) {
        clientSocket.disconnect(true); // reason: server namespace disconnect
      }
    });
  });

  return io;
};

module.exports = configureSocketIO;
