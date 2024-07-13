import * as actionTypes from "../actionTypes/Index.js";
export const openSidebar = (payload) => {
  return {
    type: actionTypes.LEFT_SIDEBAR_OPEN,
    payload,
  };
};
export const closeSidebar = (payload) => {
  return {
    type: actionTypes.LEFT_SIDEBAR_CLOSE,
    payload,
  };
};
