import * as actionTypes from "../actionTypes/Index.js";
let initial_state = {
  payload: {},
  status: false,
  isFilter: false,
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case actionTypes.CATEGORIES:
      return {
        ...state,
        payload: action.payload,
        status: true,
      };
    case actionTypes.FILTER_ON:
      return {
        ...state,
        isFilter: action.payload,
        status: true,
      };
    default:
      return state;
  }
};
