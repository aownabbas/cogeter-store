import { ADD_ITEM_TO_WISH_LIST } from "../actions/wishList";

const initialState = {
  wishLists: [],
  isWishListModalOpen: false,
};

export default function wishlistReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ITEM_TO_WISH_LIST:
      return {
        ...state,
      };
      break;

    default:
      return state;
  }
}
