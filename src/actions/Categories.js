import * as actionTypes from "../actionTypes/Index.js";
import { getReq } from "../helpers/Index.js";

export const fetchCategories =
  (payload = {}) =>
    (dispatch) => {
      let keys = Object.keys(payload);
      let url = "/categories?populate=deep,2";
      if (keys.length > 0) {
        if (payload.hasOwnProperty("rangePrice")) {
          let rangePrice = payload?.rangePrice;
          url += `&filters[$and][0][$or][0][products][price][$gt]=0&filters[$and][0][$or][0][products][price][$lte]=${rangePrice}`;
        }
        if (payload.hasOwnProperty("price")) {
          let price = payload?.price;
          if (price == "low_to_high") {
            url += `&sort=products.price:ASC`;
          } else {
            url += `&sort=products.price:DESC`;
          }
        }
        if (payload.hasOwnProperty("color")) {
          let color = payload?.color;
          url += `&filters[$and][0][$or][0][products][colors][name][$containsi]=${color}`;
        }
        if (payload.hasOwnProperty("size")) {
          let size = payload?.size;
          url += `&filters[products][varients][size][$containsi]=${size}`;
        }
      }
      getReq(url)
        .then((response) =>
          dispatch({ type: actionTypes.CATEGORIES, payload: response })
        )
        .catch((err) => dispatch({ type: actionTypes.ERROR, payload: err }));
    };

export const isFilterOn = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.FILTER_ON, payload });
};
