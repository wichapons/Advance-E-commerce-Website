import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

/*
TO BE DONE IN FUTURE
const RegistrationPage = () => {
    const [validated, setValidated] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    //const [passwordMatchError, setPasswordMatchError] = useState(false);

    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
      setPasswordMatchError(false);
    };

    const handleConfirmPasswordChange = (event)=>{
      setConfirmPassword(event.target.value);
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      console.log('submited received');
      const value = event.target.value;
      
      // Check for at least one uppercase letter, one lowercase letter, and one number
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/;
      const isValid = regex.test(value);

      // Check for special characters
      const specialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
      const hasSpecialChars = specialChars.test(value);

      if (password.length >= 6 && isValid && !hasSpecialChars ){
        setValidated(true);
      }else{
        setPasswordMatchError(true);
      }
      if (confirmPassword === password) {
        setValidated(true);
        // Perform further form submission or validation logic
      } else {
        setPasswordMatchError(true);
      }
    }
*/

const RegistrationPageComponent = ({ registerUserApiRequest,reduxDispatch, setReduxUserState }) => {
  const [validated, setValidated] = useState(false);
  const [registerUserResponseState, setRegisterUserResponseState] = useState({
    success: "",
    error: "",
    loading: false,
  });
  //state for checking password validation
  const [passwordsMatchState, setPasswordsMatchState] = useState(true);
  const [confirmPasswordsMatchState, setconfirmPasswordsMatchState] = useState(true);
  
  //check password match for confirmed password input
  const checkIsPasswordMatch = () => {
    const password = document.querySelector("input[name=password]");
    const confirm = document.querySelector("input[name=confirmPassword]");
    //password logic
    if(password.value.length>=6){
      setPasswordsMatchState(true);
    }else{
      setPasswordsMatchState(false)
    }
    if (confirm.value === password.value) {
      setconfirmPasswordsMatchState(true);
    } else {
      setconfirmPasswordsMatchState(false);
    }
  };

  const isValidEmailInput = () => {
    const emailInput = document.querySelector("input[name=email]");
    const email = emailInput.value;

    if (email.includes("@")) {
      emailInput.setCustomValidity("");
    } else {
      emailInput.setCustomValidity("Please enter a valid email address");
    }
  };

  const handleSubmit = (event) => {
    setRegisterUserResponseState({loading:true});
    event.preventDefault();
    const form = event.currentTarget;
    const formElement = event.currentTarget.elements;
    const email = formElement.email.value;
    const name = formElement.name.value;
    const lastName = formElement.lastName.value;
    const password = formElement.password.value;
    const confirmPassword = formElement.confirmPassword.value

    if (form.checkValidity() === true && email && password && name && lastName && confirmPassword && password===confirmPassword) {
        registerUserApiRequest(name, lastName, email, password) // get api request from back end
        .then((res) => {
          setRegisterUserResponseState({success:res.success, loading:false});
          //reduxDispatch(setReduxUserState(res.userCreated)); // set redux initial value from response
        })
        .catch((er) => {
          setRegisterUserResponseState({loading:false});
          setRegisterUserResponseState({error: er.response.data.error, loading:false});
        });
        setValidated(true);
      }else{
        setRegisterUserResponseState({loading:false});
      }
    };

  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Register</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="validationCustom01">
              <Form.Label>Your name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your name"
                name="name"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a name
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Your last name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your last name"
                name="lastName"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your last name
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                placeholder="Enter email"
                onChange={isValidEmailInput}
              />
              <Form.Control.Feedback type="invalid">
                Please anter a valid email address
              </Form.Control.Feedback>
            </Form.Group>
            {/* Password Input */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Password"
                minLength={6}
                onChange={checkIsPasswordMatch}
                isInvalid={!passwordsMatchState}
                isValid={passwordsMatchState}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                Please anter a valid password
              </Form.Control.Feedback>
              <Form.Text className="text-muted" >
                Password should have at least 6 characters
              </Form.Text>
            </Form.Group>
            {/* Password confirmation input */}
            <Form.Group className="mb-3" controlId="formBasicPasswordRepeat" >
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                required
                type="password"
                placeholder="Repeat Password"
                minLength={6}
                onChange={checkIsPasswordMatch}
                isInvalid={!confirmPasswordsMatchState}
                isValid={confirmPasswordsMatchState}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                Both passwords should match
              </Form.Control.Feedback>
            </Form.Group>

            <Row className="pb-2">
              <Col>
                Do you have an account already?
                <Link to={"/login"}> Login </Link>
              </Col>
            </Row>

            <Button type="submit">
            {(registerUserResponseState.loading === true)?
                (<Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />):""
            }
              Submit
            </Button>

            {registerUserResponseState.error === "user already existed" ? 
            (<Alert show={true} variant="danger">
              User with that email already exists!
            </Alert>):""
            }

            {registerUserResponseState.success ? (<Alert show={true} variant="info">
              User created
            </Alert>):""
            }
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationPageComponent;
