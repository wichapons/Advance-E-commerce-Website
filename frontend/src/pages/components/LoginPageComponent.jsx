import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';


const LoginPageComponent = ({loginUserApiRequest,reduxDispatch, setReduxUserState }) => {
  const [validated, setValidated] = useState(false);
  const [loginUserResponseState, setLoginUserResponseState] = useState({
    success: "",
    error: "",
    loading: false,
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    const element = form.elements;
    const email = element.email.value;
    const password = element.password.value;
    const doNotLogout = element.doNotLogout.checked;

    event.preventDefault(); //prevent page refresh after send request

    //login request logic
    if (form.checkValidity() === true && email && password) {
      setLoginUserResponseState({ loading: true });
      loginUserApiRequest(email, password, doNotLogout)
      .then((res) => {
        //set state 
        setLoginUserResponseState({ success: res.success, loading: false, error: "" });
        if (res.userLoggedIn) {
          reduxDispatch(setReduxUserState(res.userLoggedIn));
      }
        //redirect after login successfully
        if (res.success === "user logged in" && !res.userLoggedIn.isAdmin) {
          navigate('/',{replace:true})
          //if not admin redirect to user
          window.location.href = "/";
          //navigate("/user", { replace: true }) //delete current url eg. shop/login after login success if user go back it will redirect to shop/
        }
          //if admin navigate to admin page
        else {
          navigate('/admin/orders',{replace:true})
          window.location.href = "/admin/orders";
        }// navigate("/admin/orders", { replace: true });
      })
      .catch((err) => {
        console.log(err);
        setLoginUserResponseState({ error: err.response.data.message ? err.response.data.message : err.response.data })
      });
  }
    setValidated(true);
  };
  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Login</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>            
            
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                name="doNotLogout"
                type="checkbox"
                label="Do not logout"
              />
            </Form.Group>

            <Row className="pb-2">
              <Col>
               Don't you have an account?
                <Link to={"/register"}> Register </Link>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
            {/* control the spinner at login button */}
              {loginUserResponseState && loginUserResponseState.loading === true ? (
                <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              ) : ""}
              Login
            </Button>
            <Alert show={loginUserResponseState && loginUserResponseState.error ==="wrong credentials"} variant="danger">
                Wrong credentials
            </Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPageComponent;

