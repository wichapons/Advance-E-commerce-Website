import { Col, Row, Container, Form, Alert, ListGroup, Button } from "react-bootstrap";
import CartItemComponent from "../../../components/CartItemComponent";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const OrderDetailsPageComponent = ({ getOrder }) => {
  const params = useParams();
  const id = params.id; // already defined in app.jsx
  const [userInfo, setUserInfo] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [orderButtonMessage, setOrderButtonMessage] = useState('Mark as delivered');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    getOrder(id)
      .then((order) => {
        // set user info
        setUserInfo(order.user);
        // set payment method
        setPaymentMethod(order.paymentMethod);
        // set product payment status   
        order.isPaid ? setIsPaid(order.paidAt) : setIsPaid(false);
        // set product delivery status
        order.isDelivered ? setIsDelivered(order.deliveredAt) : setIsDelivered(false);
        // set total price
        setCartSubtotal(order.totalOrder.cartSubtotal);
        // if product is delivered disable the button
        if (order.isDelivered) {
          setOrderButtonMessage("Order is finished");
          setButtonDisabled(true);
        }
        setCartItems(order.cartItems);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
            console.log(err.response.data.message);
          } else if (err.response && err.response.data) {
            console.log(err.response.data);
          } else {
            console.log(err);
          }
      });
  }, [isDelivered, id,isPaid]); // useEffect will be activated when isDelivered or id is changed

  return (
    <Container fluid>
      <Row className="mt-4">
        <h1>Order Details</h1>
        <Col md={8}>
          <br />
          <Row>
            <Col md={6}>
              <h2>Shipping</h2>
              <b>Name</b>: {userInfo.name} {userInfo.lastName} <br />
              <b>Address</b>: {userInfo.address} {userInfo.city} {userInfo.state} {userInfo.zipCode} <br />
              <b>Phone</b>: {userInfo.phoneNumber}
            </Col>
            <Col md={6}>
              <h2>Payment method</h2>
              <Form.Select value={paymentMethod} disabled={true}>
                <option value="pp">PayPal</option>
                <option value="cod">Cash On Delivery (delivery may be delayed)</option>
              </Form.Select>
            </Col>
            <Row>
              <Col>
                <Alert className="mt-3" variant={isDelivered ? "success" : "danger"}>
                  {isDelivered ? <>Delivered at {isDelivered}</> : <>Not delivered</>}
                </Alert>
              </Col>
              <Col>
                <Alert className="mt-3" variant={isPaid ? "success" : "danger"}>
                  {isPaid ? <>Paid on {isPaid}</> : <>Not paid yet</>}
                </Alert>
              </Col>
            </Row>
          </Row>
          <br />
          <h2>Order items</h2>
          <ListGroup variant="flush">
            {cartItems.map((item, idx) => (
              <CartItemComponent key={idx} item={item} orderCreated={true} />
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>Order summary</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Items price (after tax): <span className="fw-bold">${cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Shipping: <span className="fw-bold">included</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Tax: <span className="fw-bold">included</span>
            </ListGroup.Item>
            <ListGroup.Item className="text-danger">
              Total price: <span className="fw-bold">${cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid gap-2">
                <Button size="lg" disabled={buttonDisabled} variant="danger" type="button">
                  {orderButtonMessage}
                </Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetailsPageComponent;