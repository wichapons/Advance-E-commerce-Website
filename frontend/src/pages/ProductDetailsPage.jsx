import {Row,Col,Container,Image,ListGroup,Form,Button,Alert,} from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import AddedToCartMessageComponent from "../components/AddedToCartMessageComponent";
import ImageZoom from "js-image-zoom";
import { useEffect } from "react";

const ProductDetailsPage = () => {
  //require to set options for js-zoom-image
  const options = {
    scale: 2,
    offset: { vertical: 0, horizontal: 10 },
  };

  /* Without useEffect can use this code below
const runImageZoomAfterPageLoad = () => {
  new ImageZoom(document.querySelector(".first"), options);
  new ImageZoom(document.querySelector(".second"), options);
  new ImageZoom(document.querySelector(".third"), options);
  new ImageZoom(document.querySelector(".forth"), options);
};

window.onload = runImageZoomAfterPageLoad;
*/

  //use useEffect for execute these command after the whole page is loaded
  useEffect(() => {
    //enable user to zoom the product image
    new ImageZoom(document.querySelector(".first"), options);
    new ImageZoom(document.querySelector(".second"), options);
    new ImageZoom(document.querySelector(".third"), options);
    new ImageZoom(document.querySelector(".fourth"), options);
  },[]);

  return (
    <Container>
      <AddedToCartMessageComponent />
      <Row className="mt-5">
        {/* Left column for display images */}
        <Col style={{ zIndex: "1" }} md={4}>
          <div className="first">
            <Image
              crossOrigin="anonymous"
              fluid
              src="/images/games-category.png"
            />
          </div>
          <br></br>
          <div className="second">
            <Image fluid src="/images/monitors-category.png" />
          </div>
          <br></br>
          <div className="third">
            <Image fluid src="/images/tablets-category.png" />
          </div>
          <br></br>
          <div className="fourth">
            <Image fluid src="/images/games-category.png" />
          </div>
        </Col>
        {/* Right column for display product details */}
        <Col md={8}>
          <Row>
            {/* product name, price,etc */}
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h1>Product Name</h1>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating readonly size={20} initialValue={4} /> (1)
                </ListGroup.Item>
                <ListGroup.Item>
                  Price <span className="fw-bold">$254</span>
                </ListGroup.Item>
                <ListGroup.Item>Product description</ListGroup.Item>
              </ListGroup>
            </Col>

            {/* product status,quantity section  */}
            <Col md={4}>
              <ListGroup>
                <ListGroup.Item> Status: In stock </ListGroup.Item>
                <ListGroup.Item>
                  Price: <span className="fw-bold">$254</span>{" "}
                </ListGroup.Item>
                <ListGroup.Item>
                  Quantity:
                  <Form.Select size="lg" aria-label="Default select example">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </Form.Select>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button variant="danger">Add to cart</Button>
                </ListGroup.Item>
                <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row></Row>

          {/* Review Section */}
          <Row>
            <Col className="mt-2">
              <h4>Reviews</h4>
              <ListGroup variant="flush">
                {Array.from({ length: 4 }).map((item, index) => {
                  return (
                    <ListGroup.Item key={index}>
                      Topazio
                      <br></br>
                      <Rating readonly size={20} initialValue={4} />
                      <br></br>
                      20/0/2220
                      <br></br>
                      Full review here
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Col>
          </Row>

          <hr></hr>

          {/* Review form submission Section */}
          <Row className="mt-3">
            <Alert variant="danger">Login first to write a review</Alert>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Control type="email" placeholder="name@example.com" />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Example textarea</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
              <Form.Select aria-label="Default select example">
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </Form.Select>
              <Button className="mt-3" variant="primary">
                Primary
              </Button>
            </Form>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailsPage;
