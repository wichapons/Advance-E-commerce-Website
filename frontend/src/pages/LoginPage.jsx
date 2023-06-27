import LoginPageComponent from "./components/LoginPageComponent";
import axios from "axios";

//api request
const loginUserApiRequest = async (email, password, doNotLogout) => {
  const response = await axios.post("/api/users/login", { email, password, doNotLogout });
   return response.data;
}

//render login page
const LoginPage = () => {

  return <LoginPageComponent loginUserApiRequest={loginUserApiRequest} />
  };

export default LoginPage;

