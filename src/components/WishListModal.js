import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, json, useNavigate } from "react-router-dom";
import UseOnClickOutside from "./useOnClickOutside";
import { fetchProducts } from "../actions/Products";
import { connect, useDispatch, useSelector } from "react-redux";
import CloseIcon from "../assets/icons/close-circle.svg";
import { calculateDiscountPercentage } from "../helpers/Index";
import { fetchWishList } from "../actions/Cart";
import {
  _toggleWishlistModal,
  _toggleWishlistProduct,
} from "../redux/actions/product";
import {
  addPreFixToMediaUrl,
  formatDecimal,
  getCurrencyMultiplier,
} from "../utils/helperFile";
import { _removeItemFromWishList } from "../redux/actions/wishList";
import { _toggleOverylay } from "../redux/actions/settingsAction";

function WishListModal(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isWishListModalOpen = useSelector(
    (state) => state._products.isWishlistModalOpen
  );
  const _wishList = useSelector((state) => state._products.wishlists);
  const selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );
  const exchangeRates = useSelector((state) => state._general.exchangeRates);
  const [rateMultiplier, setRateMultiplier] = useState(1);
  useEffect(() => {
    setRateMultiplier(
      getCurrencyMultiplier(exchangeRates, selectedCountry?.currency)
    );
  }, [selectedCountry, exchangeRates]);

  const linkToCartPage = () => {
    dispatch(_toggleWishlistModal(false));
    dispatch(_toggleOverylay(false));
    navigate("/wish-list", { replace: true });
  };
  const singleItem = (item, index) => {
    return (
      <div key={index} className="_item">
        <div className="_img">
          <Link to={`/products/${item.identifier}`}>
            <img src={addPreFixToMediaUrl(item.cover_image)} />
          </Link>
        </div>
        <div className="_detail">
          <div>
            {item.title}
            <img
              style={{ width: 25, height: 25, border: 0 }}
              src="/trash.svg"
              onClick={() => dispatch(_toggleWishlistProduct(item.id))}
              loading="true"
              className="_cursorPointer"
            />
          </div>
          <div>
            {item?.variants.map((variant, index) => {
              return (
                <div
                  key={index}
                  style={{
                    width: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="_size"
                >
                  {variant.size}
                </div>
              );
            })}
          </div>
          <div>
            <span>
              {item?.on_sale ? (
                <>
                  <Link to={"#"}>
                    {formatDecimal(item?.regular_price * rateMultiplier)}{" "}
                    {selectedCountry?.currency}
                  </Link>{" "}
                  <Link to={"#"}>
                    {formatDecimal(item?.sale_price * rateMultiplier)}{" "}
                    {selectedCountry?.currency}
                  </Link>
                </>
              ) : (
                <>
                  <Link to={"#"} className="_hidden">
                    {formatDecimal(item?.sale_price * rateMultiplier)}{" "}
                    {selectedCountry?.currency}
                  </Link>
                  <Link to={"#"}>
                    {formatDecimal(item?.regular_price * rateMultiplier)}{" "}
                    {selectedCountry?.currency}
                  </Link>
                </>
              )}
            </span>
            {item?.on_sale && (
              <span className="_offer">
                {calculateDiscountPercentage(
                  item?.sale_price,
                  item?.regular_price,
                  item.on_sale
                )}{" "}
                %OFF
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`_cartModal ${!isWishListModalOpen ? "_hidden" : "_flex"}`}
      // className={`_cartModal ${!isWishListModalOpen ? "_hidden" : "_flex"}`}
      >
        <div className="_cartContainer">
          <div className="_header">
            <div className="_title">Products added to your Wishlist</div>

            <div className="_close">
              <img
                className="_cursor_pointer"
                onClick={() => {
                  dispatch(_toggleWishlistModal(false));
                  dispatch(_toggleOverylay(false));
                }}
                src={CloseIcon}
                alt="icons"
              />
            </div>
          </div>

          <div className="_body">
            {_wishList &&
              _wishList.length > 0 &&
              singleItem(_wishList[_wishList.length - 1], _wishList.length - 1)}
          </div>
          <div className="_footer">
            <Form.Group className="mb-3 _btnContainer">
              <Button
                onClick={linkToCartPage}
                variant="primary"
                className="_btnFlatCenter"
              >
                VIEW WISHLIST
              </Button>
            </Form.Group>
          </div>
        </div>
      </div>
    </>
  );
}

export default WishListModal;
