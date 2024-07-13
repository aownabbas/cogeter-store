import {
  ADD_ITEM_TO_CART,
  CART_ITEMS_FAILURE,
  CART_ITEMS_SUCCESS,
  CART_START,
  CART_STOP,
  CLEAR_CART,
  DECREMENT_ITEM_QUNATITY,
  GET_ALL_CART_ITEMS,
  GET_ALL_PRODUCTS,
  INCREAMENT_ITEM_QUNATITY,
  REMOVE_ITEM_FROM_CART,
  TOGGLE_CART_MODAL,
  TOGGLE_WISHLIST_MODAL,
  TOGGLE_WISHLIST_PRODUCT,
} from "../actions/product";

const initialState = {
  products: [],
  wishlists: [],
  cartItems: [],
  isWishlistModalOpen: false,
  isCartModalOpen: false,
  _isLoading: false,
  _loading: false,
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
      break;
    case TOGGLE_WISHLIST_PRODUCT:
      const productId = action.payload;
      let updatedWishlists = [...state.wishlists];
      const newCartItems = state.cartItems.filter(
        (item) => item.productId !== productId
      ); // Remove from cartItems

      const updatedProducts = state.products?.map((product) => {
        if (product.id === productId) {
          const updatedProduct = {
            ...product,
            is_wishlist: !product.is_wishlist,
          };

          if (updatedProduct.is_wishlist) {
            updatedWishlists.push(updatedProduct);
          } else {
            updatedWishlists = updatedWishlists?.filter(
              (item) => item.id !== productId
            );
          }

          return updatedProduct;
        }
        return product;
      });

      const filtrsFavouriteProducts = updatedProducts?.filter(
        (pr) => pr.id === productId
      );

      return {
        ...state,
        products: updatedProducts,
        wishlists: updatedWishlists,
        cartItems: newCartItems,
      };
      break;
    case GET_ALL_CART_ITEMS:
      return {
        ...state,
        cartItems: action.payload,
      };

    case TOGGLE_WISHLIST_MODAL:
      return {
        ...state,
        isWishlistModalOpen: action.payload,
      };
      break;

    case ADD_ITEM_TO_CART:
      const { product, variant } = action.payload;
      const cartItem = {
        productId: product.id,
        identifier: product?.identifier,
        title: product.title,
        regularPrice: product.regular_price,
        onSale: product.on_sale,
        salePrice: product.sale_price,
        coverImage: product.cover_image,
        variantId: variant.id,
        variantSize: variant.size,
        quantity: 1,
      };

      const existingCartItem = state.cartItems?.find(
        (item) => item.variantId === cartItem.variantId
      );
      if (existingCartItem) {
        return {
          ...state,
          cartItems: state?.cartItems?.map((item) =>
            item.variantId === existingCartItem.variantId
              ? { ...item, quantity: parseInt(item.quantity) + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        cartItems: [...state?.cartItems, cartItem],
      };
      break;
    case TOGGLE_CART_MODAL:
      return {
        ...state,
        isCartModalOpen: action.payload,
      };
      break;
    case INCREAMENT_ITEM_QUNATITY:
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.variantId === action.payload
            ? { ...item, quantity: parseInt(item.quantity) + 1 }
            : item
        ),
      };
      break;
    case DECREMENT_ITEM_QUNATITY:
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.variantId === action.payload && item.quantity > 1
            ? { ...item, quantity: parseInt(item.quantity) - 1 }
            : item
        ),
      };
      break;
    case REMOVE_ITEM_FROM_CART:
      const updatedCartItems = state.cartItems?.filter(
        (item) => item.variantId !== action.payload
      );
      return {
        ...state,
        cartItems: updatedCartItems,
      };
      break;
    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      };
      break;
    case CART_START:
      return {
        ...state,
        _isLoading: true,
      };
      break;
    case CART_STOP:
      return {
        ...state,
        _isLoading: false,
      };
      break;

    case CART_ITEMS_SUCCESS:
      return {
        ...state,
        _loading: true,
      };
      break;
    case CART_ITEMS_FAILURE:
      return {
        ...state,
        _loading: false,
      };
      break;

    default:
      return state;
  }
}
