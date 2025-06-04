import ProductsPageComponent from "./components/ProductsPageComponent";

import axios from "axios";

const fetchProducts = async (abortController) => {
    const response = await axios.get("/api/products/admin", {
        signal: abortController.signal,
    })
    return response.data;
}

const deleteProduct = async (productId) => {
  const response = await axios.delete(`/api/products/admin/delete/${productId}`);
  return response.data
}

const AdminProductsPage = () => {
  return <ProductsPageComponent fetchProducts={fetchProducts} deleteProduct={deleteProduct} />
};

export default AdminProductsPage;

