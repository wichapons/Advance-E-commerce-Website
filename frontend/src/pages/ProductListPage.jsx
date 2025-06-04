import ProductListPageComponent from "./components/ProductListPageComponent";
import axios from 'axios';
import { useSelector } from "react-redux";

//logic for get filter url
const proceedFilters = (filters) => {
  // Initialize the filtersUrl variable
  let filtersUrl = ""
  // Iterate over the keys of the filters object
  Object.keys(filters).map((key, index) => {
    if (key === "price") {
      // Add the price filter to the filtersUrl
      filtersUrl += `&price=${filters[key]}`;
    } else if (key === "rating") {
      // Handle the rating filter
      let rat = "";
      Object.keys(filters[key]).map((key2, index2) => {
        if (filters[key][key2]) {
          rat += `${key2},` //add up each found rating in filter request
        };
        return "";
      });
      filtersUrl += "&rating=" + rat;
    } else if (key === "category") {
      // Handle the category filter
      let cat = "";
      Object.keys(filters[key]).map((key3, index3) => {
        if (filters[key][key3]) cat += `${key3},`;
        return "";
      });
      filtersUrl += "&category=" + cat;
    } else if (key === "attrs") {
      // Handle the attrs filter
      if (filters[key].length > 0) {
        let val = filters[key].reduce((acc, item) => {
          let key = item.key;
          let val = item.values.join("-");
          return acc + key + "-" + val + ",";
        }, "");
        filtersUrl += "&attrs=" + val;
      }
    }
    return "";
  });
  // Return the constructed filtersUrl
  return filtersUrl;
};


// fetching products from db depends on filter
const getProducts = async (categoryName = "", pageNumParam = null, searchQuery = "", filters = {}, sortOption = "") => {
  
  let filtersUrl = proceedFilters(filters);  //expected format: filtersUrl = "&price=60&rating=1,2,3&category=a,b,c,d&attrs=color-red-blue,size-1TB-2TB";
  const search = searchQuery ? `search/${searchQuery}/` : "";
  const category = categoryName ? `category/${categoryName}/` : "";
  const url = `/api/products/${category}${search}?pageNum=${pageNumParam}${filtersUrl}&sort=${sortOption}`;

  const response = await axios.get(url);
  return response.data
}


const ProductListPage = () => {

  //get categories from redux state
const { categories } = useSelector((state) => state.getCategories);

  return <ProductListPageComponent getProducts={getProducts} categories={categories}/>
};

export default ProductListPage;


