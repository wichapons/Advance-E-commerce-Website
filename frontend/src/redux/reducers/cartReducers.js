import * as actionTypes from "../constants/cartConstants";

const CART_INITIAL_STATE = {
    cartItems: [],
    itemsCount: 0,
    cartSubtotal: 0,
}

export const cartReducer  = (state = CART_INITIAL_STATE, action) => {
    switch (action.type) {
        // Switch statement to handle different action types
        case actionTypes.ADD_TO_CART:
            // Extract the product being added to the cart from the action payload
            const productBeingAddedToCart = action.payload; 
            // Check if the product being added already exists in the cartItems array of the state
            const productAlreadyExistsInState = state.cartItems.find((x) => x.productID === productBeingAddedToCart.productID);
             // Create a copy of the current state
            const currentState = { ...state };

            // If the product already exists in the cartItems array
            if (productAlreadyExistsInState) {
                // Update the itemsCount and cartSubtotal to zero since we are going to recalculate them later
                currentState.itemsCount = 0;
                currentState.cartSubtotal = 0;
                // Update the cartItems array using map function
                currentState.cartItems = state.cartItems.map((x) => {
                    // If the current item matches the existing product in the cart
                    if (x.productID === productAlreadyExistsInState.productID) {
                        //add current itemcount + new item added to cart
                        currentState.itemsCount += Number(productBeingAddedToCart.quantity);
                        //calculate cost of the item that just added to cart
                        const sum = Number(productBeingAddedToCart.quantity) * Number(productBeingAddedToCart.price);
                        //sum
                        currentState.cartSubtotal += sum;
                    // If the current item is not the existing product in the cart
                    } else {
                        // If the current item is not the existing product in the cart
                        currentState.itemsCount += Number(x.quantity);
                        const sum = Number(x.quantity) * Number(x.price);
                        currentState.cartSubtotal += sum;
                    }
                    // Return the updated item. If it matches the existing product, return the new productBeingAddedToCart, otherwise return the current item unchanged.
                    return x.productID === productAlreadyExistsInState.productID ? productBeingAddedToCart : x;
                });

            // If the product does not exist in the cartItems array
            } else {
                // Add the quantity of the new product to the existing itemsCount
                currentState.itemsCount += Number(productBeingAddedToCart.quantity);
                const sum = Number(productBeingAddedToCart.quantity) * Number(productBeingAddedToCart.price);
                currentState.cartSubtotal += sum;
                 // Add the new product to the cartItems array
                currentState.cartItems = [...state.cartItems, productBeingAddedToCart];
            }
            return currentState

        case actionTypes.REMOVE_FROM_CART:
            return {
               ...state, 
               cartItems: state.cartItems.filter((x) => x.productID !== action.payload.productID),
               itemsCount: state.itemsCount - action.payload.quantity,
               cartSubtotal: state.cartSubtotal - action.payload.price * action.payload.quantity,
            } 
         

        default:
           return state 
    }
}