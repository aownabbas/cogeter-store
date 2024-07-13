import * as actionTypes from "../actionTypes/Index.js";
import { toast } from "react-toastify";
let initial_state = {
  cart: [],
  coupon: {},
  order: {},
  orders: [],
  toggle: false,
  payment_confirmation: false,
  wishlist: [],
  cartItems: [],
  cartItem: {},
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case actionTypes.ADD_ITEM:
      let product = {};
      let product_id = action?.payload?.product_id;
      let variant = action?.payload?.variant;
      let variant_id = action?.payload?.variant_id;
      let modal = action?.payload?.modal;
      let isFavorite = action?.payload?.isFavorite;
      product["product_id"] = product_id;
      product["qty"] = 1;
      product["variant"] = variant?.toUpperCase();
      product["variant_id"] = variant_id;
      let cartItems = "";
      if (modal == "cart") {
        cartItems = localStorage.getItem("cartItems");
      } else {
        cartItems = localStorage.getItem("wishListItems");
      }

      let updatedProducts = [];
      let isProductExist = false;
      if (!cartItems) {
        product = JSON.stringify(product);
        if (modal == "cart") {
          localStorage.setItem("cartItems", "[" + product + "]");
        } else {
          localStorage.setItem("wishListItems", "[" + product + "]");
        }
        isProductExist = true;
      } else {
        let products = JSON.parse(cartItems);
        const isProductDuplicate = products.some(
          (p) => p?.product_id == product_id
        );
        if (!isProductDuplicate) {
          const parsedProducts = JSON.parse(cartItems);
          updatedProducts = [...parsedProducts, product];
          if (modal == "cart") {
            localStorage.setItem("cartItems", JSON.stringify(updatedProducts));
          } else {
            if (isFavorite == 1) {
              localStorage.setItem(
                "wishListItems",
                JSON.stringify(updatedProducts)
              );
            }
          }
          isProductExist = true;
        }
      }

      if (!isProductExist) {
        // toast.error("Oops! The item is already in your wishlist.");
      } else {
        // toast.success("Success! The item has been added  to your wishlist.");
      }
      let add_wishlist = localStorage.getItem("wishListItems");
      add_wishlist = add_wishlist ? JSON.parse(add_wishlist) : [];
      let add_items = localStorage.getItem("cartItems");
      add_items = add_items ? JSON.parse(add_items) : add_items;

      return {
        ...state,
        cart: add_items,
        wishlist: add_wishlist,
      };
    case actionTypes.GET_CART_ITEM:
      let items = localStorage.getItem("cartItems");
      items = items ? JSON.parse(items) : [];

      return {
        ...state,
        cart: items,
      };
    case actionTypes.LIST_CART_ITEM:
      return {
        ...state,
        cartItems: action.payload,
      };

    case actionTypes.POST_CART_ITEM:
      return {
        ...state,
        cartItem: action.payload,
      };

    case actionTypes.FETCH_COUPON:
      return {
        ...state,
        coupon: action.payload,
      };

    case actionTypes.GET_WISHLIST:
      let wishlist = localStorage.getItem("wishListItems");
      wishlist = wishlist ? JSON.parse(wishlist) : [];
      // return {
      //     wishlist,
      //     is_cart: false,
      // };
      return {
        ...state,
        wishlist,
      };

    case actionTypes.REMOVE_WISHLIST_ITEM:
      let removeWishListItems = localStorage.getItem("wishListItems");
      let filterWishListItems = JSON.parse(removeWishListItems)?.filter(
        (item) => parseInt(item?.product_id) != parseInt(action?.payload)
      );
      if (filterWishListItems.length == 0) {
        localStorage.removeItem("wishListItems");
        let remove_wishlist = localStorage.getItem("wishListItems");
        remove_wishlist = remove_wishlist ? JSON.parse(remove_wishlist) : [];
        // return {
        //     wishlist: remove_wishlist,
        //     cart: remove_items,
        // };
        return {
          ...state,
          wishlist: remove_wishlist,
        };
      } else {
        localStorage.setItem(
          "wishListItems",
          JSON.stringify(filterWishListItems)
        );
        let remove_wishlist = localStorage.getItem("wishListItems");
        remove_wishlist = remove_wishlist ? JSON.parse(remove_wishlist) : [];
        // return {
        //     wishlist: remove_wishlist,
        //     cart: remove_items,
        // };

        return {
          ...state,
          wishlist: remove_wishlist,
        };
      }
    case actionTypes.UPDATE_WISHLIST_QTY:
      let wishlist_data = localStorage.getItem("wishListItems");
      wishlist_data = wishlist_data ? JSON.parse(wishlist_data) : [];
      let update_product_id = action?.payload?.product_id;
      let update_increment = action?.payload?.increment;
      let match = wishlist_data?.filter(
        (product) =>
          parseInt(product?.product_id) === parseInt(update_product_id)
      );
      if (match && match?.length) {
        match = match[0];
        let qty = match?.qty;
        if (update_increment) {
          qty = qty + 1;
        } else {
          if (qty != 1) {
            qty = qty - 1;
          }
        }
        match["qty"] = qty;
        let update_wish_list = wishlist_data.map((item) => {
          if (parseInt(item.product_id) == parseInt(match.product_id)) {
            return match;
          }
          return item;
        });
        localStorage.setItem("wishListItems", JSON.stringify(update_wish_list));
      }
      return {
        ...state,
        cart: localStorage.getItem("wishListItems"),
      };
    case actionTypes.TOGGLE_CART_MENU:
      return {
        ...state,
        toggle: action?.payload,
      };
    case actionTypes.PLACE_ORDER:
      return {
        ...state,
        order: action?.payload,
      };
    case actionTypes.LIST_ORDER:
      return {
        ...state,
        orders: action?.payload,
      };
    case actionTypes.CONFIRM_PAYMENT:
      return {
        ...state,
        payment_confirmation: action?.payload,
      };
    case actionTypes.UPDATE_CART_QTY:
      let updateCartItems = localStorage.getItem("cartItems");
      updateCartItems = updateCartItems ? JSON.parse(updateCartItems) : [];
      let update_cart_product_id = action?.payload?.product_id;
      let update_cart_increment = action?.payload?.increment;
      let update_cart_match = updateCartItems?.filter(
        (product) =>
          parseInt(product?.product_id) === parseInt(update_cart_product_id)
      );
      if (update_cart_match && update_cart_match?.length) {
        update_cart_match = update_cart_match[0];
        let qty = update_cart_match?.qty;
        if (update_cart_increment) {
          qty = qty + 1;
        } else {
          if (qty != 1) {
            qty = qty - 1;
          }
        }
        update_cart_match["qty"] = qty;
        let update_wish_list = updateCartItems.map((item) => {
          if (
            parseInt(item.product_id) == parseInt(update_cart_match.product_id)
          ) {
            return update_cart_match;
          }
          return item;
        });
        localStorage.setItem("cartItems", JSON.stringify(update_wish_list));
      }
      return {
        ...state,
        cart: localStorage.getItem("cartItems"),
      };

    case actionTypes.REMOVE_CART_ITEM:
      let removeCartItems = localStorage.getItem("cartItems");
      let filterCartItems = JSON.parse(removeCartItems)?.filter(
        (item) => parseInt(item?.product_id) != parseInt(action?.payload)
      );
      if (filterCartItems.length == 0) {
        localStorage.removeItem("cartItems");
        // let remove_wishlist = localStorage.getItem("wishListItems");
        // remove_wishlist = remove_wishlist ? JSON.parse(remove_wishlist) : remove_wishlist;
        let remove_items = localStorage.getItem("cartItems");
        remove_items = remove_items ? JSON.parse(remove_items) : [];
        // return {
        //     wishlist: remove_wishlist,
        //     cart: remove_items,
        // };
        return {
          ...state,
          cart: remove_items,
        };
      } else {
        localStorage.setItem("cartItems", JSON.stringify(filterCartItems));
        // let remove_wishlist = localStorage.getItem("wishListItems");
        // remove_wishlist = remove_wishlist ? JSON.parse(remove_wishlist) : remove_wishlist;
        let remove_items = localStorage.getItem("cartItems");
        remove_items = remove_items ? JSON.parse(remove_items) : [];
        // return {
        //     wishlist: remove_wishlist,
        //     cart: remove_items,
        // };

        return {
          ...state,
          cart: remove_items,
        };
      }
    default:
      let default_wishlist = localStorage.getItem("wishListItems");
      let default_items = localStorage.getItem("cartItems");
      default_items = default_items ? JSON.parse(default_items) : [];
      default_wishlist = default_wishlist ? JSON.parse(default_wishlist) : [];
      // return {
      //     wishlist: default_wishlist,
      //     cart: default_items,
      // };

      return {
        ...state,
        wishlist: default_wishlist,
        cart: default_items,
      };
  }
};
