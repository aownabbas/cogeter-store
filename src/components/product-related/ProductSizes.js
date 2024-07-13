import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _ToggleCartModal, _addItemToCart } from "../../redux/actions/product";
import { _toggleOverylay } from "../../redux/actions/settingsAction";
import { trackAddToCart, ttqtrackAddToCart } from "../../utils/analyticsEvents";
import { getCurrencyMultiplier } from "../../utils/helperFile";
const ProductSizes = ({ product, isOnMobile }) => {
  const dispatch = useDispatch();

  const exchangeRates = useSelector((state) => state._general.exchangeRates);
  const selectedCountry = useSelector((state) => state._settings.selectedCountry);
  const [rateMultiplier, setRateMultiplier] = useState(1);

  useEffect(()=>{
    setRateMultiplier(getCurrencyMultiplier(exchangeRates, selectedCountry?.currency));
  },[selectedCountry,exchangeRates])
  
  return (
    <div
      className={isOnMobile ? "_clothSizes _clothSizesOnMobile" : "_clothSizes"}
    >
      {product.variants?.length > 0 &&
        product.variants?.map((variant, index) => {
          const isDisabled = variant.quantity === "0" || variant.quantity === 0;
          return (
            <span
              key={index}
              className={`primary ${isDisabled ? "crossed-out__line" : ""}`} // Apply crossed-out class if disabled
              disabled={isDisabled}
              onClick={
                isDisabled
                  ? null
                  : () => {
                    dispatch(_addItemToCart(product, variant));
                    dispatch(_ToggleCartModal(true));
                    dispatch(_toggleOverylay(true));
                    trackAddToCart(product, variant, rateMultiplier, selectedCountry?.currency);
                    ttqtrackAddToCart(product, variant)
                  }
              }
            >
              {variant.size}
            </span>
          );
        })}
    </div>
  );
};
export default ProductSizes;
