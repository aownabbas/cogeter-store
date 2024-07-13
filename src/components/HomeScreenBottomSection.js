import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
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

function HomeScreenBottomSection({ bottomCategories }) {
  const dispatch = useDispatch();
  const ASSET_URL = process.env.REACT_APP_BACKEND_ASSETS_URL;
  const item = bottomCategories[0];
  const Image = (src) => {
    return LazyImage(<img src={src} />);
  };
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
      {bottomCategories ? (
        <section id="eleganceProducts">
          <div className="_header row"></div>
          <div
            className="_body"
            onClick={() => handelClickOnCategory(item?.identifier)}
          >
            <div className="_text">
              <div className="_overlay"></div>
              <p>{item?.sub_title}</p>
              <span style={{ height: 5 }}></span>
              <h3>
                {formatDecimal(item?.starting_price * rateMultiplier)}{" "}
                {selectedCountry?.currency}
              </h3>
              <Link to={`#`}>VIEW NOW</Link>
              <br />

              <div className="_cogeterText">
                {/* <img
                  src={addPreFixToMediaUrl(item?.gallery[0]?.url)}
                  alt={"/imgs/no_img.png"}
                  loading="lazy"
                /> */}
              </div>
            </div>
            <div className="_itemContainer">
              <div className="_item">
                <img
                  src={
                    addPreFixToMediaUrl(item?.gallery[0]?.url) ||
                    "imgs/no_img.png"
                  }
                  alt={"/imgs/no_img.png"}
                  loading="lazy"
                />
              </div>
              <div className="_item">
                <img
                  src={
                    addPreFixToMediaUrl(item?.gallery[1]?.url) ||
                    "imgs/no_img.png"
                  }
                  alt={"/imgs/no_img.png"}
                  loading="lazy"
                />
              </div>
              <div className="_item">
                <img
                  src={
                    addPreFixToMediaUrl(item?.gallery[2]?.url) ||
                    "imgs/no_img.png"
                  }
                  alt={"/imgs/no_img.png"}
                  loading="lazy"
                />
              </div>
              <div className="_item">
                <img
                  src={
                    addPreFixToMediaUrl(item?.gallery[3]?.url) ||
                    "imgs/no_img.png"
                  }
                  alt={"/imgs/no_img.png"}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
}
export default HomeScreenBottomSection;
