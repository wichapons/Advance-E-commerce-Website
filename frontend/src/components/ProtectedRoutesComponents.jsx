import { Outlet, Navigate } from "react-router-dom";
import UserChatComponent from "./user/UserChatComponent";

import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginPage from "../pages/LoginPage";

const ProtectedRoutesComponents = ({ admin }) => {
    const [isAuth, setIsAuth] = useState();

    useEffect(() => {
    axios.get("/api/get-token").then(function (res) {

      if (res.data.token) {
        setIsAuth(res.data.token);
        }
        return isAuth;
    });
    }, [isAuth]);

    if (!isAuth) {
        return <LoginPage />;
    }

    if (isAuth && admin && isAuth !== "admin") {
        return <Navigate to="/login" />;
    } else if (isAuth && admin) {
        return <Outlet />;
    } else if (isAuth && !admin) {
        return (
        <>
          <UserChatComponent />
          <Outlet />
        </>
      );
    } else {
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoutesComponents;
