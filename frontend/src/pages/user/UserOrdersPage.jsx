import UserOrdersPageComponent from "./components/UserOrdersPageComponent";
import axios from "axios";

const UserOrdersPage = () => {  const getOrders = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders`);
    return data;
}
  return (
    <UserOrdersPageComponent getOrders={getOrders}/>
  );
};

export default UserOrdersPage;

