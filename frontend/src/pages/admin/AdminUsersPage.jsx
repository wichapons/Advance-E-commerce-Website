import UsersPageComponent from "./components/UsersPageComponent";

import axios from "axios";

const fetchUsersData = async (abortController) => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
        signal: abortController.signal
    });
    return response.data;
}

const deleteUser = async (userId) => {
  const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`);
  return response.data;
}

const AdminUsersPage = () => {
  return <UsersPageComponent fetchUsersData={fetchUsersData} deleteUser={deleteUser} />;
};

export default AdminUsersPage;

