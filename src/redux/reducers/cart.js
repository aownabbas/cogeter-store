// import {
//   ADD_ITEM_TO_CART,
//   CLEAR_CART,
//   DECREMENT_ITEM_QUNATITY,
//   INCREAMENT_ITEM_QUNATITY,
//   REMOVE_ITEM_FROM_CART,
//   TOGGLE_CART_MODAL,
// } from "../actions/cart";

// const intitialState = {
//   cartItems: [],
//   isCartModalOpen: false,
// };

// export default function cartReducer(state = intitialState, action) {
//   switch (action.type) {
//     case ADD_ITEM_TO_CART:
//       const { product, variant } = action.payload;
//       const cartItem = {
//         productId: product.id,
//         title: product.title,
//         regularPrice: product.regular_price,
//         onSale: product.on_sale,
//         salePrice: product.sale_price,
//         coverImage: product.cover_image,
//         variantId: variant.id,
//         variantSize: variant.size,
//         quantity: 1,
//       };

//       const existingCartItem = state.cartItems?.find(
//         (item) => item.variantId === cartItem.variantId
//       );
//       if (existingCartItem) {
//         return {
//           ...state,
//           cartItems: state.cartItems.map((item) =>
//             item.variantId === existingCartItem.variantId
//               ? { ...item, quantity: parseInt(item.quantity) + 1 }
//               : item
//           ),
//         };
//       }

//       return {
//         ...state,
//         cartItems: [...state.cartItems, cartItem],
//       };
//       break;
//     case TOGGLE_CART_MODAL:
//       return {
//         ...state,
//         isCartModalOpen: action.payload,
//       };
//       break;
//     case INCREAMENT_ITEM_QUNATITY:
//       return {
//         ...state,
//         cartItems: state.cartItems.map((item) =>
//           item.variantId === action.payload
//             ? { ...item, quantity: parseInt(item.quantity) + 1 }
//             : item
//         ),
//       };
//       break;
//     case DECREMENT_ITEM_QUNATITY:
//       return {
//         ...state,
//         cartItems: state.cartItems.map((item) =>
//           item.variantId === action.payload && item.quantity > 1
//             ? { ...item, quantity: parseInt(item.quantity) - 1 }
//             : item
//         ),
//       };
//       break;
//     case REMOVE_ITEM_FROM_CART:
//       const updatedCartItems = state.cartItems?.filter(
//         (item) => item.variantId !== action.payload
//       );
//       return {
//         ...state,
//         cartItems: updatedCartItems,
//       };
//       break;
//     case CLEAR_CART:
//       return {
//         ...state,
//         cartItems: [],
//       };
//       break;

//     default:
//       return state;
//   }
// }
