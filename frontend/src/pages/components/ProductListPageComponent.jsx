import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";
import PaginationComponent from "../../components/PaginationComponent";
import ProductForListComponent from "../../components/ProductForListComponent";
import SortOptionsComponent from "../../components/SortOptionsComponent";
import PriceFilterComponent from "../../components/filterQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../../components/filterQueryResultOptions/RatingFilterComponent";
import CategoryFilterComponent from "../../components/filterQueryResultOptions/CategoryFilterComponent";
import AttributesFilterComponent from "../../components/filterQueryResultOptions/AttributesFilterComponent.jsx";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";

const ProductListPageComponent = ({ getProducts, categories }) => {
  //create state for list of products from db
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attrsFilter, setAttrsFilter] = useState([]); // collect category attributes from db and show on the webpage
  const [attrsFromFilter, setAttrsFromFilter] = useState([]); // collect user filters for category attributes
  const [showResetFiltersButton, setShowResetFiltersButton] = useState(false);
  const [filters, setFilters] = useState({});
  const [price, setPrice] = useState(1000);
  const [ratingsFromFilter, setRatingsFromFilter] = useState({});
  const [categoriesFromFilter, setCategoriesFromFilter] = useState({});
  const [sortOption, setSortOption] = useState("");
  const [paginationLinksNumber, setPaginationLinksNumber] = useState(null);
  const [pageNum, setPageNum] = useState(null);

  //get cat name from params
  const { categoryName } = useParams() || "";
  const { pageNumParam } = useParams() || 1; //default page number
  const { searchQuery } = useParams() || "";

  const location = useLocation();
  const navigate = useNavigate();

  //get product list
  useEffect(() => {
    getProducts(categoryName, pageNumParam, searchQuery, filters, sortOption)
      .then((products) => {
        setProducts(products.products);
        setPaginationLinksNumber(products.paginationLinksNumber);
        setPageNum(products.pageNum);
        setLoading(false);
      })
      .catch((er) => {
        console.log(er);
        setError(true);
      });
  }, [filters, sortOption, categoryName, pageNumParam, searchQuery]);

  //get category data and attribute
  useEffect(() => {
    if (categoryName) {
      // Find the categoryAllData object in the categories array
      let categoryAllData = categories.find(
        (item) => item.name === categoryName.replaceAll(",", "/")
      );

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
  }, [categoryName, categories]);

  //show product based on submit selected filter
  const handleFilters = () => {
    //navigate(location.pathname.replace(/\/[0-9]+$/, "")); //redirect to first page of pagination when user click filter button
    setShowResetFiltersButton(true);
    setFilters({
      price: price,
      attrs: attrsFromFilter,
      rating: ratingsFromFilter,
      categtory: categoriesFromFilter,
    });
  };

  //reset product
  const resetFilters = () => {
    setShowResetFiltersButton(false);
    setFilters({});
    window.location.href = "/product-list";
  };

  //display attribute list based on selectecd category in filter section
  useEffect(() => {
    // Check if categoriesFromFilter is not empty
    if (Object.entries(categoriesFromFilter).length > 0) {
      // Reset attrsFilter state
      setAttrsFilter([]);
      // Initialize an array to store the unique category names
      let cat = [];
      // Variable to store the count of occurrences of a category name
      let count;
      // Iterate over each category and its checked status
      Object.entries(categoriesFromFilter).forEach(([category, checked]) => {
        if (checked) {
          // Get the main category name
          let name = category.split("/")[0];
          // Add the main category name to the cat array
          cat.push(name);
          // Count the occurrences of the main category name in the cat array
          count = cat.filter((x) => x === name).length;
          // If it's the first occurrence of the main category name, add its attrs to attrsFilter
          if (count === 1) {
            // Find the index of the main category in the categories array
            let index = categories.findIndex((item) => item.name === name);

            // Add the attrs of the main category to the attrsFilter state
            setAttrsFilter((attrs) => [...attrs, ...categories[index].attrs]);
          }
        }
      });
    }
  }, [categoriesFromFilter, categories]);

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item className="mb-2 mt-2">
              <SortOptionsComponent setSortOption={setSortOption} />
            </ListGroup.Item>
            <ListGroup.Item>
              <PriceFilterComponent price={price} setPrice={setPrice} />
            </ListGroup.Item>
            <ListGroup.Item>
              <RatingFilterComponent
                setRatingsFromFilter={setRatingsFromFilter}
              />
            </ListGroup.Item>
            {!location.pathname.match(/\/category/) && (
              <ListGroup.Item>
                <CategoryFilterComponent
                  setCategoriesFromFilter={setCategoriesFromFilter}
                />
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <AttributesFilterComponent
                attrsFilter={attrsFilter}
                setAttrsFromFilter={setAttrsFromFilter}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="primary" onClick={handleFilters}>
                Filter
              </Button>{" "}
              {showResetFiltersButton && (
                <Button variant="danger" onClick={resetFilters}>
                  Reset Filter
                </Button>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          {loading ? (
            <ColorRing
              visible={true}
              height="10rem"
              width="20rem"
              ariaLabel="blocks-loading"
              wrapperStyle={{ marginLeft: "20rem", marginTop: "10rem" }}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
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

          {paginationLinksNumber > 1 ? (
            <PaginationComponent
              categoryName={categoryName}
              searchQuery={searchQuery}
              paginationLinksNumber={paginationLinksNumber}
              pageNum={pageNum}
            />
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPageComponent;
