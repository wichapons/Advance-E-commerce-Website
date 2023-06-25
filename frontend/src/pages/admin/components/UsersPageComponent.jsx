import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";

import { useState, useEffect } from "react";

const UsersPageComponent = ({fetchUsersData,deleteUser}) => { //passing fetchUsersData to props
  const [users, setUsers] = useState([]);
  const [userDeleted, setUserDeleted] = useState(false);

  const deleteHandler = async (userId) => {
    if (window.confirm("Are you sure?")) {
        const response  = await deleteUser(userId);
        if(response.status = 200) {
            setUserDeleted(!userDeleted)
        }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();  //create abort controller
    fetchUsersData(abortController).then(res => setUsers(res))
    .catch(err => {
      if (err.response && err.response.data && err.response.data.message) {
        console.log(err.response.data.message);
      } else {
        console.log(err.response.data);
      }
    });
  return () => {abortController.abort()} //cleanup callback after completed render or user change page after loading to prevent memory leakage
}, [userDeleted]);


return (
  <Row className="m-5">
    <Col md={2}>
      <AdminLinksComponent />
    </Col>
    <Col md={10}>
      <h1>User List</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Is Admin</th>
            <th>Edit/Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map( // map user from database to each table
            (user, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? <i className="bi bi-check-lg text-success"></i> : <i className="bi bi-x-lg text-danger"></i>}
                </td>
                <td>
                  <LinkContainer to={`/admin/edit-user/${user._id}`}>
                    <Button className="btn-sm">
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </LinkContainer>
                  {" / "}
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={()=>deleteHandler(user._id)}
                  >
                    <i className="bi bi-x-circle"></i>
                  </Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </Col>
  </Row>
);
};

export default UsersPageComponent;

