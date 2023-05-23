import { Outlet,Navigate } from "react-router-dom";
import UserChatComponent from "./user/UserChatComponent";

const ProtectedRoutesComponents = ({admin})=>{
    if(admin){
        let adminAuth = true;
        return adminAuth ? <Outlet /> : <Navigate to='/login'/> //Outlet is the route behind ProtectedRoutesComponents
    }else{
        let userAuth = true;
        //return 2 react object which are routes behind this component and chat box
        return userAuth ? <> <Outlet /> <UserChatComponent/> </> : <Navigate to='/login'/>  
    }


}

export default ProtectedRoutesComponents;