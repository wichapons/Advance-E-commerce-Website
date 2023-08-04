import RegisterPageComponent from "./components/RegisterPageComponent";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setReduxUserState } from "../redux/actions/userActions";

const registerUserApiRequest = async (name, lastName, email, password) => {
    const response = await axios.post("/api/users/register", { name, lastName, email, password });
    //sessionStorage.setItem("userInfo", JSON.stringify(response.userCreated)); //convert object from response to JSON
    if (response.status === 200 || response.status === 201){
        window.location.href = "/login"; //redirect to /user 
      }
    return response.data;
}

const RegisterPage = () => {
  const reduxDispatch = useDispatch();
  return <RegisterPageComponent registerUserApiRequest={registerUserApiRequest}  reduxDispatch={reduxDispatch} setReduxUserState={setReduxUserState} />
};

export default RegisterPage;