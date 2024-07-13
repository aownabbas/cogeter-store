import * as actionTypes from "../actionTypes/Index.js";
let initial_state = {
  status: "isListAddress",
  payload: {},
  address: {},
  personal_info: {},
  addresses: [],
  account_setup:{},
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case actionTypes.LOGOUT:
      return {
        ...state,
        payload: action.payload,
        status: "isLoggedOut",
      };

    case actionTypes.LOGIN:
      return {
        ...state,
        payload: action.payload,
        status: "isLoggedIn",
      };
    case actionTypes.PROFILE:
      // return action?.payload;
      return {
        ...state,
        payload: action.payload,
        status: "isProfile",
      };
    case actionTypes.REGISTRATION:
      // return {
      //     payload: action.payload,
      //     status: "isRegistered",
      // }
      return {
        ...state,
        payload: action.payload,
        status: "isRegistered",
      };
    case actionTypes.FORGOT_PASSWORD:
      // return {
      //     payload: action.payload,
      //     status: "isForgotPassword",
      // }
      return {
        ...state,
        payload: action.payload,
        status: "isForgotPassword",
      };
    case actionTypes.UPDATE_PASSWORD:
      // return {
      //     payload: action.payload,
      //     status: "isPasswordUpdated",
      // }
      return {
        ...state,
        payload: action.payload,
        status: "isPasswordUpdated",
      };
    case actionTypes.UPDATE_PERSONAL_INFO:
      return {
        ...state,
        personal_info: action.payload,
        status: "isPersonalInfoUpdated",
      };
    // return {
    //     payload: action.payload,
    //     status: "isPersonalInfoUpdated",
    // }
    case actionTypes.PERSONAL_INFO:
      return {
        ...state,
        personal_info: action.payload,
        status: "personalUserInfo",
      };
    // return {
    //     payload: action.payload,
    //     status: "personalUserInfo",
    // }
    case actionTypes.RESET_PASSWORD:
      return {
        ...state,
        payload: action.payload,
        status: "isResetPassword",
      };
    // return {
    //     payload: action.payload,
    //     status: "isResetPassword",
    // }

    case actionTypes.ERROR:
      return {
        ...state,
        payload: action.payload,
        status: "all",
      };
    // return {
    //     payload: action.payload,
    //     status: "all",
    // }
    case actionTypes.GET_EMIRATES:
      return {
        ...state,
        payload: action.payload,
        status: "isEmirates",
      };
    case actionTypes.ADD_ADDRESS:
      return {
        ...state,
        payload: action.payload?.data?.data,
        status: "isSingleAddress",
      };
    case actionTypes.GET_ADDRESS:
      return {
        ...state,
        addresses: action.payload?.data?.data,
        status: "isListAddress",
      };
    case actionTypes.GET_SINGLE_ADDRESS:
      return {
        ...state,
        address: action.payload,
        status: "isSingleAddress",
      };
      case actionTypes.ACCOUNT_SETUP:
      return {
        ...state,
        account_setup: action.payload,
        status: "AccountSetup",
      };
      case actionTypes.APPLE_LOGIN:
      return {
        ...state,
        apple_login: action.payload,
        status: "appleLogin",
      };

    default:
      return state;
  }
};
