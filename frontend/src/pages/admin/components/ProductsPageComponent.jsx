import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { useState, useEffect } from "react";

const ProductsPageComponent = ({ fetchProducts,deleteProduct }) => {
  const [products, setProducts] = useState([]);
  const [productDeleted, setProductDeleted] = useState(false); 

  const deleteHandler = async (productId) => {
    if (window.confirm("Are you sure?")) {
        const response = await deleteProduct(productId)
        if (response.status = 200) {
            setProductDeleted(!productDeleted);
        }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchProducts(abortController)
      .then((res) => {
        setProducts(res)
    })  
      .catch((er) =>
        console.log(er.response.data.message ? er.response.data.message : er.response.data)
      );
    return () => abortController.abort();
  }, [productDeleted]);

  return (
    <Row className="m-5">
      <Col md={2}>
        <AdminLinksComponent />
      </Col>
      <Col md={10}>
        <h1>
          Product list{" "}
          <LinkContainer to="/admin/create-new-product">
            <Button variant="primary">Create new product</Button>
          </LinkContainer>
        </h1>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Edit/delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.category}</td>
                <td>
                  <LinkContainer to={`/admin/edit-product/${item._id}`}>
                    <Button className="btn-sm">
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </LinkContainer>
                  {" / "}
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={()=>deleteHandler(item._id)}
                  >
                    <i className="bi bi-x-circle"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default ProductsPageComponent;
