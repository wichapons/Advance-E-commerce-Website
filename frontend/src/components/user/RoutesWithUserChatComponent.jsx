import { Outlet } from "react-router-dom";
import UserChatComponent from "./UserChatComponent";

const RoutesWithUserChatComponent = () => {
  return (
    //return UserChatComponent and the rest of routes in RoutesWithUserChatComponent
    <>
      <UserChatComponent /> <Outlet />
    </>
  );
};

export default RoutesWithUserChatComponent;

