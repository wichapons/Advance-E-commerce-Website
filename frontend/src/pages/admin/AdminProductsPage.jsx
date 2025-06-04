import ProductsPageComponent from "./components/ProductsPageComponent";

import axios from "axios";

const fetchProducts = async (abortController) => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/admin`, {
        signal: abortController.signal,
    })
    return response.data;
}

const deleteProduct = async (productId) => {
  const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/products/admin/delete/${productId}`);
  return response.data
}

const AdminProductsPage = () => {
  return <ProductsPageComponent fetchProducts={fetchProducts} deleteProduct={deleteProduct} />
};

export default AdminProductsPage;

