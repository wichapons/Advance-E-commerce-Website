import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";
import PaginationComponent from "../../components/PaginationComponent";
import ProductForListComponent from "../../components/ProductForListComponent";
import SortOptionsComponent from "../../components/SortOptionsComponent";
import PriceFilterComponent from "../../components/filterQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../../components/filterQueryResultOptions/RatingFilterComponent";
import CategoryFilterComponent from "../../components/filterQueryResultOptions/CategoryFilterComponent";
import AttributesFilterComponent from "../../components/filterQueryResultOptions/AttributesFilterComponent.jsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductListPageComponent = ({ getProducts,categories }) => {
  
  //create state for list of products from db
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attrsFilter, setAttrsFilter] = useState([]); // collect category attributes from db and show on the webpage
  const [attrsFromFilter, setAttrsFromFilter] = useState([]);// collect user filters for category attributes
  const [showResetFiltersButton, setShowResetFiltersButton] = useState(false);
  const [filters, setFilters] = useState({});
  const [price, setPrice] = useState(500);
  const [ratingsFromFilter, setRatingsFromFilter] = useState({});
  const [categoriesFromFilter, setCategoriesFromFilter] = useState({});


  //get cat name from params
  const { categoryName } = useParams() || "";

  //get product list
  useEffect(() => {
    getProducts()
      .then((products) => {
        setProducts(products.products);
        setLoading(false);
      })
      .catch((er) => {
        console.log(er);
        setError(true);
      });
      console.log(filters);
  }, [filters]);

  //get category data and attribute
  useEffect(() => {
    if (categoryName) {
      // Find the categoryAllData object in the categories array
        let categoryAllData = categories.find((item) => item.name === categoryName.replaceAll(",", "/"));
    
        // If categoryAllData exists
        if (categoryAllData) {
          // Get the main category from the categoryAllData's name
            let mainCategory = categoryAllData.name.split("/")[0];
            // Find the index of the main category in the categories array
            let index = categories.findIndex((item) => item.name === mainCategory);
            // Set the attrsFilter state to the attrs of the main category
            setAttrsFilter(categories[index].attrs);
        }
    } else {
        setAttrsFilter([]);
    }
}, [categoryName, categories])

//show product based on submit selected filter
const handleFilters = () => {
  setShowResetFiltersButton(true);
  setFilters({
    price:price,
    attrs: attrsFromFilter,
    rating: ratingsFromFilter,
    categtory:categoriesFromFilter
  })
}

//reset product
const resetFilters = () => {
  setShowResetFiltersButton(false);
  setFilters({});
  window.location.href = "/product-list";
}


  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item className="mb-2 mt-2">
              <SortOptionsComponent />
            </ListGroup.Item>
            <ListGroup.Item>
              <PriceFilterComponent price={price} setPrice={setPrice} />
            </ListGroup.Item>
            <ListGroup.Item>
              <RatingFilterComponent setRatingsFromFilter={setRatingsFromFilter}/>
            </ListGroup.Item>
            <ListGroup.Item>
              <CategoryFilterComponent setCategoriesFromFilter={setCategoriesFromFilter} />
            </ListGroup.Item>
            <ListGroup.Item>
              <AttributesFilterComponent attrsFilter={attrsFilter} setAttrsFromFilter={setAttrsFromFilter}/>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="primary"  onClick={handleFilters}>Filter</Button>{" "}
              {showResetFiltersButton && (
                <Button variant="danger" onClick={resetFilters} >Reset Filter</Button>
              )}

              
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          {loading ? (
            <h1>Loading products ....</h1>
          ) : error ? (
            <h1>Error while loading products. Try again later.</h1>
          ) : (
            products.map((product) => (
              <ProductForListComponent
                key={product._id}
                images={product.images}
                name={product.name}
                description={product.description}
                price={product.price}
                rating={product.rating}
                reviewsNumber={product.reviewsNumber}
                productId={product._id}
              />
            ))
          )}

          <PaginationComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPageComponent;
