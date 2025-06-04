import * as actionTypes from "../constants/categoryConstants";

import axios from "axios";

//fetch category data from db and then save to redux
export const getCategories = () => async (dispatch) => {
    const { data } = await axios.get("/api/categories");
    dispatch({
        type: actionTypes.GET_CATEGORIES_REQUEST,
        payload: data,
    })
}

//save custom attribute to database and send to redux
export const saveAttributeToCatDoc = (key, val, categoryChoosen) => async (dispatch, getState) => {
    const { data } = await axios.post("/api/categories/attr", { key, val, categoryChoosen }); 
    if (data.categoryUpdated) {
        dispatch({
            type: actionTypes.SAVE_ATTR,
            payload: [...data.categoryUpdated],
        })
    }
 }
 
 //save custom category to database and send to redux
 export const newCategory = (category) => async (dispatch, getState) => {
    //get category data from redux state
    const cat = getState().getCategories.categories;
    const response = await axios.post("/api/categories", { category });
    //if category was created then dispatch the reducer
    if (response.data.categoryCreated) {
        dispatch({
            type: actionTypes.INSERT_CATEGORY,
            payload: [...cat, response.data.categoryCreated],
        })
        
    }
}
//save delete category update to database and update redux state
export const deleteCategory = (category) => async (dispatch, getState) => {
    const cat = getState().getCategories.categories;
    const categories = cat.filter((item) => item.name !== category);
    //encode something like space / * that are in category name
    const { data } = await axios.delete("/api/categories/" + encodeURIComponent(category));
    if (data.categoryDeleted) {
        dispatch({
           type: actionTypes.DELETE_CATEGORY, 
           payload: [...categories],
        })
    }
}

