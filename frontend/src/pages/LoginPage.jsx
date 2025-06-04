import LoginPageComponent from "./components/LoginPageComponent";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setReduxUserState } from "../redux/actions/userActions";

//api request
const loginUserApiRequest = async (email, password, doNotLogout) => {
  const response = await axios.post("/api/users/login", { email, password, doNotLogout });

  if (response.data.userLoggedIn.doNotLogout) {
    localStorage.setItem("userInfo", JSON.stringify(response.data.userLoggedIn));
  }
  else sessionStorage.setItem("userInfo", JSON.stringify(response.data.userLoggedIn));
  
  return response.data;
}

//render login page
const LoginPage = () => {
  const reduxDispatch = useDispatch();

  return <LoginPageComponent loginUserApiRequest={loginUserApiRequest} reduxDispatch={reduxDispatch} setReduxUserState={setReduxUserState}  />
  };

export default LoginPage;

