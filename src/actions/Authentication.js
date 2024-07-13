import * as actionTypes from "../actionTypes/Index.js";
import { getReq, postReq, putReq } from "../helpers/Index.js";

export const profile = () => (dispatch) => {
  getReq("/auth/profile/1").then((response) =>
    dispatch({ type: actionTypes.PROFILE, payload: response })
  );
};

export const registration = (payload) => (dispatch) => {
  payload.username = payload.email;
  postReq("/auth/local/register", payload)
    .then((response) =>
      dispatch({ type: actionTypes.REGISTRATION, payload: response })
    )
    .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};

export const forgotPassword = (payload) => (dispatch) => {
  postReq("/auth/local/forgot-password", payload)
    .then((response) =>
      dispatch({ type: actionTypes.FORGOT_PASSWORD, payload: response })
    )
    .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};

export const resetPassword = (payload) => (dispatch) => {
  postReq("/auth/local/reset-password", payload)
    .then((response) =>
      dispatch({ type: actionTypes.RESET_PASSWORD, payload: response })
    )
    .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};
export const updatePassword = (payload) => (dispatch) => {
  postReq("/auth/local/update-password", payload)
    .then((response) =>
      dispatch({ type: actionTypes.UPDATE_PASSWORD, payload: response })
    )
    .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};
export const updatePersonalInformation = (payload) => (dispatch) => {
  postReq("/auth/local/update-user-profile", payload)
    .then((response) =>
      dispatch({ type: actionTypes.UPDATE_PERSONAL_INFO, payload: response })
    )
    .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};

export const loginUserInformation = (payload) => (dispatch) => {
  postReq("/auth/local/user-profile", payload)
    .then((response) =>
      dispatch({ type: actionTypes.PERSONAL_INFO, payload: response })
    )
    .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};
