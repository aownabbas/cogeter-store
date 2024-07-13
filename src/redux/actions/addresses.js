import { toast } from "react-toastify";
import { deleteAddress } from "../../https/addressesRequests";
import { errorRequestHandel } from "../../utils/helperFile";

export const ALL_ADDRESS = "ALL_ADDRESS";
export const ADD_NEW_ADDRESS = "ADD_NEW_ADDRESS";
export const UPDATE_ADDRESS = "UPDATE_ADDRESS";
export const SELECT_ADDRESS = "SELECT_ADDRESS";
export const CLEAR_ADDRESS = "CLEAR_ADDRESS";
export const DELETE_ADDRESS = "DELETE_ADDRESS";

export const _getAllAddresses = (data) => {
  return (dispatch) => {
    dispatch({
      type: ALL_ADDRESS,
      payload: data,
    });
  };
};
export const _addNewAddress = (data) => {
  return (dispatch) => {
    dispatch({
      type: ADD_NEW_ADDRESS,
      payload: data,
    });
  };
};
export const _updateAddress = (data, id) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_ADDRESS,
      payload: { data, id },
    });
  };
};
export const _selectAddress = (id) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_ADDRESS,
      payload: id,
    });
  };
};
export const _clearAddressObject = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_ADDRESS,
    });
  };
};

export const _deleteAddress = (id) => {
  return async (dispatch) => {
    try {
      const response = await deleteAddress({ id: id });
      if (response.status === 200) {
        toast.success("Address deleted");
        dispatch({
          type: DELETE_ADDRESS,
          payload: id,
        });
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };
};
