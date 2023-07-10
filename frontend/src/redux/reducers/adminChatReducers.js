// Import the action types
import * as actionTypes from "../constants/chatConstants";

// Define the initial state of the chat
const CHAT_INITIAL_STATE = {
  chatRooms: {}, // Object to store chat messages for each user
  socket: false,
  messageReceived: false,
};

// Reducer function for the admin chat
export const adminChatReducer = (state = CHAT_INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SET_CHATROOMS:
      let currentState = { ...state };
      if (state.chatRooms[action.payload.user]) {
        // If chat messages exist for the user, add the new message to the existing chat
        currentState.chatRooms[action.payload.user].push({
          client: action.payload.message,
        });
        return {
          ...state,
          chatRooms: { ...currentState.chatRooms },
        };
      } else {
        // If chat messages don't exist for the user, create a new chat and add the message
        return {
          ...state,
          chatRooms: {
            ...currentState.chatRooms,
            [action.payload.user]: [{ client: action.payload.message }],
          },
        };
      }
    case actionTypes.SET_SOCKET:
      return {
        ...state,
        socket: action.payload.socket,
      };
    case actionTypes.MESSAGE_RECEIVED:
      return {
        ...state,
        messageReceived: action.payload.value,
      };
    case actionTypes.REMOVE_CHATROOM:
      let currentState2 = { ...state };
      //delete chat room
      delete currentState2.chatRooms[action.payload.socketId];
      return {
        ...state,
        chatRooms: { ...currentState2.chatRooms },
      };

    default:
      return state;
  }
};
