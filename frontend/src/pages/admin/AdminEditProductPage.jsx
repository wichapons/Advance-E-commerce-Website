import AdminEditProductPageComponent from "./components/EditProductPageComponent";
import { useSelector } from "react-redux";
import axios from 'axios'

//get product data from db
const fetchProduct = async (productId) => {
  const { data } = await axios.get(`/api/products/get-one/${productId}`);
  return data;
}
//update product details on db
const updateProductApiRequest = async (productId, formInputs) => {
  const { data } = await axios.put(`/api/products/admin/update/${productId}`, { ...formInputs });
    return data;
}

const AdminEditProductPage = () => {
  //get categories data from redux state
  const { categories } = useSelector((state) => state.getCategories);
  
  return (
    <AdminEditProductPageComponent categories={categories} fetchProduct={fetchProduct} updateProductApiRequest ={updateProductApiRequest}/>
  ); 
};

export default AdminEditProductPage;