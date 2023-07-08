import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";

const CategoryFilterComponent = ({setCategoriesFromFilter}) => {

  const { categories } = useSelector((state) => state.getCategories);

  const selectCategory = (e, category, idx) => {
      setCategoriesFromFilter(items => {
         return { ...items, [category.name]: e.target.checked }; 
      })
  }


  return (
    <>
       <b className="mb-5 mt-2">Catagory</b> 
      <Form>
      {categories.map((category,index) => (
        <div key={index} >
          <Form.Check type="checkbox" id={`check-api2-${index}`}>
            <Form.Check.Input type="checkbox" isValid onChange={(e) => selectCategory(e, category, index)} />
            <Form.Check.Label style={{cursor:"pointer"}}>{category.name}</Form.Check.Label>
          </Form.Check>
        </div>
      ))}
    </Form>
    </>
    
  );
};

export default CategoryFilterComponent;
