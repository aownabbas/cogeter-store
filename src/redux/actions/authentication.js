import { ACCOUNT_SETUP,APPLE_LOGIN } from "../../actionTypes/Index";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const USER_REGISTER = "USER_REGISTER";


export const _login = (data) => {
    return (dispatch) => {
        dispatch({
            type: LOGIN,
            payload: data,
        });
    };
};

export const _register = (data) => {
    return (dispatch) => {
        dispatch({
            type: USER_REGISTER,
            payload: data,
        });
    };
};

export const _logout = (data) => {
    return (dispatch) => {
        dispatch({
            type: LOGOUT,
        });
    };
};

export const _accountSetup = (data) => {
    return (dispatch) => {
        dispatch({
            type: ACCOUNT_SETUP,
            payload: data,
        });
    };
};

export const _appleLogin = (data) => {
    return (dispatch) => {
        dispatch({
            type: APPLE_LOGIN,
            payload: data,
        });
    };
};


