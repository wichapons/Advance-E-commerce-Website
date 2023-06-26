import { Container, Row, Col, Alert, ListGroup, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import CartItemComponent from "../components/CartItemComponent";
import React from "react";

const CartPage = () => {
  return (
    <Container fluid>
      <Row className="mt-4">
        {/*Shopping Cart column*/}
        <Col md={8} >
          <h1>Shopping Cart</h1>
          <ListGroup variant="flush">
          {Array.from({ length: 3 }).map((item, idx) => (
              <CartItemComponent item={{image: {path:"/images/tablets-category.png"}, name: "Product name", price:10, count:10, quantity:10}} key={idx} />
            ))}

          </ListGroup>
          
          <Alert variant="info">Your cart is empty</Alert>
        </Col>

        {/* Total Product Column */}
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>Subtotal (2 Items)</h3>
            </ListGroup.Item>

            <ListGroup.Item>
              Price: <span className="fw-bold">$892</span>
            </ListGroup.Item>

            <ListGroup.Item>
              <LinkContainer to="/user/cart-details">
                <Button type="button">Proceed To Checkout</Button>
              </LinkContainer>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
