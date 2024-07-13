import {
  ADD_NEW_ADDRESS,
  ALL_ADDRESS,
  CLEAR_ADDRESS,
  DELETE_ADDRESS,
  SELECT_ADDRESS,
  UPDATE_ADDRESS,
} from "../actions/addresses";

const initialState = {
  addresses: [],
  singleAddress: {},
};

export default function addressesReducer(state = initialState, action) {
  switch (action.type) {
    case ALL_ADDRESS:
      return {
        ...state,
        addresses: action.payload,
      };

      break;
    case UPDATE_ADDRESS:
      const addressIndex = state.addresses.findIndex(
        (item) => item.id === action.payload.id
      );
      state.addresses[addressIndex].address_line_1 = action.payload.data;
      const updatedAddresses = [...state.addresses];
      return {
        ...state,
        addresses: updatedAddresses,
        singleAddress: {},
      };
      break;
    case SELECT_ADDRESS:
      return {
        ...state,
        singleAddress: action.payload,
      };
      break;
    case CLEAR_ADDRESS:
      return {
        ...state,
        singleAddress: {},
      };
      break;
    case DELETE_ADDRESS:
      const filteredAddresses = state.addresses.filter(
        (address) => address.id !== action.payload
      );

      return {
        ...state,
        addresses: filteredAddresses,
      };
      break;
    case ADD_NEW_ADDRESS:
      return {
        ...state,
        addresses: [action.payload, ...state.addresses],
      };
      break;
    default:
      return state;
  }
}
