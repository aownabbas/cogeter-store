import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LazyImage } from "../helpers/Index";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { _setSelectedCategory } from "../redux/actions/category";
import {
  addPreFixToMediaUrl,
  formatDecimal,
  getCurrencyMultiplier,
} from "../utils/helperFile";
import endPoints from "../https/endPoints";
function HomeScreenTopCategory(product) {
  const dispatch = useDispatch();

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

  const handelClickOnCategory = (id) => {
    dispatch(_setSelectedCategory(id));
    navigate(`${endPoints.CATEGORIES}/${id}`);
  };

  return (
    <>
      <section id="product">
        <div
          className="_text"
          onClick={() => handelClickOnCategory(product?.identifier)}
        >
          <div className="_overlay"></div>
          <p>{product?.tag}</p>
          <h1>{product?.title}</h1>
          <p>{product?.sub_title}</p>
          <h3>
            {formatDecimal(product?.starting_price * rateMultiplier)}{" "}
            {selectedCountry?.currency}
          </h3>
          <Link to={`#`}>VIEW NOW</Link>
        </div>
        <div className="_item">
          <img
            src={addPreFixToMediaUrl(product?.gallery[0]?.url)}
            alt={"/imgs/no_img.png"}
            loading="lazy"
          />
        </div>
        <div className="_item">
          <img
            src={addPreFixToMediaUrl(product?.gallery[1]?.url)}
            alt={"/imgs/no_img.png"}
            loading="lazy"
          />
        </div>
      </section>
    </>
  );
}
export default HomeScreenTopCategory;
