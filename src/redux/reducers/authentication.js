import { LOGIN, LOGOUT, USER_REGISTER } from "../actions/authentication";

const userItem = localStorage.getItem("user");
const parsedUser =
  userItem && userItem !== "undefined" ? JSON.parse(userItem) : null;

const initialState = {
  token: localStorage.getItem("token") || "",
  user: parsedUser,
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
};

export default function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem("token", action.payload.jwt);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("isAuthenticated", true);
      return {
        ...state,
        token: action.payload.jwt,
        user: action.payload.user,
        isAuthenticated: true,
      };
      break;
    case USER_REGISTER:
      localStorage.setItem("token", action.payload.jwt);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("isAuthenticated", true);
      return {
        ...state,
        token: action.payload.jwt,
        user: action.payload.user,
        isAuthenticated: true,
      };
      break;
    case LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      return {
        ...state,
        token: "",
        user: null,
        isAuthenticated: false,
      };
      break;
    default:
      return state;
  }
}
