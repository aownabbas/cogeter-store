import React, { useEffect, useState } from "react";
import {
  calculateDiscountPercentage,
  isSaleProduct,
} from "../../helpers/Index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCurrencyMultiplier } from "../../utils/helperFile";

const ProductFooter = ({ item,hideSearchAndShowMain }) => {
  const navigate = useNavigate();
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

  return (
    <div className="_footer">
      <div
        className="product_title__and_wishlist"
        onClick={() => {navigate(`/products/${item.identifier}`)
        hideSearchAndShowMain()}}
      >
        <p>{item.title}</p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "5px",
          width: "100%",
        }}
      >
        <span>
          {isSaleProduct(
            item.on_sale,
            item?.sale_price * rateMultiplier,
            item?.regular_price * rateMultiplier,
            selectedCountry
          )}
        </span>
      </div>
    </div>
  );
};

export default ProductFooter;
