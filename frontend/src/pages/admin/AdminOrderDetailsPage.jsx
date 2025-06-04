import OrderDetailsPageComponent from './components/OrderDetailsPageComponent'
import axios from "axios";

const getOrder = async(id) => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/user/` + id);
    return response.data;
}

const markAsDelivered = async (id) => {
  const { data } = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/orders/delivered/` + id);
  if (data) {
      return data;
  }
}

const AdminOrderDetailsPage = () => {
  return (<OrderDetailsPageComponent getOrder={getOrder} markAsDelivered={markAsDelivered} />)
};

export default AdminOrderDetailsPage;

