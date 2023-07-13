import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import { InputGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect,useState } from "react";
import { getCategories } from "../redux/actions/categoryActions";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { setChatRooms,setSocket,setMessageReceived,removeChatRoom } from "../redux/actions/chatActions";

const HeaderComponent = () => {
  //import redux state
  const dispatch = useDispatch();
  //get userInfo from current redux state
  const { userInfo } = useSelector((state) => state.userRegisterLogin);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  //get categories data from redux state
  const { categories } = useSelector((state) => state.getCategories);
  //the category that will be display in the navbar when user select category from the list
  const [searchCategoryToggle, setSearchCategoryToggle] = useState("All");
  //for sending to backend
  const [searchQuery, setSearchQuery] = useState("");
  //get messageReceived data from redux state
  const { messageReceived } = useSelector((state) => state.adminChat);

  const navigate = useNavigate();


  //fetch category data via redux
  useEffect(() => {
    // dispatch the action to get categories
    dispatch(getCategories());
  }, [dispatch]);

  //send search query to backend when user press enter or click search
  const submitHandler = (e) => {
    if (e.keyCode && e.keyCode !== 13) {
      return;
    }
    e.preventDefault();
    if (searchQuery.trim()) {//remove space from user input 
      if (searchCategoryToggle === "All") {
          navigate(`/product-list/search/${searchQuery}`);
      } else {
          navigate(`/product-list/category/${searchCategoryToggle.replaceAll("/", ",")}/search/${searchQuery}`);
      }
  } else if (searchCategoryToggle !== "All") {
      navigate(`/product-list/category/${searchCategoryToggle.replaceAll("/", ",")}`);
  } else {
      navigate("/product-list");
  }
}

//get msg from socketio server
useEffect(() => {
  if (userInfo.isAdmin) {
      let audio = new Audio("/audio/chat-msg.mp3");
      const socket = io("https://topazio-shop-backend.onrender.com");
      //send signal via socket io then admin is online, random number is for telling server how many admins are currently online 
      socket.emit("admin connected with server", "Admin" + Math.floor(Math.random() * 1000000000000));
      socket.on("server sends message from client to admin", ({user,message}) => {
        dispatch(setSocket(socket));
        dispatch(setChatRooms(user, message)); //send to redux action named setChatRooms
        dispatch(setMessageReceived(true));  
        audio.play();
      })
      //listen to disconected signal from backend
      socket.on("disconnected", ({reason, socketId}) => {
        dispatch(removeChatRoom(socketId));
      })
      return () => socket.disconnect();
  }
},[userInfo.isAdmin])


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
              <DropdownButton id="dropdown-basic-button" title={searchCategoryToggle}>
                <Dropdown.Item onClick={() => setSearchCategoryToggle("All")}>
                  All
                </Dropdown.Item>
                {categories.map((category, id) => (
                  <Dropdown.Item
                    key={id}
                    onClick={() => setSearchCategoryToggle(category.name)}
                  >
                    {category.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              <Form.Control
                onKeyUp={submitHandler} onChange={(e)=>{
                  setSearchQuery(e.target.value)
                }}
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <Button onClick={submitHandler} variant="warning">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Nav>

          <Nav className="me-auto">
            {userInfo.name && userInfo.isAdmin === false ? (
              <>
                <NavDropdown
                  title={userInfo.name + " " + userInfo.lastName}
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item href="/user/my-orders">
                    My Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/user">Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    href="/login"
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : userInfo.name && userInfo.isAdmin === true ? (
              <LinkContainer to="/admin/orders">
                <Nav.Link>
                  Admin
                  {/* red dot for inform admin that there are chat msg from cust.  */}
                  {messageReceived && <span className="position-absolute top-1 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>}
                </Nav.Link>
              </LinkContainer>
            ) : (
              <>
                <Nav.Link href="/login">Login </Nav.Link>
                <Nav.Link href="/register">Register </Nav.Link>
              </>
            )}
            <Nav.Link href="/cart">
              <Badge pill bg="danger">
                {itemsCount === 0 ? "" : itemsCount}
              </Badge>
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
