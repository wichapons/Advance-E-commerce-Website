import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";

const UserProfilePageComponent = ({updateUserApiRequest,fetchUser, userInfoFromRedux, setReduxUserState, reduxDispatch, localStorage, sessionStorage }) => {
  const [validated, setValidated] = useState(false);
  const [updateUserResponseState, setUpdateUserResponseState] = useState({ success: "", error: "" });
  const [passwordsMatchState, setPasswordsMatchState] = useState(false);
  const [confirmPasswordsMatchState, setconfirmPasswordsMatchState] = useState(false);
  const [user, setUser] = useState({
    name: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    country: '',
    zipCode: '',
    city: '',
    state: ''
  });
  const userInfo = userInfoFromRedux;

  //use useEffect for fetching an userInfo immediately after the page is loaded
  //I use user._id from redux then send via fetchUser function to get the userinfo 
  useEffect(() => {
    fetchUser(userInfo._id)
    .then((res) => setUser(res))
    .catch((er) => console.log(er));
}, [userInfo._id])

  const onChange = () => {
    const password = document.querySelector("input[name=password]");
    const confirm = document.querySelector("input[name=confirmPassword]");
    if(password.value.length>=6){
      setPasswordsMatchState(true);
    }else{
      setPasswordsMatchState(false)
    }
    if (confirm.value === password.value && password.value !=="") {
      setconfirmPasswordsMatchState(true);
    } else {
      setconfirmPasswordsMatchState(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const element = form.elements;
    const name = element.name.value;
    const lastName = element.lastName.value;
    const phoneNumber = element.phoneNumber.value;
    const address = element.address.value;
    const country = element.country.value;
    const zipCode = element.zipCode.value;
    const city = element.city.value;
    const state = element.state.value;
    const password = element.password.value;

    if (form.checkValidity() === true && element.password.value === element.confirmPassword.value) {
      updateUserApiRequest(name, lastName, phoneNumber, address, country, zipCode, city, state, password)
      .then(res => {
        setUpdateUserResponseState({ success: res.success, error: "" });
        //update redux state
        reduxDispatch(setReduxUserState({ doNotLogout: userInfo.doNotLogout, ...res.userUpdated }));
        if (userInfo.doNotLogout) {
          localStorage.setItem("userInfo", JSON.stringify({ doNotLogout: true, ...res.userUpdated }))
        }
        else sessionStorage.setItem("userInfo", JSON.stringify({ doNotLogout: false, ...res.userUpdated }));
      })
      .catch((er) => {
        console.log(er);
        setUpdateUserResponseState({ error: er.response.data.message ? er.response.data.message : er.response.data })
      })
    }
    setValidated(true);
  };
  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Change your profile</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="validationCustom01">
              <Form.Label>Your name</Form.Label>
              <Form.Control
                required
                type="text"
                defaultValue={user.name}
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
                defaultValue={user.lastName}
                name="lastName"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your last name
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                disabled
                value={user.email}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                name="phoneNumber"
                defaultValue={user.phoneNumber}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your street name and house number"
                defaultValue={user.address}
                name="address"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your country"
                defaultValue={user.country}
                name="country"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicZip">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Zip code"
                defaultValue={user.zipCode}
                name="zipCode"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your city"
                defaultValue={user.city}
                name="city"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your state"
                defaultValue={user.state}
                name="state"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Password"
                minLength={6}
                onChange={onChange}
                isInvalid={!passwordsMatchState}
                isValid={passwordsMatchState}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid password
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Password should have at least 6 characters
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                required
                type="password"
                placeholder="Repeat Password"
                minLength={6}
                onChange={onChange}
                isInvalid={!confirmPasswordsMatchState}
                isValid={confirmPasswordsMatchState}
              />
              <Form.Control.Feedback type="invalid">
                Both passwords should match
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">Update</Button>
            <Alert show={updateUserResponseState && updateUserResponseState.error !== ""} variant="danger">
              User with that email already exists!
            </Alert>
            <Alert show={updateUserResponseState && updateUserResponseState.success === "user updated"} variant="info">
              User updated
            </Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfilePageComponent;

