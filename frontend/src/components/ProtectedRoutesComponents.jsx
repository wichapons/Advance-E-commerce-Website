import { Outlet,Navigate } from "react-router-dom";

const ProtectedRoutesComponents = ()=>{
    const auth = true;
    console.log(auth);
    return auth ? <Outlet /> : <Navigate to='/login'/> //Outlet is the route behind ProtectedRoutesComponents
}

export default ProtectedRoutesComponents;