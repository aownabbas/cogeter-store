import React from "react";
import ShimmerEffect from "../Shimer";

const CartShimer = () => {
  return (
    <div className="cart_shimer__container">
      <div className="cart_shimer__body">
        <div className="cart_shimer__cover">
          <ShimmerEffect />
        </div>
        <div className="cart_shimer__detail">
          <div className="cart_shimer__item">
            <ShimmerEffect />
          </div>
          <div className="cart_shimer__item">
            <ShimmerEffect />
          </div>
          <div className="cart_shimer__item">
            <ShimmerEffect />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartShimer;
