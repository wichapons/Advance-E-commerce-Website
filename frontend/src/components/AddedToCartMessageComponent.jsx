import { Alert, Button } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";

const AddedToCartMessageComponent = () => {
  const [show, setShow] = useState(true);
  return (
    <Alert
      show={show}
      variant="success"
      onClose={() => setShow(false)}
      dismissible
    >
      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      <p>The product has been added to cart successfully.</p>
      <Link to="/home">
        <Button className="me-2" variant="success">Back to homepage</Button>
      </Link>

      <Link to="/cart">
        <Button variant="danger">Go to cart</Button>
      </Link>
    </Alert>
  );
};

export default AddedToCartMessageComponent;
