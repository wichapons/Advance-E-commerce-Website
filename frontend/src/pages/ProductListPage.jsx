import ProductListPageComponent from "./components/ProductListPageComponent";
import axios from 'axios'

const getProducts = async () => {
  const response = await axios.get('/api/products');
  return response.data
}

const ProductListPage = () => {
  return <ProductListPageComponent getProducts={getProducts}/>
};

export default ProductListPage;


