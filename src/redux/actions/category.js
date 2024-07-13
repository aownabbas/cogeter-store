export const GET_CATEGORIES = "GET_CATEGORIES";
export const SET_SELECTED_CATEGORY = "SET_SELECTED_CATEGORY";


export const _getAllCategories = (data) => {
  return (dispatch) => {
    dispatch({
      type: GET_CATEGORIES,
      payload: data,
    });
  };
};


export const _setSelectedCategory = (data) => {
  return (dispatch) => {
    dispatch({
      type: SET_SELECTED_CATEGORY,
      payload: data,
    });
  };
};


