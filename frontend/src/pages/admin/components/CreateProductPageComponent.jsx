import { Row, Col, Container, Form, Button, CloseButton, Table, Alert} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  changeCategory,
  setValuesForAttrFromDbSelectForm,
  setAttributesTableWrapper,
} from "./utils/utils";
import { Fragment } from "react";

const AdminCreateProductPageComponent = ({
  createProductApiRequest,
  uploadImagesApiRequest,
  uploadImagesCloudinaryApiRequest,
  categories,
  reduxDispatch,
  newCategory,
  deleteCategory,
  saveAttributeToCatDoc,
}) => {
  const [validated, setValidated] = useState(false);
  const [attributesTable, setAttributesTable] = useState([]);
  const [attributesFromDb, setAttributesFromDb] = useState([]);
  const [images, setImages] = useState(false);
  const [isCreating, setIsCreating] = useState("");
  const [createProductResponseState, setCreateProductResponseState] = useState({
    message: "",
    error: "",
  });

  const [categoryChoosen, setCategoryChoosen] = useState("Choose category");
  const [trigger, setTrigger] = useState(false);
  //create ref for attr key and value
  const attrVal = useRef(null);
  const attrKey = useRef(null);
  //creat new const for saving custom attr
  const createNewAttrKey = useRef(null);
  const createNewAttrVal = useRef(null);
  const [newAttrKey, setNewAttrKey] = useState(false);
  const [newAttrValue, setNewAttrValue] = useState(false);

  const navigate = useNavigate();

  //handle product create button
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const element = form.elements;
    // Extract form input values
    const formInputs = {
      name: element.name.value,
      description: element.description.value,
      count: element.count.value,
      price: element.price.value,
      category: element.category.value,
      attributesTable: attributesTable,
    };
    if (event.currentTarget.checkValidity() === true) {
      //check if images > 3
      if (images.length > 3) {
        setIsCreating("to many files");
        return;
      }
      // Send product details to the database
      createProductApiRequest(formInputs)
        .then((data) => {
          if (images) {
            if (import.meta.env.VITE_NODE_ENV === "uploadLocal") {
              // to do: change to !==
              // Upload images to the server and path to database
              uploadImagesApiRequest(images, data.productId)
                .then((res) => {})
                .catch((er) =>
                  setIsCreating(
                    er.response.data.message
                      ? er.response.data.message
                      : er.response.data
                  )
                );
            } else {
              // Upload images to Cloudinary using the Cloudinary API and path to database
              uploadImagesCloudinaryApiRequest(images, data.productId);
            }
          }
          if (data.message === "product created") {
            navigate("/admin/products");
          }
        })
        .catch((er) => {
          setCreateProductResponseState({
            error: er.response.data.message
              ? er.response.data.message
              : er.response.data,
          });
        });
    }
    setValidated(true);
  };

  const uploadHandler = (images) => {
    setImages(images);
  };

  const newCategoryHandler = (e) => {
    // Check if the event has a key code and it's equal to 13 (Enter key)
    if (e.keyCode && e.keyCode === 13 && e.target.value) {
      // Dispatch a Redux action called "newCategory" with the target value as the payload
      reduxDispatch(newCategory(e.target.value));
      setTrigger(!trigger);
      // Set a timeout to delay the following operations
      setTimeout(() => {
        //after hiting enter for saving the custom category, automatically select the new custom category
        let catElement = document.getElementById("cats");
        /*
        //optional
        // Iterate through the options and find the desired option
        for (let i = catElement.options.length - 1; i >= 0; i--) {
          console.log(catElement.options[i].value, " vs ", e.target.value);
          if (catElement.options[i].value === e.target.value) {
            // Set the desired option as selected
            console.log("found");
            catElement.options[catElement.options.length-1].selected = true;
            break;
          }
        }
        */

        //update setCategoryChoosen react state
        setCategoryChoosen(e.target.value);
        //auto select custom category after user press enter
        catElement.options[catElement.options.length - 1].selected = true;

        // Reset the target value to an empty string
        e.target.value = "";
      }, 400);
    }
  };

  //Delete category function
  const deleteCategoryHandler = () => {
    let catElement = document.getElementById("cats");
    reduxDispatch(deleteCategory(catElement.value));
    catElement.options[0].selected = true;
  };

  const attributeValueSelected = (e) => {
    if (e.target.value !== "Choose attribute value") {
      setAttributesTableWrapper(
        attrKey.current.value,
        e.target.value,
        setAttributesTable
      );
    }
  };

  const deleteAttribute = (key) => {
    setAttributesTable((table) => table.filter((item) => item.key !== key));
  };

  //set NewAttrKey = input
  const newAttrKeyHandler = (e) => {
    e.preventDefault();
    setNewAttrKey(e.target.value);
    addNewAttributeManually(e);
  };
  //set NewAttrVal = input
  const newAttrValueHandler = (e) => {
    e.preventDefault();
    setNewAttrValue(e.target.value);
    addNewAttributeManually(e);
  };

  //add custom attr update to redux and db
  const addNewAttributeManually = (e) => {
    if (e.keyCode && e.keyCode === 13) {
      if (newAttrKey && newAttrValue) {
        reduxDispatch(
          saveAttributeToCatDoc(newAttrKey, newAttrValue, categoryChoosen)
        );
        setAttributesTableWrapper(newAttrKey, newAttrValue, setAttributesTable);
        e.target.value = "";
        createNewAttrKey.current.value = "";
        createNewAttrVal.current.value = "";
        setTimeout(() => {
          const { categories } = useSelector((state) => state.getCategories);
          setNewAttrKey(false);
          setNewAttrValue(false);
        },1000)
        
      }
    }
  };

  //prevent submit form when user press enter
  const checkKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault()
    };
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
          <h1>Create a new product</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit} onKeyDown={(e)=>checkKeyDown(e)}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" required type="text" />
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
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCount">
              <Form.Label>Count in stock</Form.Label>
              <Form.Control name="count" required type="number" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price" required type="text" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>
                Category
                  {/* UNDER MAINTENANCE */}
                {/* <CloseButton onClick={deleteCategoryHandler} />(
                <small>Press X for deleting this category</small>) */}
              </Form.Label>
              <Form.Select
                required
                name="category"
                aria-label="Default select example"
                id="cats"
                onChange={(e) =>
                  changeCategory(
                    e,
                    categories,
                    setAttributesFromDb,
                    setCategoryChoosen
                  )
                }
              >
                <option value="">Choose category</option>
                {categories.map((category, idx) => (
                  <option key={idx} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
                  {/* UNDER MAINTENANCE */}
            {/* <Form.Group className="mb-3" controlId="formBasicNewCategory">
              <Form.Label>
                Or create a new category (e.g. Computers/Laptops/Intel){" "}
              </Form.Label>
              <Form.Control
                onKeyUp={newCategoryHandler}
                name="newCategory"
                type="text"
              />
            </Form.Group> */}

            {attributesFromDb.length > 0 && (
              <Row className="mt-5">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formBasicAttributes">
                    <Form.Label>Choose atrribute and set value</Form.Label>
                    <Form.Select
                      name="attrKey"
                      aria-label="Default select example"
                      ref={attrKey}
                      onChange={(e) =>
                        setValuesForAttrFromDbSelectForm(
                          e,
                          attrVal,
                          attributesFromDb
                        )
                      }
                    >
                      <option>Choose attribute</option>
                      {attributesFromDb.map((item, idx) => {
                        return (
                          <Fragment key={idx}>
                            <option value={item.key}>{item.key}</option>
                          </Fragment>
                        );
                      })}
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
                      name="attrVal"
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
              {attributesTable.length > 0 && (
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
                      {/* UNDER MAINTENANCE */}
            {/* <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicNewAttribute">
                  <Form.Label>Create new attribute</Form.Label>
                  <Form.Control
                    ref={createNewAttrKey}
                    disabled={["", "Choose category"].includes(categoryChoosen)}
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
                    {...(createNewAttrKey.current && createNewAttrKey.current.value !== '' ? { required: true } : {})}
                    name="newAttrValue"
                    type="text"
                    ref={createNewAttrVal}
                    onKeyUp={newAttrValueHandler}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert show={newAttrKey || newAttrValue ? true : false} variant="primary">
              After typing attribute key and value press enter on one of the
              field
            </Alert> */}

            <Form.Group controlId="formFileMultiple" className="mb-3 mt-3">
              <Form.Label>Images</Form.Label>

              <Form.Control
                required
                type="file"
                multiple
                onChange={(e) => uploadHandler(e.target.files)}
              />
              {isCreating}
            </Form.Group>
            <Button variant="primary" type="submit">
              Create
            </Button>
            {createProductResponseState.error ?? ""}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminCreateProductPageComponent;
