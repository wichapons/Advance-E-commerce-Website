import UsersPageComponent from "./components/UsersPageComponent";

import axios from "axios";

const fetchUsersData = async (abortController) => {
    const response = await axios.get("/api/users", {
        signal: abortController.signal
    });
    return response.data
}
const AdminUsersPage = () => {
  return <UsersPageComponent fetchUsersData={fetchUsersData} />;
};

export default AdminUsersPage;

