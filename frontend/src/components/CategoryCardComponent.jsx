import { Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CategoryCardComponent = ({category,idx}) => {
  
  return (
    <Card >
      <Card.Img style={{objectFit: "cover", height:"50%",width:"80%",margin:"auto",marginTop:"2%"}} crossOrigin="annonymous" variant="top" src={category.imagePath ? category.imagePath : null } />
      <Card.Body>
        <Card.Title>{category.name}</Card.Title>
        <Card.Text>
          {category.description}
        </Card.Text>
        <LinkContainer to={`/product-list/category/${category.name}`}>
          <Button variant="primary">View</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
};

export default CategoryCardComponent;
