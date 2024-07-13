import * as actionTypes from "../actionTypes/Index.js";
import { getReq, putReq, postReq } from "../helpers/Index.js";

export const fetchProducts =
  (payload = {}) =>
  (dispatch) => {
    let url = "/products?populate=deep,2";
    getReq(url)
      .then((response) =>
        dispatch({ type: actionTypes.PRODUCTS, payload: response })
      )
      .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
  };
export const isProductFavorite = (payload) => (dispatch) => {
  putReq(`/mark-product-favorite`, {
    is_favorite: payload?.is_favorite,
    product_id: payload?.product_id,
  })
    .then((response) =>
      dispatch({ type: actionTypes.IS_FAVORITE, payload: response })
    )
    .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};

export const priceFilterInDb = (payload) => (dispatch) => {
  getReq("/products?populate=deep,3")
    .then((response) =>
      dispatch({ type: actionTypes.FILTER_BASED_ON, payload: response })
    )
    .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};
export const saleEnhancer = () => (dispatch) => {
  getReq("/sale-enhancer-report")
    .then((response) =>
      dispatch({ type: actionTypes.GET_SALE_ENHANCER, payload: response })
    )
    .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
};
