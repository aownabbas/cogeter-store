import React, { useEffect, useState } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { _ToggleCartModal } from "../../redux/actions/product";
import { _toggleOverylay } from "../../redux/actions/settingsAction";

import CloseIcon from "../../assets/icons/close-circle.svg";
import no_item_incart from "../../assets/no-data/no_item_incart.svg";

import { formatDecimal, getCurrencyMultiplier } from "../../utils/helperFile";
import SingleCartItem from "../product-related/single-cart-item/SingleCartItem";
import CartShimer from "../shimer/cart-shimer/CartShimer";
import FreeDeliveryInfo from "../product-related/FreeDeliveryInfo";
import Tabby from "../resuable/tabbi/Tabby";
import { Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PaymentMethod from "../resuable/payment-methods/PaymentMethod";
import ShippingOption from "../resuable/payment-methods/ShippingOption";
import NoDataFound from "../resuable/no-data-found/NoDataFound";
import { trackBeginCheckout, ttqTrackInitiateCheckout } from "../../utils/analyticsEvents";

const CartItemsModal = () => {
  const dispatch = useDispatch();
  const _isUserLoggIn = localStorage.getItem("token");
  const _cartItems = useSelector((state) => state._products.cartItems);
  const _isCartModalOpen = useSelector(
    (state) => state._products.isCartModalOpen
  );
  const selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );
  const exchangeRates = useSelector((state) => state._general.exchangeRates);
  const _isLoading = useSelector((state) => state._products._isLoading);
  const _loading = useSelector((state) => state._products._loading);

  const [rateMultiplier, setRateMultiplier] = useState(1);
  const [isFooterSticky, setIsFooterSticky] = useState(false);
  const [footerStyle, setFooterStyle] = useState({
    position: "sticky",
    zIndex: 99,
    backgroundColor: "white",
    display: isFooterSticky ? "none" : "block",
    paddingBottom: 3,
    paddingTop: 3,
    bottom: 0,
  });

  const product_detail = useSelector((state) => state.products.product_detail);

  useEffect(() => {
    setRateMultiplier(
      getCurrencyMultiplier(exchangeRates, selectedCountry?.currency)
    );
  }, [selectedCountry, exchangeRates]);

  useEffect(() => {
    if (_isCartModalOpen) {
      document.body.classList.add("mode__open");
    } else {
      document.body.classList.remove("mode__open");
    }
  }, [_isCartModalOpen]);

  //   useEffect(() => {
  //     const handleScroll = () => {
  //       const scrollY = window.scrollY || window.pageYOffset;
  //       const windowHeight = window.innerHeight;
  //       const contentHeight = document.body.scrollHeight;
  //       const footerHeight = document.querySelector("._footer").clientHeight;

  //       setIsFooterSticky(scrollY + windowHeight >= contentHeight - footerHeight);
  //     };

  //     const handleResize = () => {
  //       //   Adjust the bottom value based on screen size
  //       if (window.innerWidth <= 768) {
  //         setFooterStyle({ ...footerStyle, bottom: "-55px" });
  //       } else {
  //         setFooterStyle({ ...footerStyle, bottom: "-50px" });
  //       }
  //     };

  //     window.addEventListener("scroll", handleScroll);
  //     window.addEventListener("resize", handleResize);

  //     // Initial setup
  //     handleScroll();
  //     handleResize();

  //     return () => {
  //       window.removeEventListener("scroll", handleScroll);
  //       window.removeEventListener("resize", handleResize);
  //     };
  //   }, [footerStyle]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Initial setup
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleResize = () => {
    // Adjust the bottom value based on screen size
    if (window.innerWidth <= 768) {
      setFooterStyle((prevStyle) => ({
        ...prevStyle,
        bottom: "-55px",
      }));
    } else {
      setFooterStyle((prevStyle) => ({
        ...prevStyle,
        bottom: "-50px",
      }));
    }
  };
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const contentHeight = document.body.scrollHeight;
    const footerHeight = document.querySelector("._footer").clientHeight;

    setIsFooterSticky(scrollY + windowHeight >= contentHeight - footerHeight);
  };

  const navigate = useNavigate();
  const linkToCartPage = () => {
    // navigate("/cart", { replace: true });
    dispatch(_ToggleCartModal(false));
    dispatch(_toggleOverylay(false));
  };
  const linkToCartPageWithTabIndex = () => {

    navigate("/cart", {
      state: {
        tabIndex: 1,
      },
    });
    trackBeginCheckout(selectedCountry?.currency, product_detail, rateMultiplier)
    ttqTrackInitiateCheckout(product_detail)
    dispatch(_ToggleCartModal(false));
    dispatch(_toggleOverylay(false));
  };

  const renderTabbyAndTamarinfo = () => {
    let subTotal = 0;
    let deliveryCharges = 0;
    let tax = 0;
    let discountPercentage = 0;
    _cartItems.forEach((item) => {
      subTotal =
        subTotal +
        item.quantity *
        (item.onSale
          ? item.salePrice * rateMultiplier
          : item.regularPrice * rateMultiplier);
    });
    const totalAmount = subTotal - discountPercentage + deliveryCharges + tax;
    return <Tabby amount={formatDecimal(subTotal)} />;
  };
  const renderCartSummary = () => {
    let subTotal = 0;
    let deliveryCharges = 0;
    let tax = 0;
    let discountPercentage = 0;
    _cartItems.forEach((item) => {
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
        <div className="cart__row" />
        <div className="__cart_modal__subtotal_container">
          <h3>Sub Total</h3>
          <h3>
            {_isLoading ? (
              <Spinner animation="border" size="sm" role="status" />
            ) : (
              <div className="__cart_modal__subtotal_amount">
                {selectedCountry?.currency} {formatDecimal(subTotal)}
              </div>
            )}
          </h3>
        </div>
        <div className="cart__row" />
      </>
    );
  };

  return (
    <div
      className={`__cart_modal__container ${!_isCartModalOpen ? "_hidden" : "_flex"
        }`}
    >
      <div className="__cart_modal__sticky_header_container">
        <div className="__cart_modal_header">
          <span className="first__span">
            {_cartItems?.length > 0 ? _cartItems?.length : ""}
          </span>{" "}
          {_cartItems?.length === 0
            ? "Add items to your cart"
            : `${_cartItems?.length > 0 && _cartItems?.length > 1
              ? "Products"
              : "Product"
            } added to your basket`}
        </div>
        <div
          className="__cart_modal_header_close"
          onClick={() => {
            dispatch(_ToggleCartModal(false));
            dispatch(_toggleOverylay(false));
          }}
        >
          <img
            className="_cursor_pointer"
            onClick={() => {
              dispatch(_ToggleCartModal(false));
              dispatch(_toggleOverylay(false));
            }}
            src={CloseIcon}
            alt=""
          />
        </div>
      </div>
      <br />
      <div className="__cart_modal__body__container">
        {_loading ? (
          <>
            <CartShimer />
            <CartShimer />
            <CartShimer />
            <CartShimer />
          </>
        ) : _cartItems.length > 0 ? (
          <>
            {_cartItems &&
              _cartItems?.map((item, index) => {
                return (
                  <div key={index}>
                    <SingleCartItem item={item} />
                  </div>
                );
              })}
          </>
        ) : (
          <NoDataFound
            title={"No Item in Cart"}
            icon={no_item_incart}
            subTitle={
              _isUserLoggIn === undefined ||
                _isUserLoggIn === "" ||
                _isUserLoggIn === null
                ? "Don’t forget to log in to access your cart."
                : ""
            }
          />
        )}
        {_cartItems && _cartItems.length > 0 && (
          <>
            <div className="cart_modal__deliveryfee_container">
              <FreeDeliveryInfo />
            </div>
            {renderTabbyAndTamarinfo()}
            <br />
            {_cartItems && _cartItems.length > 0 && renderCartSummary()}
          </>
        )}
        <div className="__cart_modal__footer" style={footerStyle}>
          <Form.Group className="mb-3 _btnContainer">
            <Button
              disabled={_cartItems && _cartItems?.length === 0}
              onClick={linkToCartPageWithTabIndex}
              variant="primary"
              className="_btnFlatCenter _checkoutBtn"
            >
              Checkout
            </Button>
          </Form.Group>
        </div>
        <div className="_continue_shoping_button" onClick={linkToCartPage}>
          <p>Continue Shopping</p>
        </div>
        <PaymentMethod />
        <ShippingOption hideText={true} />
      </div>
    </div>
  );
};

export default CartItemsModal;
