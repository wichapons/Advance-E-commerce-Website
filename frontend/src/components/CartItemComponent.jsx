import { Row, Col, Image, ListGroup, Form, Button } from "react-bootstrap";

const CartItemComponent = ({item,orderCreated = false}) => { //orderCreated control to gray out the select amount of product input
  return (
    <>
    <ListGroup.Item >
        <Row>
          <Col md={2}>
          {/* PRODUCT DETAILS */}
          <Image crossOrigin="anonymous" src={item.image ? (item.image.path ? item.image.path : null) : null} fluid/>
          </Col>
          <Col md={2}>{item.name}</Col>
          <Col md={2}>
            <b>${item.price}</b>
          </Col>
          <Col md={3}>
            <Form.Select disabled={orderCreated} value={item.quantity}>
              {[...Array(item.count).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => window.confirm("Are you sure?")}
            >
              <i className="bi bi-trash"></i>
            </Button>
          </Col>
        </Row>
      </ListGroup.Item>
      <br />
    </>
  );
};

export default CartItemComponent;