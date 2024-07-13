import { toast } from "react-toastify";

import {
  onAddItemToCart,
  onDecrementItemQuantityInCart,
  onIncrementItemQuantityInCart,
  onRemoveItemFromCart,
} from "../../https/cartRequests";

export const GET_ALL_PRODUCTS = "GET_ALL_PRODUCTS";

export const GET_ALL_CART_ITEMS = "GET_ALL_CART_ITEMS";
export const TOGGLE_WISHLIST_PRODUCT = "TOGGLE_WISHLIST_PRODUCT";
export const TOGGLE_WISHLIST_MODAL = "TOGGLE_WISHLIST_MODAL";

// cart
export const ADD_ITEM_TO_CART = "ADD_ITEM_TO_CART";
export const REMOVE_ITEM_FROM_CART = "REMOVE_ITEM_FROM_CART";
export const INCREAMENT_ITEM_QUNATITY = "INCREAMENT_ITEM_QUNATITY";
export const DECREMENT_ITEM_QUNATITY = "DECREMENT_ITEM_QUNATITY";
export const TOGGLE_CART_MODAL = "TOGGLE_CART_MODAL";
export const CLEAR_CART = "CLEAR_CART";
export const CART_START = "CART_START";
export const CART_STOP = "CART_STOP";
export const CART_ITEMS_SUCCESS = "CART_ITEMS_SUCCESS";
export const CART_ITEMS_FAILURE = "CART_ITEMS_FAILURE";

export const SINGLE_PRODUCT_DETAIL = "SINGLE_PRODUCT_DETAIL";

export const _onCartItemsSuccess = () => {
  return {
    type: CART_ITEMS_SUCCESS,
  };
};
export const _onCartItemsFaulure = () => {
  return {
    type: CART_ITEMS_FAILURE,
  };
};
export const _getAllProducts = (data) => {
  return (dispath) => {
    dispath({
      type: GET_ALL_PRODUCTS,
      payload: data,
    });
  };
};

export const _getSingleProductDetail = (data) => {
  return (dispath) => {
    dispath({
      type: SINGLE_PRODUCT_DETAIL,
      payload: data,
    });
  };
};

export const _getAllCartItems = (data) => {
  return (dispath) => {
    dispath({
      type: GET_ALL_CART_ITEMS,
      payload: data,
    });
  };
};

export const _toggleWishlistProduct = (productId) => {
  return (dispath) => {
    dispath({
      type: TOGGLE_WISHLIST_PRODUCT,
      payload: productId,
    });
  };
};
export const _toggleWishlistModal = (toggle) => {
  return (dispath) => {
    dispath({
      type: TOGGLE_WISHLIST_MODAL,
      payload: toggle,
    });
  };
};
const cartLoadingStart = () => {
  return {
    type: CART_START,
  };
};

const cartLoadingStop = () => {
  return {
    type: CART_STOP,
  };
};

export const _addItemToCart = (product, variant) => {
  return async (dispatch) => {
    try {
      const payload = {
        product_id: product.id,
        variant_id: variant.id,
        action: "add_to_cart",
      };
      const response = await onAddItemToCart(payload);
      if (response.status === 200) {
        dispatch({
          type: ADD_ITEM_TO_CART,
          payload: { product, variant },
        });
        dispatch({
          type: GET_ALL_CART_ITEMS,
          payload: response.data.data,
        });
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };
};

export const _incrementItemQuantity = (variantId, cart_id) => {
  return async (dispatch) => {
    dispatch(cartLoadingStart());
    try {
      const payload = {
        cart_id: cart_id,
        action: "increment",
      };
      const response = await onIncrementItemQuantityInCart(payload);
      if (response.status === 200) {
        dispatch({
          type: INCREAMENT_ITEM_QUNATITY,
          payload: variantId,
        });
        dispatch({
          type: GET_ALL_CART_ITEMS,
          payload: response.data.data,
        });
        dispatch(cartLoadingStop());
      }
    } catch (error) {
      dispatch(cartLoadingStop());
      errorRequestHandel({ error: error });
    }
  };
};

export const _decrementItemQuantity = (variantId, cart_id) => {
  return async (dispatch) => {
    dispatch(cartLoadingStart());

    try {
      const payload = {
        cart_id: cart_id,
        action: "decrement",
      };
      const response = await onDecrementItemQuantityInCart(payload);
      if (response.status === 200) {
        dispatch({
          type: DECREMENT_ITEM_QUNATITY,
          payload: variantId,
        });
        dispatch({
          type: GET_ALL_CART_ITEMS,
          payload: response.data.data,
        });
        dispatch(cartLoadingStop());
      }
    } catch (error) {
      dispatch(cartLoadingStop());
    }
  };
};

export const _ToggleCartModal = (toggle) => {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_CART_MODAL,
      payload: toggle,
    });
  };
};

export const _removeItemFromCart = (variantId, cart_id) => {
  return async (dispatch) => {
    dispatch(cartLoadingStart());

    try {
      const payload = {
        cart_id: cart_id,
        action: "remove",
      };
      const response = await onRemoveItemFromCart(payload);
      if (response.status === 200) {
        dispatch({
          type: REMOVE_ITEM_FROM_CART,
          payload: variantId,
        });
        dispatch({
          type: GET_ALL_CART_ITEMS,
          payload: response.data.data,
        });
        dispatch(cartLoadingStop());
      }
    } catch (error) {
      dispatch(cartLoadingStop());

    }
  };
};

export const _clearCartItems = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_CART,
    });
  };
};

const errorRequestHandel = ({ error }) => {
  // toast.error(error.message);
  if (error?.response?.status === 422) {
    const err = error.response.data.errors;
    toast.error(err[Object.keys(err)[0]]);
  } else if (error?.response?.status === undefined) {
    toast.error("Server down temporarily");
  } else {
    toast.error(error?.response?.data?.message ?? error?.response?.data?.error);
  }
  return null;
};
