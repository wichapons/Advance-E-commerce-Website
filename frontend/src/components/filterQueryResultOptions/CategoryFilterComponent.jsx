import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";

const CategoryFilterComponent = ({ setCategoriesFromFilter }) => {
  const { categories } = useSelector((state) => state.getCategories);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const myRefs = useRef([]);

  // Function to handle category selection
  const selectCategory = (e, category, idx) => {
    // Update the categoriesFromFilter state based on the selected category
    setCategoriesFromFilter((items) => {
      return { ...items, [category.name]: e.target.checked };
    });
    // Get the selected main category
    let selectedMainCategory = category.name.split("/")[0];
    // Create an array of all categories with their names and indexes
    let allCategories = myRefs.current.map((_, id) => {
      return { name: categories[id].name, idx: id };
    });
    // Get the indexes of categories belonging to the selected main category
    let indexesOfMainCategory = allCategories.reduce((acc, item) => {
      let cat = item.name.split("/")[0];
      if (selectedMainCategory === cat) {
        acc.push(item.idx);
      }
      return acc;
    }, []);
    if (e.target.checked) {
      // Add the selected category to the selectedCategories state
      setSelectedCategories((old) => [...old, "cat"]);

      // Disable checkboxes not belonging to the selected main category
      myRefs.current.map((_, idx) => {
        if (!indexesOfMainCategory.includes(idx))
          myRefs.current[idx].disabled = true;
        return "";
      });
    } else {
      // Remove the selected category from the selectedCategories state
      setSelectedCategories((old) => {
        let a = [...old];
        a.pop();
        if (a.length === 0) {
          // Redirect to the product list page if no categories are selected
          window.location.href = "/product-list";
        }
        return a;
      });

      // Enable checkboxes based on the selected categories and main categories
      myRefs.current.map((_, idx2) => {
        if (allCategories.length === 1) {
          if (idx2 !== idx) myRefs.current[idx2].disabled = false;
        } else if (selectedCategories.length === 1)
          myRefs.current[idx2].disabled = false;
        return "";
      });
    }
  };

  return (
    <>
      <b className="mb-5 mt-2">Category</b>
      <Form>
        {categories.map((category, index) => (
          <div key={index}>
            <Form.Check type="checkbox" id={`check-api2-${index}`}>
              <Form.Check.Input
                ref={(element) => (myRefs.current[index] = element)}
                type="checkbox"
                isValid
                onChange={(e) => selectCategory(e, category, index)}
              />
              <Form.Check.Label style={{ cursor: "pointer" }}>
                {category.name}
              </Form.Check.Label>
            </Form.Check>
          </div>
        ))}
      </Form>
    </>
  );
};

export default CategoryFilterComponent;
