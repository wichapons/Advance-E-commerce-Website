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
import { useState, useEffect, useRef } from "react";
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

  const { id } = useParams();
  const [attributesFromDb, setAttributesFromDb] = useState([]); //for select options
  const [attributesTable, setAttributesTable] = useState([]); // for showing tables of current attr
  const [categoryChoosen, setCategoryChoosen] = useState("Choose category");

  const attrVal = useRef(null);
  const attrKey = useRef(null);

  //get product data from db
  useEffect(() => {
    fetchProduct(id)
      .then((product) => {
        setProduct(product);
      })
      .catch((er) => console.log(er));
  }, [id]);

  // Set attribute(key) to match with db
  const setValuesForAttrFromDbSelectForm = (e) => {
    // Check if the selected value is not the default "Choose attribute"
    if (e.target.value !== "Choose attribute") {
      // Find the selected attribute from the database based on the key
      let selectedAttr = attributesFromDb.find(
        (item) => item.key === e.target.value
      );
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
        selectedAttr.value.map((item) => {
          valuesForAttrKeys.add(new Option(item));
          return "";
        });
      }
    }
  };
  // Set attribute(value) to match with db
  useEffect(() => {
    //find current category data in product data that fetched from db
    let categoryOfEditedProduct = categories.find((item) => {
      if (product.category) {
        return product.category.includes(item.name);
      }
    });

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
    //set current product attr
    setAttributesTable(product.attrs);
    //set current choosen category
    setCategoryChoosen(product.category);
  }, [product]);

  //submit button
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
      attributesTable: attributesTable,
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

  // Make changes in attributes when the user changes the category
  const changeCategory = (e) => {
    // Get the high-level category from the selected value
    const highLevelCategory = e.target.value.split("/")[0];
    // Find the high-level category's data from the categories array
    const highLevelCategoryAllData = categories.find(
      (cat) => cat.name === highLevelCategory
    );
    // If high-level category data exists and has attributes
    if (highLevelCategoryAllData && highLevelCategoryAllData.attrs) {
      // Set the attributes from the high-level category's data to the state
      setAttributesFromDb(highLevelCategoryAllData.attrs);
    } else {
      // If high-level category data doesn't exist or doesn't have attributes, set an empty array
      setAttributesFromDb([]);
    }
    //set current choosen category
    setCategoryChoosen(e.target.value);
  };

  // This function is triggered when an attribute value is selected
  const attributeValueSelected = (e) => {
    // Check if the selected value is not the default "Choose attribute value"
    if (e.target.value !== "Choose attribute value") {
      // Call the function to update the attributes table with the selected attribute key and value
      setAttributesTableWrapper(attrKey.current.value, e.target.value);
    }
  };

  // This function updates the attributes table with the selected attribute key and value
  //SHOW ATTRIBUTE KEY AND VALUE TO THE TABLE
  const setAttributesTableWrapper = (key, val) => {
    // Update the attributes table state using the previous state
    setAttributesTable((attr) => {
      if (attr.length !== 0) {
        let keyExistsInOldTable = false;
        // Iterate over the existing attributes table to find and modify the matching key
        let modifiedTable = attr.map((item) => {
          if (item.key === key) {
            keyExistsInOldTable = true;
            // Update the value of the matching key with the new selected value
            item.value = val;
            return item;
          } else {
            return item;
          }
        });
        // If the key existed in the old table, return the modified table
        if (keyExistsInOldTable) return [...modifiedTable];
        // If the key is new, add a new entry to the table with the selected key and value
        else return [...modifiedTable, { key: key, value: val }];
      } else {
        // If the table was empty, create a new entry with the selected key and value
        return [{ key: key, value: val }];
      }
    });
  };

  //delete that attr table when click "x"
  function deleteAttribute(key) {
    setAttributesTable(function (table) {
      //only return the table that does not match with the key which user requested to delete
      return table.filter(function (item) {
        return item.key !== key;
      });
    });
  }

  //prevent submit form when user press enter
  const checkKeyDown = (e) => {
    if (e.code === "Enter") e.preventDefault();
  };
  //prevent submit form when user press enter
  const newAttrKeyHandler = (e) => {
    e.preventDefault();
    if (e.keyCode && e.keyCode === 13) {
      console.log("add new attribute");
    }
  };
  //prevent submit form when user press enter
  const newAttrValueHandler = (e) => {
    e.preventDefault();
    if (e.keyCode && e.keyCode === 13) {
      console.log("add new attribute");
    }
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
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            onKeyDown={(e) => checkKeyDown(e)}
          >
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
                onChange={changeCategory}
              >
                <option value="Choose category">Choose category</option>
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
                      onChange={attributeValueSelected}
                    >
                      <option>Choose attribute value</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              {attributesTable && attributesTable.length > 0 && (
                <Table hover>
                  <thead>
                    <tr>
                      <th>Attribute</th>
                      <th>Value</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributesTable.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.key}</td>
                        <td>{item.value}</td>
                        <td>
                          <CloseButton
                            onClick={() => deleteAttribute(item.key)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicNewAttribute">
                  <Form.Label>Create new attribute</Form.Label>
                  <Form.Control
                    disabled={categoryChoosen === "Choose category"}
                    placeholder="choose or create category"
                    name="newAttrKey"
                    type="text"
                    onKeyUp={newAttrKeyHandler}
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
                    disabled={categoryChoosen === "Choose category"}
                    placeholder="first choose or create category"
                    required={true}
                    name="newAttrValue"
                    type="text"
                    onKeyUp={newAttrValueHandler}
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
