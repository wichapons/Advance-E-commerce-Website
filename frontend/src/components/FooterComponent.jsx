import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const FooterComponent = () => {
  return (
    <footer>
      <Container fluid>
        <Row>
          <Col className="bg-dark text-white text-center py-3">
            Copyright &copy; 2023 Topazio Shop
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;
