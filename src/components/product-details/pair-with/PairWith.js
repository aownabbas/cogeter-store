import React, { useEffect, useState } from "react";
import { Accordion, Button, Col, Form } from "react-bootstrap";

import "./style.css";
import { calculateDiscountPercentage } from "../../../helpers/Index";
import { useDispatch, useSelector } from "react-redux";
import {
  addPreFixToMediaUrl,
  formatDecimal,
  getCurrencyMultiplier,
} from "../../../utils/helperFile";
import {
  _ToggleCartModal,
  _addItemToCart,
} from "../../../redux/actions/product";

import NotWishlistIcon from "../../../assets/icons/not-wishlist.svg";
import IsWishlist from "../../../assets/icons/is-wishlist.svg";
import { _toggleOverylay } from "../../../redux/actions/settingsAction";

const PairWith = ({ product, onClick }) => {
  const dispatch = useDispatch();
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

  const coverImage = product?.cover_image;
  let product_id = product?.id;
  return (
    <div className="pair_with__container">
      <div className="pair_with__cover__div_parent">
        <div className="pair_with__cover__div" onClick={onClick}>
          {coverImage !== null || coverImage !== "" ? (
            <img src={addPreFixToMediaUrl(coverImage)} />
          ) : (
            <img src={"/imgs/no_img.png"} />
          )}
        </div>
      </div>
      <div className="pair_with__info__div">
        <div className="pair_with__title_div" onClick={onClick}>
          <div className="pair_with__title">
            <div className="title-content">
              <p>{product?.title}</p>
            </div>
          </div>
        </div>
        <div className="pair_with__price__div">
          {product?.on_sale ?
            <>
              <div className="prices_values">
                <p className="pair_sale_price">
                  {formatDecimal(product?.sale_price * rateMultiplier)}{" "}
                  {selectedCountry?.currency}
                </p>
                <p className="pair_regular_price">
                  {formatDecimal(product?.regular_price * rateMultiplier)}{" "}
                  {selectedCountry?.currency}
                </p>
              </div>
            </> :
            <>
              <div className="prices_values">
                <p className="pair_sale_price">
                  {formatDecimal(product?.regular_price * rateMultiplier)}{" "}
                  {selectedCountry?.currency}
                </p>
              </div>
            </>
          }

        </div>

        <div className="pair_with_sizes ">
          {(product?.variants ?? []).map((item) => {
            const isDisabled = item.quantity === "0" || item.quantity === 0;

            return (
              <p
                className={`pair_with_sizebox ${isDisabled ? "crossed-out" : ""
                  }`}
                key={item.id}
                onClick={
                  isDisabled
                    ? null
                    : () => {
                      dispatch(_ToggleCartModal(true));
                      dispatch(_addItemToCart(product, item));
                      dispatch(_toggleOverylay(true));
                    }
                }
                disabled={isDisabled}
              >
                {item.size}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PairWith;
