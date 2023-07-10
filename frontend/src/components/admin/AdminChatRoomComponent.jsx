import { Toast, Button, Form } from "react-bootstrap";
import { Fragment, useState,useEffect } from "react";
import { setMessageReceived } from "../../redux/actions/chatActions";
import { useDispatch } from "react-redux";

const AdminChatRoomComponent = ({ chatRoom, roomIndex, socket, socketUser }) => {
  const dispatch = useDispatch();

  [window["toast" + roomIndex], window["closeToast" + roomIndex]] =
    useState(true);

  const [rerender, setRerender] = useState(false);

  //close chat box for admin
  const close = (socketId) => {
    window["closeToast" + roomIndex](false);
    socket.emit("admin closes chat", socketId);
  };

  // Function to handle sending admin message to clients
  const adminSubmitChatMsg = (e, elem) => {
    e.preventDefault();
    if (e.keyCode && e.keyCode !== 13) {
      return;
    }
    const msg = document.getElementById(elem);
    let v = msg.value.trim();
    if (v === "" || v === null || v === false || !v) {
      return;
    }
    // Push the admin message to the chat room
    chatRoom[1].push({ admin: msg.value });
    //send msg back to client
    socket.emit("admin sends message", {
      user:socketUser,
      message: v
  })
    // Trigger a re-render by updating the state
    setRerender(!rerender);
    //remove red dot on the admin header
    dispatch(setMessageReceived(false));
    // Set focus back to the input field for a better user experience
    msg.focus();

    // Delayed action to clear the input field and scroll to the latest message
    setTimeout(() => {
      msg.value = "";
      const chatMessages = document.querySelector(`.cht-msg${socketUser}`);
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 200);
  };

  //effect will run after each render, ensuring that the scroll position is adjusted accordingly whenever the component re-renders.
  useEffect(() => {
    const chatMessages = document.querySelector(`.cht-msg${socketUser}`); 
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight
    };
 })

  return (
    <>
      <Toast
        show={"toast" + roomIndex}
        onClose={() => close(chatRoom[0])}
        className="ms-4 mb-5"
      >
        <Toast.Header>
          <strong className="me-auto">Chat with users</strong>
        </Toast.Header>
        <Toast.Body>
          <div
            className={`cht-msg${socketUser}`}
            style={{ maxHeight: "500px", overflow: "auto" }}
          >
            {chatRoom[1].map((msg, idx) => (
              <Fragment key={idx}>
                {msg.client && (
                  <p
                    key={idx}
                    className="bg-primary p-3 ms-4 text-light rounded-pill"
                  >
                    <b>User wrote:</b> {msg.client}
                  </p>
                )}
                {msg.admin && (
                  <p key={idx}>
                    <b>Admin wrote:</b> {msg.admin}
                  </p>
                )}
              </Fragment>
            ))}
          </div>

          <Form>
            <Form.Group className="mb-3" controlId={`adminChatMsg${roomIndex}`}>
              <Form.Label>Write a message</Form.Label>
              <Form.Control
                onKeyUp={(e) =>
                  adminSubmitChatMsg(e, `adminChatMsg${roomIndex}`)
                }
                as="textarea"
                rows={2}
              />
            </Form.Group>
            <Button
              onClick={(e) => adminSubmitChatMsg(e, `adminChatMsg${roomIndex}`)}
              variant="success"
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default AdminChatRoomComponent;
