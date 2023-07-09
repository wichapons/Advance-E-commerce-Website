import ProductCarouselComponent from "../../components/ProductCarouselComponent";
import CategoryCardComponent from "../../components/CategoryCardComponent";
import { Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

const HomePageComponent = ({ categories,getBestsellers }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [bestSellers, setBestsellers] = useState([]);

  //logic for get bestseller product for each category
  useEffect(() => {
    getBestsellers()
    .then((data) => {
        setBestsellers(data);
    })
    .catch((er) => console.log(er.response.data.message ? er.response.data.message : er.response.data));
    setMainCategories((cat) => categories.filter((item) => !item.name.includes("/")));
}, [categories])

  return (
    <>
      <ProductCarouselComponent bestSellers={bestSellers} />
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
