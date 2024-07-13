import { GET_CATEGORIES, SET_SELECTED_CATEGORY } from "../actions/category";

const initialState = {
  categories: [],
  selectedCategory: "",
};

export default function categoryReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
      break;
    case SET_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
      };
      break;

    default:
      return state;
  }
}
