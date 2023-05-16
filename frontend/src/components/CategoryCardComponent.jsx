import { Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CategoryCardComponent = (props) => {
  return (
    <Card>
      <Card.Img crossOrigin="annonymous" variant="top" src={props.src} />
      <Card.Body>
        <Card.Title>{props.category}</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <LinkContainer to={"/product-list"}>
          <Button variant="primary">View</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
};

export default CategoryCardComponent;
