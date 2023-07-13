import "../../chat.css";
import { io } from "socket.io-client";
import { useState,useEffect } from "react";
import { useSelector } from "react-redux";

const UserChatComponent = () => {
  
const [socket, setSocket] = useState(false);
const [chat, setChat] = useState([]);
const [messageReceived, setMessageReceived] = useState(false);
const [chatConnectionInfo, setChatConnectionInfo] = useState(false);
const [reconnect, setReconnect] = useState(false);

//get userInfo from redux
const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);


useEffect(() => {
  // Establish a socket connection only for non-admin users
  if (!userInfo.isAdmin) {
    setReconnect(false);
    let audio = new Audio("/audio/chat-msg.mp3");
    // Create a socket instance
    const socket = io("https://topazio-shop-backend.onrender.com");
    //listen to "no admin" signal from socket.io
    socket.on("no admin", (msg) => {
      setChat((chat) => {
          return [...chat, { admin: "All admins are offline, please leave your messages and we will get back to you soon" }];
      })
  })
    // Listen for "server sends message from admin to client" event
    socket.on("server sends message from admin to client", (msg) => {
      // Update the chat state with the received admin message
      setChat((chat) => [...chat, { admin: msg }]);
      // Scroll to the bottom of the chat messages container
      setMessageReceived(true);
      //play pop sound when msg arrived
      audio.play();
      const chatMessages = document.querySelector(".cht-msg");
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
    setSocket(socket);
    //listen to admin closed chat then send the response message
    socket.on("admin closed chat", () => {
      setChat([]); //clear chat text
      setChatConnectionInfo("Admin closed chat. Type something and submit to reconnect");
      setReconnect(true);
   })

    // Clean up function to disconnect the socket
    return () => {
      socket.disconnect();
    };
  }
}, [userInfo.isAdmin]);


const clientSubmitChatMsg = (e) => {
  // Check if the key pressed is not the Enter key
  if (e.keyCode && e.keyCode !== 13) {
    return;
  }
  setChatConnectionInfo("");
  // Retrieve the input message value
  const msg = document.getElementById("clientChatMsg");
  let trimmedMsg = msg.value.trim();
  // Return early if the message is empty or falsy
  if (!trimmedMsg) {
    return;
  }
  // Emit the "client sends message" event with the message value
  socket.emit("client sends message", trimmedMsg);
  setMessageReceived(false);
  // Update the chat state with the new client message
  setChat((chat) => {
    return [...chat, { client: trimmedMsg }];
  });
  
  // Reset the input value and focus on it
  msg.value = "";
  msg.focus();
  
  // Scroll to the bottom of the chat messages
  setTimeout(() => {
    const chatMessages = document.querySelector(".cht-msg");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 200);
};

  return (
    !userInfo.isAdmin ? (
    <>
      <input type="checkbox" id="checkbox" />
      <label className="chat-btn" htmlFor="checkbox">
        <i className="bi bi-chat-dots comment"></i>
        {messageReceived && <span className="position-absolute top-0 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>}
        <i className="bi bi-x-circle close"></i>
      </label>
      <div className="chat-wrapper">
        <div className="chat-header">
          <h6>Let's Chat - Online</h6>
        </div>
        <div className="chat-form">
        <div className="cht-msg">
        <p>{chatConnectionInfo}</p>
            {chat.map((item,id)=>{
              return(
                <div key={id}>
                {item.client && (
                  <p>
                  <b>You wrote:</b> {item.client}
                </p>
                )}
                {item.admin && (
                  <p className="bg-primary p-3 ms-4 text-light rounded-pill">
                  <b>Support wrote:</b> {item.admin}
                </p>
                )}
                
              </div>
              )
            })}
          </div>
          <textarea
           onKeyDown={(e) => clientSubmitChatMsg(e)}
            id="clientChatMsg"
            className="form-control"
            placeholder="Your Text Message"
          ></textarea>

          <button onClick={(e) => clientSubmitChatMsg(e)} className="btn btn-success btn-block">Submit</button>
        </div>
      </div>
    </>
  ): null
  )
};

export default UserChatComponent;
