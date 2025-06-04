import * as actionTypes from "../constants/cartConstants";
import axios from 'axios';

export const addToCart = (productId, quantity) => async (dispatch,getState) => {
     // Send an HTTP GET request to retrieve product information based on the provided productId
    const { data } = await axios.get(`/api/products/get-one/${productId}`);

     // Dispatch an action to add the product to the cart
    dispatch({
        type: actionTypes.ADD_TO_CART,
        payload: {
            // Extract relevant information from the response data
            productID: data._id,
            name: data.name,
            price: data.price,
            image: data.images[0] ?? null, // If the first image is not available, set image to null
            count: data.count,
            quantity,
        },
    })
    //save cart item state to local storage
    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
}

export const removeFromCart = (productID, quantity, price) =>  (dispatch, getState) => {
    dispatch({
        type: actionTypes.REMOVE_FROM_CART,
        payload: {productID: productID, quantity: quantity, price: price}
    })
    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
}
