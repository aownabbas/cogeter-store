import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatDecimal, getCurrencyMultiplier } from "../../utils/helperFile";

const FreeDeliveryInfo = () => {
  const _allCartItems = useSelector((state) => state._products.cartItems);

  const selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );
  const exchangeRates = useSelector((state) => state._general.exchangeRates);

  const [subTotal, setSubtotal] = useState(0);
  const [rateMultiplier, setRateMultiplier] = useState(1);
  const countryDeliveryTaxes = useSelector(
    (state) => state._general.countryDeliveryTaxes
  );
  const _countryDeliveryTaxes = countryDeliveryTaxes?.find(
    (item) => item?.country?.id === selectedCountry?.id
  );

  useEffect(() => {
    let _subTotal = 0;
    _allCartItems?.forEach((item) => {
      _subTotal =
        _subTotal +
        item.quantity *
          (item.onSale
            ? item.salePrice * rateMultiplier
            : item.regularPrice * rateMultiplier);
    });
    setSubtotal(_subTotal);
  }, [_allCartItems, selectedCountry, exchangeRates, rateMultiplier]);

  useEffect(() => {
    setRateMultiplier(
      getCurrencyMultiplier(exchangeRates, selectedCountry?.currency)
    );
  }, [selectedCountry, exchangeRates]);

  return (
    <div className="_toaster">
      {subTotal <
      _countryDeliveryTaxes?.free_shipping_threshold * rateMultiplier ? (
        <>
          Free delivery for orders over{" "}
          {parseInt(
            _countryDeliveryTaxes?.free_shipping_threshold * rateMultiplier
          )}{" "}
          {selectedCountry?.currency}
        </>
      ) : (
        <>Free delivery unlocked!</>
      )}
    </div>
  );
};

export default FreeDeliveryInfo;
