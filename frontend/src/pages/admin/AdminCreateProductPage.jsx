import AdminCreateProductPageComponent from "./components/CreateProductPageComponent";
import axios from "axios";
import {uploadImagesApiRequest, uploadImagesCloudinaryApiRequest,} from "./utils/utils";
import { useSelector } from "react-redux";
import { newCategory,deleteCategory,saveAttributeToCatDoc } from "../../redux/actions/categoryActions";
import { useDispatch } from "react-redux";


const createProductApiRequest = async (formInputs) => {
  const { data } = await axios.post(`/api/products/admin/create`, {
    ...formInputs,
  });
  return data;
};

const AdminCreateProductPage = () => {
  //get category data from db
  const { categories } = useSelector((state) => state.getCategories);
  const dispatch = useDispatch();

  return (
    <AdminCreateProductPageComponent
      createProductApiRequest={createProductApiRequest}
      uploadImagesApiRequest={uploadImagesApiRequest}
      uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest}
      categories={categories}
      reduxDispatch={dispatch}
      newCategory={newCategory}
      deleteCategory={deleteCategory}
      saveAttributeToCatDoc ={saveAttributeToCatDoc }
    />
  );
};

export default AdminCreateProductPage;
