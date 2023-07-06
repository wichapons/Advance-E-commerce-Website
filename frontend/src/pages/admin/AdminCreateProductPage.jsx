import AdminCreateProductPageComponent from "./components/CreateProductPageComponent";
import axios from 'axios';
import { uploadImagesApiRequest,uploadImagesCloudinaryApiRequest } from "./utils/utils";

const createProductApiRequest = async (formInputs) => {
  const { data } = await axios.post(`/api/products/admin/create`, { ...formInputs });
  console.log(data);
  return data;
}

const AdminCreateProductPage = () => {
  return (
    <AdminCreateProductPageComponent createProductApiRequest={createProductApiRequest} uploadImagesApiRequest={uploadImagesApiRequest} uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest}/>
  );
};

export default AdminCreateProductPage;