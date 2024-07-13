import { CHANGE_COUNTRY } from "../../actionTypes/Index";
import { IS_LOGIN_MODAL, TOGGLE_OVERLAY } from "../actions/settingsAction";

const initialState = {
  selectedCountry: {},
  overlayEnabled: false,
  isLoginModal: false,
};

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_COUNTRY:
      localStorage.setItem("selectedCountry", action.payload);
      return {
        ...state,
        selectedCountry: action.payload,
      };
      break;
    case TOGGLE_OVERLAY:
      return {
        ...state,
        overlayEnabled: action.payload,
      };
      break;
    case IS_LOGIN_MODAL:
      return {
        ...state,
        isLoginModal: action.payload,
      };
      break;
    default:
      return state;
  }
}
