import UsersPageComponent from "./components/UsersPageComponent";

import axios from "axios";

const fetchUsersData = async (abortController) => {
    const {data} = await axios.get("/api/users", {
        signal: abortController.signal,
    });
    return data
}
const AdminUsersPage = () => {
  return <UsersPageComponent fetchUsersData={fetchUsersData} />;
};

export default AdminUsersPage;

