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

  //for delete image in the database
  const imageDeleteHandler = async (imagePath, productId) => {
    let encoded = encodeURIComponent(imagePath); //encode first because there is some / in our text
    await axios
      .delete(`/api/products/admin/image/${encoded}/${productId}`)
      .then((res) => {
        console.log(res.data);
      });
  };

  const uploadHandler = async (images, productId) => {
    const formData = new FormData();

    // Loop through the images array and append each image to the form data
    Array.from(images).forEach((image) => {
      formData.append("images", image);
    });

    // Send a POST request to the server with the form data
    // The productId is included as a query parameter in the URL
    await axios.post(
      "/api/products/admin/upload?productId=" + productId,
      formData
    );
  };

  return (
    <AdminEditProductPageComponent
      categories={categories}
      fetchProduct={fetchProduct}
      updateProductApiRequest={updateProductApiRequest}
      reduxDispatch={reduxDispatch}
      saveAttributeToCatDoc={saveAttributeToCatDoc}
      imageDeleteHandler={imageDeleteHandler}
      uploadHandler={uploadHandler}
    />
  );
};

export default AdminEditProductPage;
