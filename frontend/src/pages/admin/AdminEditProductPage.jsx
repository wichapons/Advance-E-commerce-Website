import AdminEditProductPageComponent from "./components/EditProductPageComponent";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveAttributeToCatDoc } from "../../redux/actions/categoryActions";

//get product data from db
const fetchProduct = async (productId) => {
  const { data } = await axios.get(`/api/products/get-one/${productId}`);
  return data;
};
//update product details on db
const updateProductApiRequest = async (productId, formInputs) => {
  const { data } = await axios.put(`/api/products/admin/update/${productId}`, {
    ...formInputs,
  });
  return data;
};

const AdminEditProductPage = () => {
  //get categories data from redux state
  const { categories } = useSelector((state) => state.getCategories);

  const reduxDispatch = useDispatch();

  return (
    <AdminEditProductPageComponent
      categories={categories}
      fetchProduct={fetchProduct}
      updateProductApiRequest={updateProductApiRequest}
      reduxDispatch={reduxDispatch}
      saveAttributeToCatDoc={saveAttributeToCatDoc}
    />
  );
};

export default AdminEditProductPage;
