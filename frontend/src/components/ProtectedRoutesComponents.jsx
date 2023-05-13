import { Outlet,Navigate } from "react-router-dom";

const ProtectedRoutesComponents = ({admin})=>{
    let auth;
    if(admin){
        let adminAuth = true;
        if (adminAuth){
            auth = true;
        }
    }else{
        let userAuth = true;
        if(userAuth){
            auth = true;
        }
    }

    return auth ? <Outlet /> : <Navigate to='/login'/> //Outlet is the route behind ProtectedRoutesComponents

}

export default ProtectedRoutesComponents;