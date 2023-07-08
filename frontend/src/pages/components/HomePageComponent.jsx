import ProductCarouselComponent from "../../components/ProductCarouselComponent";
import CategoryCardComponent from "../../components/CategoryCardComponent";
import { Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

const HomePageComponent = ({ categories }) => {
  const [mainCategories, setMainCategories] = useState([]);

  //render only main category
  useEffect(() => {
    setMainCategories((cat) =>
        //remove category that incl "/" from being rendered
      categories.filter((item) => !item.name.includes("/"))
    );
  }, [categories]);

  console.log(categories);

  return (
    <>
      <ProductCarouselComponent />
      <Container>
        <Row xs={1} md={2} className="g-4 mt-4">
          {mainCategories.map((category, index) => (
            <CategoryCardComponent
              key={index}
              category={category}
            />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default HomePageComponent;
