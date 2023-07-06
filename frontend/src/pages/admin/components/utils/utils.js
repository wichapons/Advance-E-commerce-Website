  // Make changes in attributes when the user changes the category
  export const changeCategory = (e, categories, setAttributesFromDb, setCategoryChoosen) => {
    // Get the high-level category from the selected value
    const highLevelCategory = e.target.value.split("/")[0];
    // Find the high-level category's data from the categories array
    const highLevelCategoryAllData = categories.find(
      (cat) => cat.name === highLevelCategory
    );
    // If high-level category data exists and has attributes
    if (highLevelCategoryAllData && highLevelCategoryAllData.attrs) {
      // Set the attributes from the high-level category's data to the state
      setAttributesFromDb(highLevelCategoryAllData.attrs);
    } else {
      // If high-level category data doesn't exist or doesn't have attributes, set an empty array
      setAttributesFromDb([]);
    }
    //set current choosen category
    setCategoryChoosen(e.target.value);
  };


