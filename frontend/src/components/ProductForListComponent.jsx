import { Card, Button, Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Rating } from "react-simple-star-rating";

const ProductForListComponent = (props) => {
  return (
    <Card style={{ marginTop: "30px", marginBottom: "40px" }}>
      <Row>
        <Col lg={5}>
          <Card.Img crossOrigin="anonymous" variant="top" src={"/images/"+props.images[props.index]+"-category.png"} />
        </Col>

        <Col lg={7}>
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Card.Text>
              <Rating readonly initialValue={5} size={20} /> (1)
            </Card.Text>
            <Card.Text className="h4" >
              $12 {' '}
              <LinkContainer to="/product-details">
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
