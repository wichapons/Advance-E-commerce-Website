import UsersPageComponent from "./components/UsersPageComponent";

import axios from "axios";

const fetchUsersData = async (abortController) => {
    const response = await axios.get("/api/users", {
        signal: abortController.signal
    });
    console.log(response);
    return response.data;
}

const deleteUser = async (userId) => {
  const response = await axios.delete(`/api/users/${userId}`);
  console.log(response);
  return response.data;
}

const AdminUsersPage = () => {
  return <UsersPageComponent fetchUsersData={fetchUsersData} deleteUser={deleteUser} />;
};

export default AdminUsersPage;

