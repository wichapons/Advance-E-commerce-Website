import OrdersPageComponent from "./components/OrdersPageComponent";
import axios from "axios";

const getOrders = async() => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/admin`);
    return response.data
}

const AdminOrdersPage = () => {
  return <OrdersPageComponent getOrders={getOrders} />
};

export default AdminOrdersPage;

