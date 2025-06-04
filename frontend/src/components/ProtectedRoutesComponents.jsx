import { Outlet, Navigate } from "react-router-dom";
import UserChatComponent from "./user/UserChatComponent";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginPage from "../pages/LoginPage";
import { ColorRing } from "react-loader-spinner";

const ProtectedRoutesComponents = ({ isAdminPage }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    axios.get("/api/get-token").then(function (res) {
      if (res.data) {
        setIsAuth(res.data.token);
        setIsAdmin(res.data.isAdmin);
      } else {
        setIsAuth(false);
        setIsAdmin(false);
      }
      return;
    });
  }, [isAuth, isAdmin]);

  //while verifying Cookie & Token render loading ring
  if (isAuth === null || isAdmin === null) {
    return (
      <ColorRing
        visible={true}
        height="10rem"
        width="20rem"
        ariaLabel="blocks-loading"
        wrapperStyle={{ marginLeft: "30rem", marginTop: "10rem" }}
        wrapperClass="blocks-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    );
  }
  //render loginPage if not authorise
  else if (isAuth === false) {
    return <LoginPage />;
  } else if (isAuth && isAdminPage && isAdmin) {
    return <Outlet />;
  } else if (isAuth && !isAdmin && !isAdminPage ) {
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
