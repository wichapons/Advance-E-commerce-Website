import * as actionTypes from "../constants/cartConstants";
import axios from 'axios';

export const addToCart = (productId, quantity) => async (dispatch) => {
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
}
