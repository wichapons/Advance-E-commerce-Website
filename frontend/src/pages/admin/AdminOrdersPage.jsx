import OrdersPageComponent from "./components/OrdersPageComponent";
import axios from "axios";

const getOrders = async() => {
    const response = await axios.get("/api/orders/admin");
    console.log(response);
    return response.data
}

const AdminOrdersPage = () => {
  return <OrdersPageComponent getOrders={getOrders} />
};

export default AdminOrdersPage;

