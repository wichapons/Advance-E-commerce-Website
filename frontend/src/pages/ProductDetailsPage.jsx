import ProductDetailsPageComponent from "./components/ProductDetailsPageComponent";
import { addToCart } from "../redux/actions/cartActions";
import { useDispatch,useSelector  } from "react-redux";
import axios from 'axios'

const getProductDetails = async(id) => {
    const { data } = await axios.get(`/api/products/get-one/${id}`);
    return data
}

//send new user review to database 
const writeReviewApiRequest = async (productId, formInputs) => {
  const { data } = await axios.post(`/api/users/review/${productId}`, { ...formInputs });
  return data;
}

const ProductDetailsPage = () => {
  const dispatch = useDispatch();
  //get user login data from redux state
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

  return <ProductDetailsPageComponent  addToCartReduxAction={addToCart} reduxDispatch={dispatch} getProductDetails={getProductDetails} userInfo={userInfo} writeReviewApiRequest={writeReviewApiRequest}  />
};

export default ProductDetailsPage;
