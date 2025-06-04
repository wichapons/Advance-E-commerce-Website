import UserOrdersPageComponent from "./components/UserOrdersPageComponent";
import axios from "axios";

const UserOrdersPage = () => {
  const getOrders = async () => {
    const { data } = await axios.get("/api/orders");
    return data;
}
  return (
    <UserOrdersPageComponent getOrders={getOrders}/>
  );
};

export default UserOrdersPage;

