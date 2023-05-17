import { Carousel } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const ProductCarouselComponent = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          crossOrigin="annonymous"
          className="d-block w-100"
          style={{ height: "300px", objectFit: "cover" }}
          src="/images/carousel/carousel-1.png"
          alt="First slide"
        />
        <Carousel.Caption>
          <LinkContainer style={{ cursor: "pointer" }} to="/product-details">
            <h3></h3>
          </LinkContainer>
          <p></p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/carousel/carousel-2.png"
          style={{ height: "300px", objectFit: "cover" }}
          alt="Second slide"
        />
        <Carousel.Caption>
          <LinkContainer style={{ cursor: "pointer" }} to="/product-details">
            <h3>Second slide label</h3>
          </LinkContainer>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          style={{ height: "300px", objectFit: "cover" }}
          src="/images/carousel/carousel-3.png"
          alt="Third slide"
        />
        <Carousel.Caption>
          <LinkContainer style={{ cursor: "pointer" }} to="/product-details">
            <h3>Third slide label</h3>
          </LinkContainer>

          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ProductCarouselComponent;
