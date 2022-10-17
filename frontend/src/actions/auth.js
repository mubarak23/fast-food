import { LOGIN_FAIL,LOGIN_SUCCESS,REGISTER_FAIL,REGISTER_SUCCESS, LOGOUT,SET_CHECKOUT_IN_HISTORY,CLEAR_CHECKOUT_FROM_HISTORY } from "../types";
import { showMessage} from "./toastr"
import {setLoader} from "./loader"
import { auth } from "../services"

let toastrInfoOption = {
    icon: "success",
    status: "success"
}

export function userLogin(email, password){
    return async (dispatch, getState) => {
        dispatch(setLoader(true))
        let res = await auth.userLogin(email, password)
        dispatch(setLoader(false))
        if(!res.data) return userLoginFailed(res)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: { user: res.data }
        })
        let checkout = getState().auth.checkout;
        if (checkout){
            showMessage('Welcome back',"Continue Shopping your best meal", {icon:'info', status:'info'}) (dispatch);
        }else{
            showMessage('Success',"Welcome back", toastrInfoOption) (dispatch);
        }
        return true
    }
}

function userLoginFailed (res){
    return async (dispatch) => {
        dispatch({
            type: LOGIN_FAIL,
          });

    showMessage(res.error.title,res.error.message, {icon:'error', status:'error'}) (dispatch);
    }
}

function registerFailed (res){
    return async (dispatch) => {
        dispatch({
            type: REGISTER_FAIL,
          });

    showMessage(res.error.title,res.error.message, {icon:'error', status:'error'}) (dispatch);
    }
}

export function register (name, phone, password, email) {
       return async(dispatch) => {
            dispatch(setLoader(true))
            let res = await auth.userRegister(name, phone, email, password)
            dispatch(setLoader(false))
            if (!res.data) return registerFailed(res)(dispatch);
            dispatch({
                type: REGISTER_SUCCESS,
                payload: { user: res.data}
            }) 
            showMessage('Success',"Your account has been created", toastrInfoOption) (dispatch);
        return true

       } 
}


export function logout(){
    return async (dispatch) => {
        dispatch({
            type: LOGOUT
        })
        showMessage('Success',"Logged out", toastrInfoOption) (dispatch);
    }
}

export function setCheckout(email,password) {
    return async (dispatch) => {
        dispatch({
            type: SET_CHECKOUT_IN_HISTORY
          });
          showMessage("Unauthorized","Login to your account to continue your shopping", {icon:'info', status:'info'}) (dispatch);

    };
}
export function clearCheckout(email,password) {
    return async (dispatch) => {
        dispatch({
            type: CLEAR_CHECKOUT_FROM_HISTORY
          });
    };
}
