import { Card, Button, Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Rating } from "react-simple-star-rating";

const ProductForListComponent = ({
  productId,
  name,
  description,
  price,
  images,
  rating,
  reviewsNumber,
}) => {



  return (
    <Card style={{ marginTop: "30px", marginBottom: "40px" }}>
      <Row>
        <Col lg={5}>
          <Card.Img
            crossOrigin="anonymous"
            variant="top"
            src={images[0] ? images[0].path : ''}
          />
        </Col>
        <Col lg={7}>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>
              {description}
            </Card.Text>
            <Card.Text>
              <Rating readonly initialValue={rating} size={20} /> ({reviewsNumber})
            </Card.Text>
            <Card.Text className="h4">
              {price}{" "}
              <LinkContainer to={`/product-details/${productId}`}>
                <Button variant="danger">Detail</Button>
              </LinkContainer>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductForListComponent;
