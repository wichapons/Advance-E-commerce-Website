import AdminCreateProductPageComponent from "./components/CreateProductPageComponent";
import axios from 'axios';

const createProductApiRequest = async (formInputs) => {
  const { data } = await axios.post(`/api/products/admin/create`, { ...formInputs });
  console.log(data);
  return data;
}

const uploadImagesApiRequest = async (images, productId) => {
  const formData = new FormData();
  Array.from(images).forEach(image => {
      formData.append("images", image);
  })
  await axios.post("/api/products/admin/upload?productId=" + productId, formData);
}

// Upload images to Cloudinary using the Cloudinary API
const uploadImagesCloudinaryApiRequest = (images,productId) => {
  const url = "https://api.cloudinary.com/v1_1/dh8pai5kc/image/upload";
  const formData = new FormData();

  // Loop through the images array
  for (let i = 0; i < images.length; i++) {
    let file = images[i];
    // Append each image file and the upload preset to the form data
    formData.append("file", file);
    formData.append("upload_preset", "zvwslytd");
    // Send a POST request to the Cloudinary API
      axios.post(url,formData)
      .then(res => {
        //update images path in database
        axios.post("/api/products/admin/upload?cloudinary=true&productId=" + productId, res.data);
      })
      .catch(error => {
        console.error(error); // Handle any errors
      });
  }
}

const AdminCreateProductPage = () => {
  return (
    <AdminCreateProductPageComponent createProductApiRequest={createProductApiRequest} uploadImagesApiRequest={uploadImagesApiRequest} uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest}/>
  );
};

export default AdminCreateProductPage;