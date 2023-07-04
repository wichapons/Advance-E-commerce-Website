import {
  Row,
  Col,
  Container,
  Form,
  Button,
  CloseButton,
  Table,
  Alert,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Fragment } from "react";

const closeBtnStyle = {
  cursor: "pointer",
  position: "absolute",
  right: "9px",
  top: "-9px",
  color: "red",
};

const AdminEditProductPageComponent = ({
  categories,
  fetchProduct,
  updateProductApiRequest,
}) => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [product, setProduct] = useState({});
  const [updateProductResponseState, setUpdateProductResponseState] = useState({
    message: "",
    error: "",
  });

  const [attributesFromDb, setAttributesFromDb] = useState([]);
  const attrVal = useRef(null);
  const attrKey = useRef(null);

  // This function is triggered when a attribute is selected in a form field
  const setValuesForAttrFromDbSelectForm = (e) => {
  // Check if the selected value is not the default "Choose attribute"
  if (e.target.value !== "Choose attribute") {
      // Find the selected attribute from the database based on the key
      let selectedAttr = attributesFromDb.find((item) => item.key === (e.target.value)); 
      // Get the element representing the options for attribute values
      let valuesForAttrKeys = attrVal.current;
      // Check if the selected attribute has values
      if (selectedAttr && selectedAttr.value.length > 0) {
          // Remove all existing options from the attribute values element
          while (valuesForAttrKeys.options.length) {
              valuesForAttrKeys.remove(0);
          }
          // Add a default option to choose attribute value
          valuesForAttrKeys.options.add(new Option("Choose attribute value"));
          
          // Iterate over the selected attribute's values and add them as options
          selectedAttr.value.map(item => {
              valuesForAttrKeys.add(new Option(item));
              return "";
          })
      }
  }
}



  const { id } = useParams();

  useEffect(() => {
    fetchProduct(id)
      .then((product) => {
        setProduct(product);
      })
      .catch((er) => console.log(er));
  }, [id]);

  useEffect(() => {
    //find current category data in product data that fetched from db
    let categoryOfEditedProduct = categories.find(item => {
      if (product.category){
        return product.category.includes(item.name)
      }
    })
    
    //if category exists in database
    if (categoryOfEditedProduct) {
      // Get the main category from the current category's name
      const mainCategoryOfEditedProduct =
        categoryOfEditedProduct.name.split("/")[0];
      // Find the main category's data from the categories array
      const mainCategoryOfEditedProductAllData = categories.find(
        (categoryOfEditedProduct) =>
          categoryOfEditedProduct.name === mainCategoryOfEditedProduct
      );
      // If main category data exists and has attributes
      if (
        mainCategoryOfEditedProductAllData &&
        mainCategoryOfEditedProductAllData.attrs.length > 0
      ) {
        // Set attributes from the main category's data to the state
        setAttributesFromDb(mainCategoryOfEditedProductAllData.attrs);
      }
    }
  }, [product]);

  console.log(categories);
  console.log(product);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const element = form.elements;
    const formInputs = {
      name: element.name.value,
      description: element.description.value,
      count: element.count.value,
      price: element.price.value,
      category: element.category.value,
      attributesTable: [],
    };

    if (form.checkValidity() === true) {
      updateProductApiRequest(id, formInputs)
        .then((data) => {
          if (data.message === "product updated") {
            navigate("/admin/products");
          }
        })
        .catch((er) =>
          setUpdateProductResponseState({
            error: er.response.data.message
              ? er.response.data.message
              : er.response.data,
          })
        );
    }
    setValidated(true);
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={1}>
          <Link to="/admin/products" className="btn btn-info my-3">
            Go Back
          </Link>
        </Col>

        <Col md={6}>
          <h1>Edit product</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                required
                type="text"
                defaultValue={product.name}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                required
                as="textarea"
                rows={3}
                defaultValue={product.description}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCount">
              <Form.Label>Count in stock</Form.Label>
              <Form.Control
                name="count"
                required
                type="number"
                defaultValue={product.count}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="price"
                required
                type="text"
                defaultValue={product.price}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                required
                name="category"
                aria-label="Default select example"

              >
                <option value="">Choose category</option>
                {categories.map((category, idx) => {
                  return product.category === category.name ? (
                    <option selected key={idx} value={category.name}>
                      {category.name}
                    </option>
                  ) : (
                    <option key={idx} value={category.name}>
                      {category.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            {attributesFromDb.length > 0 && (
              <Row className="mt-5">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formBasicAttributes">
                    <Form.Label>Choose atrribute and set value</Form.Label>
                    <Form.Select
                      name="atrrKey"
                      aria-label="Default select example"
                      ref={attrKey}
                      onChange={setValuesForAttrFromDbSelectForm}
                    >
                      <option>Choose attribute</option>

                      {attributesFromDb.map((item, idx) => (
                        <Fragment key={idx}>
                          <option value={item.key}>{item.key}</option>
                        </Fragment>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicAttributeValue"
                  >
                    <Form.Label>Attribute value</Form.Label>
                    <Form.Select
                      name="atrrVal"
                      aria-label="Default select example"
                      ref={attrVal}
                    >
                      <option>Choose attribute value</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              <Table hover>
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Value</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>attr key</td>
                    <td>attr value</td>
                    <td>
                      <CloseButton />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicNewAttribute">
                  <Form.Label>Create new attribute</Form.Label>
                  <Form.Control
                    disabled={false}
                    placeholder="choose or create category"
                    name="newAttrValue"
                    type="text"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="formBasicNewAttributeValue"
                >
                  <Form.Label>Attribute value</Form.Label>
                  <Form.Control
                    disabled={false}
                    placeholder="first choose or create category"
                    required={true}
                    name="newAttrValue"
                    type="text"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="primary">
              After typing attribute key and value press enter on one of the
              field
            </Alert>

            <Form.Group controlId="formFileMultiple" className="mb-3 mt-3">
              <Form.Label>Images</Form.Label>
              <Row>
                {product.images &&
                  product.images.map((image, idx) => {
                    return (
                      <Col key={idx} style={{ position: "relative" }} xs={3}>
                        <Image
                          crossOrigin="anonymous"
                          src={image.path ?? null}
                          fluid
                        />
                        <i style={closeBtnStyle} className="bi bi-x-circle"></i>
                      </Col>
                    );
                  })}
              </Row>

              <Form.Control required type="file" multiple />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
            </Button>
            {updateProductResponseState.error ?? ""}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminEditProductPageComponent;
