import {Row,Col,Container,Image,ListGroup,Form,Button,Alert} from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import AddedToCartMessageComponent from "../../components/AddedToCartMessageComponent";
import ImageZoom from "js-image-zoom";
import { useEffect, useState, useRef } from "react";
import MetaComponent from "../../components/MetaComponents";
import { ColorRing } from "react-loader-spinner";
import { useParams } from "react-router-dom";

const ProductDetailsPageComponent = ({
  addToCartReduxAction,
  reduxDispatch,
  getProductDetails,
  userInfo,
  writeReviewApiRequest
}) => {
  const getParams = useParams();
  const id = getParams.id;
  const [showCartMessage, setShowCartMessage] = useState(false);
  //set number of avilable items
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [productReviewed, setProductReviewed] = useState(false);

  const messageEndRef = useRef(null);

  //add dispatch redux to update amount of item added to cart
  const addToCartHandler = () => {
    reduxDispatch(addToCartReduxAction(id, quantity));
    setShowCartMessage(true);
  };

  //use useEffect for execute these command after the whole page is loaded
  useEffect(() => {
    if (product.images) {
      //require to set options for js-zoom-image
      const options = {
        scale: 2,
        offset: { vertical: 0, horizontal: 10 },
      };

      //enable user to zoom the product image
      product.images.map(
        (image, id) =>
          new ImageZoom(document.getElementById(`imageId${id + 1}`), options)
      );
    }
  });

  //get product details
  useEffect(() => {
    getProductDetails(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((er) =>
        setError(
          er.response.data.message ? er.response.data.message : er.response.data
        )
      );
  }, [id,productReviewed]);

  //add user review
  const sendReviewHandler = (e) => {
    e.preventDefault();
    const formElement = e.currentTarget.elements;
    const formInputs = {
        comment: formElement.comment.value,
        rating: formElement.rating.value,
    }
    if (e.currentTarget.checkValidity() === true) {
      writeReviewApiRequest(product._id,formInputs)
      .then(data => {
        if (data === "review created") {
            setProductReviewed("You successfuly reviewed the page!");
        }
    })
    .catch((er) => setProductReviewed( er.response.data.message ? er.response.data.message : er.response.data))
}}

//scroll down to the newest review, when user submit a review
useEffect(() => {
  if (productReviewed) {
      setTimeout(() => {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 200)
  }  
}, [productReviewed])


  return (
    <>
    <MetaComponent title={product.name} description={product.description}/>
    <Container>
      <AddedToCartMessageComponent
        showCartMessage={showCartMessage}
        setShowCartMessage={setShowCartMessage}
      />
      <Row className="mt-5">
        {loading ? (
          <ColorRing
              visible={true}
              height="7rem"
              width="7rem"
              ariaLabel="blocks-loading"
              wrapperStyle={{marginTop: "10rem" }}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
        ) : error ? (
          <h2>{error}</h2>
        ) : (
          <>
            {/* Left column for display images */}
            <Col style={{ zIndex: "1" }} md={4}>
              {product.images
                ? product.images.map((image, id) => (
                    <div key={id}>
                      <div key={id} id={`imageId${id + 1}`}>
                        <Image
                          crossOrigin="anonymous"
                          fluid
                          src={`${image.path ?? null}`}
                        />
                      </div>
                      <br />
                    </div>
                  ))
                : null}
            </Col>
            {/* Right column for display product details */}
            <Col md={8}>
              <Row>
                {/* product name, price,etc */}
                <Col md={8}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h1>{product.name}</h1>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating
                        readonly
                        size={20}
                        initialValue={product.rating}
                      />{" "}
                      {product.reviewNumber}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Price <span className="fw-bold">${product.price}</span>
                    </ListGroup.Item>
                    <ListGroup.Item>{product.description}</ListGroup.Item>
                  </ListGroup>
                </Col>

                {/* product status,quantity section  */}
                <Col md={4}>
                  <ListGroup>
                    <ListGroup.Item>
                      {" "}
                      Status: {product.count > 0
                        ? "in stock"
                        : "out of stock"}{" "}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Price: <span className="fw-bold">${product.price}</span>{" "}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Quantity:
                      <Form.Select
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        size="sm"
                        aria-label="Default select example"
                      >
                        {[...Array(product.count).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Select>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Button
                        onClick={() => {
                          addToCartHandler();
                        }}
                        variant="danger"
                      >
                        Add to cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              <Row></Row>

              {/* Review Section */}
              <Row>
                <Col className="mt-2">
                  <h4>Reviews</h4>
                  <ListGroup variant="flush">
                  {product.reviews && product.reviews.map((review, idx) => (
                        <ListGroup.Item key={idx}>
                          {review.user.name} <br />
                          <Rating readonly size={20} initialValue={review.rating} />
                          <br />
                          {review.createdAt ? review.createdAt.substring(0, 10) : 'N/A'} <br />
                          {review.comment}
                        </ListGroup.Item>
                        ))}
                        <div ref={messageEndRef}></div>
                  </ListGroup>
                </Col>
              </Row>

              <hr></hr>
                    {!userInfo.name?(<Alert variant="danger">Login first to write a review</Alert>):""}
              {/* Review form submission Section */}
              <Row className="mt-3">
                <Form onSubmit={sendReviewHandler}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Write a review</Form.Label>
                    <Form.Control name="comment" required as="textarea" rows={3} disabled={!userInfo.name} />
                  </Form.Group>
                  <Form.Select name="rating" required disabled={!userInfo.name} aria-label="Default select example">
                  <option value="">Your rating</option>
                  <option value="5">5 (very good)</option>
                  <option value="4">4 (good)</option>
                  <option value="3">3 (average)</option>
                  <option value="2">2 (bad)</option>
                  <option value="1">1 (awful)</option>
                  </Form.Select>
                  <Button disabled={!userInfo.name} type="submit" className="mt-3" variant="primary">
                    Submit 
                  </Button>
                  {productReviewed}
                </Form>
              </Row>
            </Col>
          </>
        )}
      </Row>
    </Container>
    </>
  );
};

export default ProductDetailsPageComponent;
