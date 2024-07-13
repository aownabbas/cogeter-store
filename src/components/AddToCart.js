import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";

import { Link } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import WishListModal from "./WishListModal";
import {
  _ToggleCartModal,
  _decrementItemQuantity,
  _getAllCartItems,
  _incrementItemQuantity,
  _removeItemFromCart,
} from "../redux/actions/product";

import SingleCartItem from "./product-related/single-cart-item/SingleCartItem";
import WhatWeOffer from "./product-related/what-we-offer/WhatWeOffer";
import { formatDecimal, getCurrencyMultiplier } from "../utils/helperFile";
import FreeDeliveryInfo from "./product-related/FreeDeliveryInfo";
import { listAllCartItems } from "../https/cartRequests";
import PaymentMethod from "./resuable/payment-methods/PaymentMethod";
import ShippingOption from "./resuable/payment-methods/ShippingOption";
import lock from ".././assets/payment/lock.svg";
import Tabby from "./resuable/tabbi/Tabby";

function AddToCart(props) {
  const [_couponDiscount, _setCouponDiscount] = useState(0);
  const [wishListModel, setWishListModel] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const dispatch = useDispatch();
  const _isLoading = useSelector((state) => state._products._isLoading);

  const _allCartItems = useSelector((state) => state._products.cartItems);
  const selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );
  const isLoggedIn = useSelector((state) => state._auth.isAuthenticated);
  const exchangeRates = useSelector((state) => state._general.exchangeRates);
  const [rateMultiplier, setRateMultiplier] = useState(1);
  useEffect(() => {
    setRateMultiplier(
      getCurrencyMultiplier(exchangeRates, selectedCountry?.currency)
    );
  }, [selectedCountry, exchangeRates]);

  useEffect(() => {
    getCartItemsFromServer();
  }, []);
  const getCartItemsFromServer = async () => {
    try {
      const response = await listAllCartItems(isLoggedIn);
      if (response.status === 200) {
        dispatch(_getAllCartItems(response.data.data));
      }
    } catch (error) {
    }
  };

  const noItemFound = () => {
    let isUserLoggedInToken = localStorage.getItem("token");

    return (
      <div className="_noItem">
        <div className="_body">
          <div className="_image">
            <img src={"/imgs/no_item_in_cart.svg"} />
          </div>
          <div className="_text">
            <h1>No item in cart</h1>
            {/* {!isUserLoggedInToken && (
              <p>Don't forget to log in to access your cart</p>
            )} */}
          </div>
          {/* <div className="_buttons">
            {isUserLoggedInToken ? (
              <Link to={"/"}>Go Home</Link>
            ) : (
              <Link
                to={"#"}
                onClick={() => {
                  setLoginModal(true);
                }}
              >
                Sign In
              </Link>
            )}

          </div> */}
        </div>
      </div>
    );
  };

  const renderCartSummary = () => {
    let subTotal = 0;
    let deliveryCharges = 0;
    let tax = 0;
    let discountPercentage = 0;
    _allCartItems.forEach((item) => {
      subTotal =
        subTotal +
        item.quantity *
        (item.onSale
          ? item.salePrice * rateMultiplier
          : item.regularPrice * rateMultiplier);
    });
    const totalAmount = subTotal - discountPercentage + deliveryCharges + tax;
    return (
      <>
        <div className="_subtotal">
          <h3>Subtotal</h3>
          {_isLoading ? (
            <Spinner animation="border" size="sm" role="status" />
          ) : (
            <h3>
              {selectedCountry?.currency} {formatDecimal(subTotal)}
            </h3>
          )}
        </div>
        <Tabby amount={formatDecimal(subTotal)} />
      </>
    );
  };
  return (
    <div className={`_cartContent ${props.hide}`}>
      <Row spacing={true}>
        <Col sm={12} lg={6}>
          <div className="_leftPanel">
            <div className="_header">
              <div className="_text">
                <h3
                  onClick={() => dispatch(_ToggleCartModal(true))}
                  data-menu-item={"cart"}
                >
                  {" "}
                  Cart (
                  {_allCartItems && _allCartItems?.length > 0
                    ? _allCartItems?.length
                    : 0}
                  )
                </h3>
              </div>
              <div className="_bar _hide">
                <span to={"#"} className="_active" bar-item-text="cart">
                  {" "}
                </span>
                <span
                  to={"#"}
                  bar-item-text="favorite"
                  className="_show"
                ></span>
              </div>
            </div>
            <div className="_body">
              <div className="_cartItem">
                {_allCartItems && _allCartItems?.length > 0
                  ? _allCartItems.map((item, index) => (
                    <div key={index}>
                      <SingleCartItem item={item} />
                    </div>
                  ))
                  : noItemFound()}
              </div>
            </div>
          </div>
        </Col>
        {_allCartItems && _allCartItems?.length > 0 && (
          <Col sm={12} lg={6}>
            <div className="_rightPanel">
              <div className="_item">
                <div className="_header">
                  <div className="_text">
                    <h3> Summary</h3>
                    <FreeDeliveryInfo />
                    {/* <div className="_toaster">
                    Free Delivery for shopping over 140{" "}
                    {selectedCountry?.currency}
                  </div> */}
                  </div>
                  {/* <PromoCode _setCouponDiscount={_setCouponDiscount} /> */}
                </div>
                <div className="_cartFooter">
                  <div className="_body">
                    {_allCartItems &&
                      _allCartItems?.length > 0 &&
                      renderCartSummary()}
                  </div>
                </div>
                <div className="_footer">
                  <button
                    type="button"
                    className="_cartButton"
                    onClick={props.onCheckout}
                  >
                    {/* <img
                      src={lock}
                      style={{
                        filter: "brightness(0) invert(1)",
                        paddingBottom: 4.5,
                      }}
                    />{" "} */}
                    Checkout
                  </button>
                </div>
                <PaymentMethod />
                <div className="hrow" />
                <ShippingOption hideText={true} />
              </div>
            </div>
            {/* <div>
              <WhatWeOffer />
            </div> */}
          </Col>
        )}
      </Row>
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />
      <WishListModal
        wishListModel={wishListModel}
        setWishListModel={setWishListModel}
      />
    </div>
  );
}

export default AddToCart;
