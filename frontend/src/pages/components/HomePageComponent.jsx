import ProductCarouselComponent from "../../components/ProductCarouselComponent";
import CategoryCardComponent from "../../components/CategoryCardComponent";
import { Container,Row } from "react-bootstrap";

const HomePageComponent = () => {
  const categories = [
    "Tablets",
    "Monitors",
    "Games",
    "Printers",
    "Software",
    "Cameras",
    "Books",
    "Videos",
  ];

  const images = [
    "/images/tablets-category.png",
    "/images/monitors-category.png",
    "/images/games-category.png",
    "/images/tablets-category.png",
    "/images/tablets-category.png",
    "/images/tablets-category.png",
    "/images/tablets-category.png",
    "/images/tablets-category.png",
  ];

  return (
    <>
      <ProductCarouselComponent />
      <Container>
        <Row xs={1} md={2} className="g-4 mt-4" >
          {categories.map((category,index) => (
            <CategoryCardComponent key={index} category={categories[index]} src={images[index]}  />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default HomePageComponent;
