// Make changes in attributes when the user changes the category
export const changeCategory = (e,categories,setAttributesFromDb,setCategoryChoosen) => {
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

// Set attribute(key) to match with db
export const setValuesForAttrFromDbSelectForm = (e, attrVal, attributesFromDb) => {
  // Check if the selected value is not the default "Choose attribute"
  if (e.target.value !== "Choose attribute") {
    // Find the selected attribute from the database based on the key
    let selectedAttr = attributesFromDb.find(
      (item) => item.key === e.target.value
    );
    // Get the element representing the options for attribute values
    let valuesForAttrKeys = attrVal.current;
    // Check if the selected attribute has values
    if (selectedAttr && selectedAttr.value.length > 0) {
      // Remove all existing options from the attribute values element
      while (valuesForAttrKeys.options.length) {
        valuesForAttrKeys.remove(0);
      }
      // Add a default option to choose attribute value
      valuesForAttrKeys.options.add(new Option("Choose attribute value"));

      // Iterate over the selected attribute's values and add them as options
      selectedAttr.value.map((item) => {
        valuesForAttrKeys.add(new Option(item));
        return "";
      });
    }
  }
};


  // This function updates the attributes table with the selected attribute key and value
  //SHOW ATTRIBUTE KEY AND VALUE TO THE TABLE
export  const setAttributesTableWrapper = (key, val, setAttributesTable) => {
    // Update the attributes table state using the previous state
    setAttributesTable((attr) => {
      if (attr.length !== 0) {
        let keyExistsInOldTable = false;
        // Iterate over the existing attributes table to find and modify the matching key
        let modifiedTable = attr.map((item) => {
          if (item.key === key) {
            keyExistsInOldTable = true;
            // Update the value of the matching key with the new selected value
            item.value = val;
            return item;
          } else {
            return item;
          }
        });
        // If the key existed in the old table, return the modified table
        if (keyExistsInOldTable) return [...modifiedTable];
        // If the key is new, add a new entry to the table with the selected key and value
        else return [...modifiedTable, { key: key, value: val }];
      } else {
        // If the table was empty, create a new entry with the selected key and value
        return [{ key: key, value: val }];
      }
    });
  };
