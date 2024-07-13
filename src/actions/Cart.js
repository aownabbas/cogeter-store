import * as actionTypes from '../actionTypes/Index.js';
import { getReq, postReq, putReq } from '../helpers/Index.js';
export const addToCart = (payload) => (dispatch) => {
    dispatch({ type: actionTypes.ADD_ITEM, payload })
};

export const fetchCartItems = () => (dispatch) => {
    dispatch({ type: actionTypes.GET_CART_ITEM })
};

export const fetchWishList = () => (dispatch) => {
    dispatch({ type: actionTypes.GET_WISHLIST })
};

export const removeCartItem = (product_id) => (dispatch) => {
    dispatch({ type: actionTypes.REMOVE_CART_ITEM, payload: product_id })
};


export const removeWishListItem = (product_id) => (dispatch) => {
    dispatch({ type: actionTypes.REMOVE_WISHLIST_ITEM, payload: product_id })
};
export const updateWishListQty = (payload) => (dispatch) => {
    dispatch({ type: actionTypes.UPDATE_WISHLIST_QTY, payload })
};

export const updateCartQty = (product_id) => (dispatch) => {
    dispatch({ type: actionTypes.UPDATE_CART_QTY, payload: product_id })
};
export const toggleCartMenu = (payload) => (dispatch) => {
    dispatch({ type: actionTypes.TOGGLE_CART_MENU, payload: payload })
};

export const fetchCoupon = (payload) => async (dispatch) => {
    try {
        const response = await getReq(`/promo-codes?filters[type]=${payload}`);
        dispatch({ type: actionTypes.FETCH_COUPON, payload: response });
    } catch (err) {
        dispatch({ type: actionTypes.ERROR, payload: err });
    }
};

export const placeOrder = (payload) => (dispatch) => {
    postReq("/orders", payload)
        .then((response) => dispatch({ type: actionTypes.PLACE_ORDER, payload: response }))
        .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};

export const listOrders = (user_id) => (dispatch) => {
    getReq(`/orders`)
        .then((response) => dispatch({ type: actionTypes.LIST_ORDER, payload: response }))
        .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};

export const ordersDetails = (order_id) => (dispatch) => {
    // getReq(`/orders?populate=deep,4&filters[user][id]=${user_id}`)
    getReq(`/orders?populate=deep,3`)
        .then((response) => dispatch({ type: actionTypes.LIST_ORDER, payload: response }))
        .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};

export const listCartItems = (user_id) => (dispatch) => {
    getReq(`/cart-items?populate=deep,3`)
        .then((response) => dispatch({ type: actionTypes.LIST_CART_ITEM, payload: response }))
        .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};

export const postCartItems = (payload) => (dispatch) => {
    postReq(`/cart-items`, { data: payload })
        .then((response) => dispatch({ type: actionTypes.POST_CART_ITEM, payload: response }))
        .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};

export const putCartItems = (id, payload) => (dispatch) => {
    putReq(`/cart-items/${id}`, { data: payload })
        .then((response) => dispatch({ type: actionTypes.POST_CART_ITEM, payload: response }))
        .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};


export const confirmOrderPayment = (order_success) => (dispatch) => {
    postReq(`/orders/payment`, order_success)
        .then((response) => dispatch({ type: actionTypes.CONFIRM_PAYMENT, payload: response }))
        .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};







