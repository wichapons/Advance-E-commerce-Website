import RegisterPageComponent from "./components/RegisterPageComponent";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setReduxUserState } from "../redux/actions/userActions";

const registerUserApiRequest = async (name, lastName, email, password) => {
    const response = await axios.post("/api/users/register", { name, lastName, email, password });
    return response.data;
}

const RegisterPage = () => {
  const reduxDispatch = useDispatch();
  return <RegisterPageComponent registerUserApiRequest={registerUserApiRequest}  reduxDispatch={reduxDispatch} setReduxUserState={setReduxUserState} />
};

export default RegisterPage;