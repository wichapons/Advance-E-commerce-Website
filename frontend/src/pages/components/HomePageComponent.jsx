import ProductCarouselComponent from "../../components/ProductCarouselComponent";
import CategoryCardComponent from "../../components/CategoryCardComponent";
import { Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import MetaComponent from "../../components/MetaComponents";
import { LinkContainer } from "react-router-bootstrap";
import { Card, Button } from "react-bootstrap";
import { ColorRing } from "react-loader-spinner";

const HomePageComponent = ({ categories, getBestsellers }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [bestSellers, setBestsellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //logic for get bestseller product for each category
  useEffect(() => {
    setIsLoading(true);
    getBestsellers()
      .then((data) => {
        setBestsellers(data);
        setIsLoading(false);
      })
      .catch((er) =>
        console.log(
          er.response.data.message ? er.response.data.message : er.response.data
        )
      );
    setMainCategories((cat) =>
      categories.filter((item) => !item.name.includes("/"))
    );
  }, [categories]);

  return (
    <>
      <MetaComponent />
      <ProductCarouselComponent bestSellers={bestSellers} />
      <Container>
        {isLoading ? (
          <ColorRing
            visible={true}
            height="10rem"
            width="20rem"
            ariaLabel="blocks-loading"
            wrapperStyle={{ marginLeft: "30rem",marginTop:"10rem" }}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        ) : (
          <>
            <Row xs={1} md={2} className="g-4 mt-4">
              {/* ALL Products */}
              <Card>
                <Card.Img
                  style={{
                    objectFit: "cover",
                    height: "20rem",
                    margin: "auto",
                    marginTop: "2%",
                  }}
                  crossOrigin="annonymous"
                  variant="top"
                  src="https://as2.ftcdn.net/v2/jpg/05/64/32/51/1000_F_564325119_VmiDZBldBPnzzXyrggLETgfeGvmwfL0X.jpg"
                />
                <Card.Body style={{ height: "15rem" }}>
                  <Card.Title>All Products</Card.Title>
                  <Card.Text>
                    Feeling overwhelmed with the wide variety of categories
                    available? Look no further! The "All Products" category is
                    designed specifically for those who can't decide where to
                    start or want to explore all options in one place.
                  </Card.Text>
                  <LinkContainer to={`/product-list/`}>
                    <Button variant="primary">View</Button>
                  </LinkContainer>
                </Card.Body>
              </Card>
              {mainCategories.map((category, index) => (
                <CategoryCardComponent key={index} category={category} />
              ))}
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default HomePageComponent;
