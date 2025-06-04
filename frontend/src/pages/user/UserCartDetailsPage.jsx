import UserCartDetailsPageComponent from "./components/UserCartDetailsPageComponent";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions/cartActions";
import axios from "axios";

const UserCartDetailsPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

  const reduxDispatch = useDispatch();
  const getUser = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile/` + userInfo._id);
    return data
}  //send order update to db
  const createOrder = async (orderData) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, { ...orderData });
    return response.data;
  }

  return (
    <UserCartDetailsPageComponent
      cartItems={cartItems}
      itemsCount={itemsCount}
      cartSubtotal={cartSubtotal}
      addToCart={addToCart}
      removeFromCart={removeFromCart}
      reduxDispatch={reduxDispatch}
      getUser={getUser}
      userInfo={userInfo}
      createOrder={createOrder}
    />
  );
};

export default UserCartDetailsPage;
