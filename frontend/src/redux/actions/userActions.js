import { LOGIN_USER } from '../constants/userConstants'
import axios from 'axios'

export const setReduxUserState = (userCreated) => (dispatch) => {
    dispatch({
        type: LOGIN_USER,
        payload: userCreated
    })
}

export const logout = () => (dispatch) => {
    document.location.href = "/login";
    axios.get('/api/logout')
    //clear data in local storage and sessions
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userInfo");
    localStorage.removeItem("cart");
    dispatch({ type: LOGOUT_USER })
}
