import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import { cartReducer  } from "./reducers/cartReducers";
import { userRegisterLoginReducer } from './reducers/userReducers';
import { getCategoriesReducer } from "./reducers/categoryReducers";
import { adminChatReducer } from "./reducers/adminChatReducers";


const reducer = combineReducers({
    cart: cartReducer ,
    userRegisterLogin: userRegisterLoginReducer,
    getCategories:getCategoriesReducer,
    adminChat: adminChatReducer
});

//get cart item state from local storage
const cartItemsInLocalStorage = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

const userInfoInLocalStorage = localStorage.getItem("userInfo")
? JSON.parse(localStorage.getItem("userInfo"))
: sessionStorage.getItem("userInfo")
? JSON.parse(sessionStorage.getItem("userInfo"))
: {}

const INITIAL_STATE = {
    cart: {
        //define default state for cart
        cartItems: cartItemsInLocalStorage,
        itemsCount: cartItemsInLocalStorage ? cartItemsInLocalStorage.reduce((accumulator, item) => Number(item.quantity) + accumulator, 0):0,
        cartSubtotal:  cartItemsInLocalStorage ? cartItemsInLocalStorage.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0) : 0
    },
    userRegisterLogin: { userInfo: userInfoInLocalStorage }
}

const middleware = [thunk];
const store = createStore(reducer,  INITIAL_STATE, composeWithDevTools(applyMiddleware(...middleware)))

export default store;

