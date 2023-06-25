import OrderDetailsPageComponent from './components/OrderDetailsPageComponent'
import axios from "axios";

const getOrder = async(id) => {
    const response = await axios.get("/api/orders/user/" + id);
    return response.data;
}

const AdminOrderDetailsPage = () => {
  return (<OrderDetailsPageComponent getOrder={getOrder} />)
};

export default AdminOrderDetailsPage;

