//Config
require('dotenv').config();
//Express.js
const express = require('express');
const app = express();
//Database 
const connectDB = require('./config/db');
//Database connection
connectDB();
//Routes
const apiRoutes = require("./routes/apiRoutes");
//Express file upload
const fileUpload = require("express-fileupload");
//Cookie
const cookieParser = require("cookie-parser");
//socket.io
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
global.io = new Server(httpServer,{cors: {origin: "*"}});

const admins = [];
let activeChats = [];

function get_random(array) {
   return array[Math.floor(Math.random() * array.length)]; 
}
//set up an event listener for the "connection" event.
io.on("connection", (socket) => {
  //listen message from client then send to admin
  socket.on("client sends message", (msg) => {
    //if no admin online send back response
    if (admins.length === 0) {
      // If there are no admins available
      socket.emit("no admin", "");
    } else {
      let client = activeChats.find((client) => client.clientId === socket.id);
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
      socket.broadcast.to(targetAdminId).emit("server sends message from client to admin", {
        user: socket.id,
        message: msg,
      });
    }})
    

  //listen message from admin then send to clients
  socket.on("admin sends message", ({ message }) => {
    socket.broadcast.emit("server sends message from admin to client", message);
})
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
});
});




app.use(fileUpload());
app.use(cookieParser());
app.use(express.json());

app.use("/api", apiRoutes);

//Error handling
app.use((error, req, res, next) => {
  console.log(error);
  const response = {
    message: error.message
  };
  //send the detailed error when in dev mode ONLY
  if (process.env.NODE_ENV === 'dev'){
    response.stack = error.stack;
  }
  //console.log(error);
  res.status(500).json(response);
  return;
});

//Start server
/*
app.listen(process.env.PORT, () => {
  console.log(`Server started successfully on port ${process.env.PORT}`)
})*/

//start server with socket.io
httpServer.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));