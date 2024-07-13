import React from "react";

import {
  _ToggleCartModal,
  _addItemToCart,
  _decrementItemQuantity,
  _getAllCartItems,
  _incrementItemQuantity,
} from "../redux/actions/product";

import { _toggleOverylay } from "../redux/actions/settingsAction";

import CartItemsModal from "./cart-items-modal/CartItemsModal";

function CartModal(props) {
  return (
    <>
      <CartItemsModal />
    </>
  );
}

export default CartModal;
