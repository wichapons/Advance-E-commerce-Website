import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import { cartReducer  } from "./reducers/cartReducers";
import { userRegisterLoginReducer } from './reducers/userReducers';

const reducer = combineReducers({
    cart: cartReducer ,
    userRegisterLogin: userRegisterLoginReducer 
})

const userInfoInLocalStorage = localStorage.getItem("userInfo")
? JSON.parse(localStorage.getItem("userInfo"))
: sessionStorage.getItem("userInfo")
? JSON.parse(sessionStorage.getItem("userInfo"))
: {}

const INITIAL_STATE = {
    cart: {
        //define default state for cart
        cartItems: [],
        itemsCount: 0,
        cartSubtotal: 0
    },
    userRegisterLogin: { userInfo: userInfoInLocalStorage }
}

const middleware = [thunk];
const store = createStore(reducer,  INITIAL_STATE, composeWithDevTools(applyMiddleware(...middleware)))

export default store;

