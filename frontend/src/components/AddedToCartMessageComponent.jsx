import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AddedToCartMessageComponent = ({showCartMessage,setShowCartMessage}) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
}
  return (
    <Alert
      show={showCartMessage}
      variant="success"
      onClose={() => setShowCartMessage(false)}
      dismissible
    >
      <p>The product has been added to cart successfully.</p>
      <Link to="/cart">
        <Button className="me-2" variant="success" onClick={goBack}>Back to homepage</Button>
      </Link>

      <Link to="/cart">
        <Button variant="danger">Go to cart</Button>
      </Link>
    </Alert>
  );
};

export default AddedToCartMessageComponent;
