import UserProfilePageComponent from "./components/UserProfilePageComponent";
import axios from 'axios'

const UserProfilePage = () => {
  const updateUserApiRequest = async(name, lastName, phoneNumber, address, country, zipCode, city, state, password) => {
    const response = await axios.put(
        '/api/users/profile',
        { name, lastName, phoneNumber, address, country, zipCode, city, state, password }
    )
    return response.data
}
  return <UserProfilePageComponent updateUserApiRequest={updateUserApiRequest}/>
};

export default UserProfilePage;

