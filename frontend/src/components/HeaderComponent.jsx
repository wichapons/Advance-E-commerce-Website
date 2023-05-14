import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import NavDropdown from "react-bootstrap/NavDropdown";
import {InputGroup} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import { Link } from "react-router-dom";

const HeaderComponent = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
       {/* use LinkContainer for render the specific page without reloading browser */}
        <LinkContainer to="/">
            <Navbar.Brand href="/">Topazio Shop</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
                <InputGroup>
                    <DropdownButton id="dropdown-catagory" title="Catagory">
                        <Dropdown.Item href="#/action-1">Electronics</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Cars</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Books</Dropdown.Item>
                    </DropdownButton>
                    <Form.Control type="search" placeholder="Search" aria-label="Search"/>
                    <Button variant="warning">
                        <i className="bi bi-search"></i>
                    </Button>
                </InputGroup>
                </Nav>

                <Nav className="me-auto">
                <LinkContainer to="/admin/orders">
                <Nav.Link>
                    Admin
                    {/* red dot for inform admin that there are chat msg from cust.  */}
                    <span className="position-absolute top-1 start-10 translate-middle p-2 bg-danger border border-light rounded-circle "></span>
                </Nav.Link>
                </LinkContainer>
                 
                <NavDropdown title="username(dummy)" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/user/my-orders">My Orders</NavDropdown.Item>
                    <NavDropdown.Item href="/user">Profile</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/login">Login </Nav.Link>
                <Nav.Link href="/register">Register </Nav.Link>
                <Nav.Link href="#cart"> 
                  <Badge pill bg="danger" >1</Badge>
                  <i className="bi bi-cart"></i> 
                    Cart
                </Nav.Link> 
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderComponent;
