import React, { useEffect, useState } from "react";
import "./style.css";
import {
  addPreFixToMediaUrl,
  formatDecimal,
  getCurrencyMultiplier,
} from "../../../utils/helperFile";
import HeartCartItemIcon from "../../../assets/icons/view-cart-heart.svg";

import {
  _ToggleCartModal,
  _decrementItemQuantity,
  _incrementItemQuantity,
  _removeItemFromCart,
  _toggleWishlistModal,
  _toggleWishlistProduct,
} from "../../../redux/actions/product";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { calculateDiscountPercentage } from "../../../helpers/Index";
import { addProductToWishList } from "../../../https/wishlistRequests";
import {
  _toggleLoginModal,
  _toggleOverylay,
} from "../../../redux/actions/settingsAction";
import { Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SingleCartItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );
  const _isLoading = useSelector((state) => state._products._isLoading);

  const exchangeRates = useSelector((state) => state._general.exchangeRates);
  const [rateMultiplier, setRateMultiplier] = useState(1);
  useEffect(() => {
    setRateMultiplier(
      getCurrencyMultiplier(exchangeRates, selectedCountry?.currency)
    );
  }, [selectedCountry, exchangeRates]);

  const renderitemPrice = () => {
    if (item.onSale) {
      return (
        <div>
          <span className="regularPriceOnly">
            {formatDecimal(item.salePrice * rateMultiplier)}{" "}
            {selectedCountry?.currency}
          </span>
          <span className="regularPrice">
            {formatDecimal(item.regularPrice * rateMultiplier)}{" "}
            {selectedCountry?.currency}
          </span>
        </div>
      );
    } else {
      return (
        <div>
          <span className="regularPriceOnly">
            {formatDecimal(item.regularPrice * rateMultiplier)}{" "}
            {selectedCountry?.currency}
          </span>
        </div>
      );
    }
  };

  const markProductFavourite = async () => {
    const userToken = localStorage.getItem("token");
    if (userToken == null || userToken === undefined || userToken === "") {
      dispatch(_toggleLoginModal(true));
      dispatch(_ToggleCartModal(false));
      return;
    }
    try {
      const action = item.is_wishlist ? "remove" : "add";
      dispatch(_toggleWishlistProduct(item.productId));
      const data = {
        product: item.productId,
      };
      const response = await addProductToWishList({ data: data });
      if (response.status === 200) {
        if (action === "add") {
          toast.success("Product added to wishlist");
          dispatch(_removeItemFromCart(item?.variantId, item.cart_id));
        } else {
          toast.success("Product removed from wishlist");
        }
      }
    } catch (error) {
      dispatch(_toggleWishlistProduct(item.productId));
    }
  };
  return (
    <div className="cart_item__container">
      <div className="cart_item__body">
        <div className="cart_item__cover_item">
          <div
            className="cart_item__cover"
            onClick={() => navigate(`/products/${item.identifier}`)}
          >
            <img src={addPreFixToMediaUrl(item.coverImage)} />
          </div>
        </div>
        <div className="cart_item__details">
          <div className="cart_item__detail">
            <div
              className="cart_item__title"
              onClick={() => navigate(`/products/${item.identifier}`)}
            >
              <p>{item.title}</p>
            </div>
            <div className="cart_item__price_and_dicount">
              {renderitemPrice()}
            </div>
            <div className="cart_item__size">
              <span>{item.variantSize}</span>
            </div>
            <Row className="justify-content-around align-items-center">
              <div className="_qtyIncrements">
                <button
                  disabled={item.quantity <= 1}
                  onClick={() => {
                    dispatch(
                      _decrementItemQuantity(item.variantId, item.cart_id)
                    );
                  }}
                >
                  -
                </button>
                <button>{item.quantity}</button>
                <button
                  onClick={() => {
                    dispatch(
                      _incrementItemQuantity(item?.variantId, item?.cart_id)
                    );
                  }}
                >
                  +
                </button>
              </div>
              <div className="cart_item__actions">
                <div>
                  <img
                    onClick={() => {
                      dispatch(
                        _removeItemFromCart(item?.variantId, item.cart_id)
                      );
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      border: 0,
                      cursor: "pointer",
                    }}
                    src="/trash.svg"
                    loading="true"
                    className="_action"
                  />
                </div>
                <div>
                  <img
                    onClick={markProductFavourite}
                    style={{ width: 24, height: 24, cursor: "pointer" }}
                    src={HeartCartItemIcon}
                    alt={"/imgs/no_img.png"}
                    data-productid={item?.id}
                    data-is_favorite="0"
                    data-add="addToWishList"
                    loading="lazy"
                  />
                </div>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCartItem;
