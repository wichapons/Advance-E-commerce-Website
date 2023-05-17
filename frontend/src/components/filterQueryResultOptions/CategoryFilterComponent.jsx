import { Form } from "react-bootstrap";

const CategoryFilterComponent = () => {
  return (
    <>
       <b className="mb-5 mt-2">Catagory</b> 
      <Form>
      {Array.from({length:5}).map((_,index) => (
        <div key={index} >
          <Form.Check type="checkbox" id={`check-api2-${index}`}>
            <Form.Check.Input type="checkbox" isValid />
            <Form.Check.Label style={{cursor:"pointer"}}>Catagory {index}</Form.Check.Label>
          </Form.Check>
        </div>
      ))}
    </Form>
    </>
    
  );
};

export default CategoryFilterComponent;
