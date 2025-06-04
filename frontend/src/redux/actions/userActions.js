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
    const clearCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      };
      
      // Usage: Call clearCookie with the name of the cookie you want to clear
      clearCookie("access_token");      
    dispatch({ type: LOGOUT_USER })
}
