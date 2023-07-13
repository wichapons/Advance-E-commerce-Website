import {Row,Col,Container,Form,Button,CloseButton,Table,Alert,Image} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { changeCategory,setValuesForAttrFromDbSelectForm,setAttributesTableWrapper } from "./utils/utils";

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
  reduxDispatch,
  saveAttributeToCatDoc,
  imageDeleteHandler,
  uploadImagesCloudinaryApiRequest,
  uploadImagesApiRequest
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
  const [newAttrKey, setNewAttrKey] = useState(false);
  const [newAttrValue, setNewAttrValue] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [isUploading, setIsUploading] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  const attrVal = useRef(null);
  const attrKey = useRef(null);
  const createNewAttrKey = useRef(null);
  const createNewAttrVal = useRef(null);

  //get product data from db
  useEffect(() => {
    fetchProduct(id)
      .then((product) => {
        setProduct(product);
      })
      .catch((er) => console.log(er));
  }, [id, imageRemoved,imageUploaded]); //trigger re-render when id or imageRemove is updated

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



  // This function is triggered when an attribute value is selected
  const attributeValueSelected = (e) => {
    // Check if the selected value is not the default "Choose attribute value"
    if (e.target.value !== "Choose attribute value") {
      // Call the function to update the attributes table with the selected attribute key and value
      setAttributesTableWrapper(attrKey.current.value, e.target.value,setAttributesTable);
    }
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
    if (e.keyCode === 13) {
      e.preventDefault()
    };
  };
  //prevent submit form when user press enter
  const newAttrKeyHandler = (e) => {
    e.preventDefault();
    setNewAttrKey(e.target.value);
    addNewAttributeManually(e);
  };
  //prevent submit form when user press enter
  const newAttrValueHandler = (e) => {
    e.preventDefault();
    setNewAttrValue(e.target.value);
    addNewAttributeManually(e);
  };

  //add new custom attributes
  const addNewAttributeManually = (e) => {
    if (e.keyCode && e.keyCode === 13) {
      if (newAttrKey && newAttrValue) {
        //add to table
        setAttributesTableWrapper(newAttrKey, newAttrValue,setAttributesTable);
        //save to redux and send to db
        reduxDispatch(
          saveAttributeToCatDoc(newAttrKey, newAttrValue, categoryChoosen)
        );
        //then clear the input field
        e.target.value = "";
        createNewAttrKey.current.value = "";
        createNewAttrVal.current.value = "";
        setNewAttrKey(false);
        setNewAttrValue(false);
      }
    }
  };

  const uploadInProgrssAlert =(e)=>{
      setIsUploading("upload files in progress ..."); 
      if (import.meta.env.VITE_NODE_ENV === "uploadLocal") {
          // to do: change to !==
          // Upload images to the server
          uploadImagesApiRequest(e.target.files, id)
          .then(data => {
              setIsUploading("upload file completed");
              setImageUploaded(!imageUploaded);
          })
           .catch((er) => setIsUploading(er.response.data.message ? er.response.data.message : er.response.data));
      } else {
        // Upload images to Cloudinary using the Cloudinary API
          uploadImagesCloudinaryApiRequest(e.target.files, id);
           setIsUploading("upload file completed. wait for the result take effect, refresh also if neccassry");
           setTimeout(()=> {
               setImageUploaded(!imageUploaded);
           }, 5000)
      }
   }

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
                onChange={(e) => changeCategory(e, categories, setAttributesFromDb, setCategoryChoosen)}
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
                      onChange={(e)=>setValuesForAttrFromDbSelectForm(e, attrVal, attributesFromDb)}
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
                    ref={createNewAttrKey}
                    disabled={categoryChoosen === "Choose category"}
                    placeholder="choose or create category"
                    name="newAttrKey"
                    type="text"
                    onKeyUp={newAttrKeyHandler}
                    required={newAttrValue}
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
                    ref={createNewAttrVal}
                    disabled={categoryChoosen === "Choose category"}
                    placeholder="first choose or create category"
                    {...(createNewAttrKey.current && createNewAttrKey.current.value !== '' ? { required: true } : {})}
                    name="newAttrValue"
                    type="text"
                    onKeyUp={newAttrValueHandler}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert
              show={newAttrKey || newAttrValue ? true : false}
              variant="primary"
            >
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
                        <i
                          style={closeBtnStyle}
                          onClick={() =>
                            imageDeleteHandler(image.path, id).then((data) =>
                              setImageRemoved(!imageRemoved)
                            )
                          }
                          className="bi bi-x-circle"
                        ></i>
                      </Col>
                    );
                  })}
              </Row>

              <Form.Control type="file" multiple onChange={uploadInProgrssAlert}/>
              <Fragment>{isUploading}</Fragment>
               
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
