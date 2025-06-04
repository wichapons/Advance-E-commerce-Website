import AdminEditProductPageComponent from "./components/EditProductPageComponent";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveAttributeToCatDoc } from "../../redux/actions/categoryActions";
import { uploadImagesApiRequest,uploadImagesCloudinaryApiRequest } from "./utils/utils";

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

  //for delete image in the database
  const imageDeleteHandler = async (imagePath, productId) => {
    let encoded = encodeURIComponent(imagePath); //encode first because there is some / in our text
    if (import.meta.env.VITE_NODE_ENV === "uploadLocal") {
      // to do: change to !==
      await axios
      .delete(`/api/products/admin/image/${encoded}/${productId}`)
      .then((res) => {
      });
    }else{
      await axios.delete(`/api/products/admin/image/${encoded}/${productId}?cloudinary=true`);  
    }
      
  }



  return (
    <AdminEditProductPageComponent
      categories={categories}
      fetchProduct={fetchProduct}
      updateProductApiRequest={updateProductApiRequest}
      reduxDispatch={reduxDispatch}
      saveAttributeToCatDoc={saveAttributeToCatDoc}
      imageDeleteHandler={imageDeleteHandler}
      uploadImagesApiRequest={uploadImagesApiRequest}
      uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest}
      
    />
  );
};

export default AdminEditProductPage;
