import RegisterPageComponent from "./components/RegisterPageComponent";
import axios from "axios";

const registerUserApiRequest = async (name, lastName, email, password) => {
    const response = await axios.post("/api/users/register", { name, lastName, email, password });
    return response.data;
}

const RegisterPage = () => {
  
  return <RegisterPageComponent registerUserApiRequest={registerUserApiRequest} />
};

export default RegisterPage;