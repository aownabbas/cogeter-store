import React, { useEffect, useState } from "react";
import SuperMaster from "../layouts/SuperMaster";
import Banner from "../components/banner/Banner";
import { connect, useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../actions/Categories";
import { fetchProducts } from "../actions/Products";
import VideoContainer from "../components/home-components/video-container/VideoContainer";
import HomeScreenBottomSection from "../components/HomeScreenBottomSection";
import Shimmer from "../components/shimer/Shimer";
import ShimmerEffect from "../components/shimer/Shimer";
import HomeScreenShimer from "../components/shimer/home-shimer/HomeScreenShimer";
import Categories from "../components/Categories";
import {
  _getAllCategories,
  _setSelectedCategory,
} from "../redux/actions/category";
import { useNavigate } from "react-router-dom";
import CategoryShimer from "../components/shimer/categories-shimer.js/CategoryShimer";
import HomeScreenTopCategory from "../components/HomeScreenTopCategory";
import { Helmet } from "react-helmet";
import EmailStatus from "../components/resuable/email-status/EmailStatus";
import { formatDecimal, getCurrencyMultiplier } from "../utils/helperFile";
import endPoints from "../https/endPoints";

function Home(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const _allCategories = useSelector((state) => state._categories.categories);
  const user = useSelector((state) => state._auth.user);
  const _banners = useSelector((state) => state._general.banners);
  const selectedCategory = useSelector(
    (state) => state._categories.selectedCategory
  );

  const selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );
  const exchangeRates = useSelector((state) => state._general.exchangeRates);

  const countryDeliveryTaxes = useSelector(
    (state) => state._general.countryDeliveryTaxes
  );

  const _countryDeliveryTaxes = countryDeliveryTaxes?.find(
    (item) => item?.country?.id === selectedCountry?.id
  );

  const [rateMultiplier, setRateMultiplier] = useState(1);
  useEffect(() => {
    setRateMultiplier(
      getCurrencyMultiplier(exchangeRates, selectedCountry?.currency)
    );
  }, [selectedCountry, exchangeRates]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(_setSelectedCategory(""));
    }
  }, []);

  const TOP_CATEGORIES = _allCategories
    .filter(
      (item) => item.show_on_home_screen && item.display_position === "TOP"
    )
    .slice(-3);
  const BOTTOM_CATEGORIES = _allCategories
    .filter(
      (item) => item.show_on_home_screen && item.display_position === "BOTTOM"
    )
    .slice(-1);

  const handelClickOnCategory = (id) => {
    dispatch(_setSelectedCategory(id));
    navigate(`${endPoints.CATEGORIES}/${id}`);
  };

  if (!_allCategories.length) {
    return (
      <SuperMaster>
        <CategoryShimer />
        <HomeScreenShimer />
      </SuperMaster>
    );
  }
  return (
    <SuperMaster>
      <div id="home">
        <Helmet>
          <meta
            charSet="utf-8"
            name="description"
            content="One of the great store in UAE for online shopping, get hight values
            products and much more"
          />
          <meta
            charSet="utf-8"
            name="og:description"
            content="One of the great store in UAE for online shopping, get hight values
            products and much more"
          />
          <meta
            charSet="utf-8"
            // name="og:description"
            property="og:description"
            content="One of the great store in UAE for online shopping, get hight values
            products and much more"
          />
        </Helmet>
        <Categories handelClickOnCategory={handelClickOnCategory} />
        <section className="enable-animation">
          <div className="marquee">
            <p className="marquee__content">
              <span className="_white">SAME DAY DELIVERY DUBAI</span>{" "}
              <span className="_white">
                FREE DELIVERY FOR ORDERS OVER{" "}
                {parseInt(
                  _countryDeliveryTaxes?.free_shipping_threshold *
                  rateMultiplier
                )}{" "}
                {selectedCountry?.currency}
              </span>
              <span className="_yellow">
                10% DISCOUNT ON YOUR FIRST ORDER USE CODE "COGETER"
              </span>
              <span className="_white">NEXT DAY DELIVERY UAE</span>
              <span className="_white">INTERNATIONAL SHIPPING</span>
            </p>
            <p aria-hidden="true" className="marquee__content">
              <span className="_white">SAME DAY DELIVERY DUBAI</span>{" "}
              <span className="_white">
                FREE DELIVERY FOR ORDERS OVER{" "}
                {parseInt(
                  _countryDeliveryTaxes?.free_shipping_threshold *
                  rateMultiplier
                )}{" "}
                {selectedCountry?.currency}
              </span>
              <span className="_yellow">
                10% DISCOUNT ON YOUR FIRST ORDER USE CODE "COGETER"
              </span>
              <span className="_white">NEXT DAY DELIVERY UAE</span>
              <span className="_white">INTERNATIONAL SHIPPING</span>
            </p>
          </div>
        </section>
        {/* {user === null ? null : user?.is_user_varified ? null : <EmailStatus />} */}
        {(user && (user?.confirmed === null || user?.confirmed === false)) && <EmailStatus />}


        {/* show banners if any */}
        {_banners &&
          _banners.length > 0 &&
          _banners.map((banner, index) => {
            return <Banner banner={banner} key={index} />;
          })}

        {TOP_CATEGORIES &&
          TOP_CATEGORIES.length > 0 &&
          TOP_CATEGORIES.map((product, index) => {
            return <HomeScreenTopCategory key={index} {...product} />;
          })}

        <div>
          <VideoContainer />
        </div>

        {BOTTOM_CATEGORIES && BOTTOM_CATEGORIES.length > 0 && (
          <HomeScreenBottomSection bottomCategories={BOTTOM_CATEGORIES} />
        )}
      </div>
    </SuperMaster>
  );
}
const mapStateToProps = (state) => {
  return {
    categories: state.categories,
    products: state.products,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getRequestToCategories: () => dispatch(fetchCategories()),
    getRequestToProducts: () => dispatch(fetchProducts()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
