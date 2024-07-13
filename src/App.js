import "./App.css";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./screens/Home";
import Register from "./screens/authentication/Register";
import ForgotPassword from "./screens/authentication/ForgotPassword";
import Todo from "./screens/Todo";
import Product from "./screens/Product";
import ProductInCategory from "./screens/ProductInCategory";
import Profile from "./screens/Profile";
import Cart from "./screens/Cart";
import MyPersonalDetail from "./screens/MyPersonalDetail";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import TermsConditions from "./screens/TermsConditions";
import MyAddresses from "./screens/MyAddresses";
import PageNotFound from "./screens/PageNotFound";
import Search from "./screens/Search";
import { ToastContainer } from "react-toastify";
import Wishlist from "./screens/WishList";
import Observer from "./components/Observer";
import { SOCIAL_LINKS, constRoute } from "./utils/const";
import MyOrders from "./components/my-orders";
import OrderDetails from "./components/my-orders/order-items/order-details/OrderDetail";

import { _getAllCategories } from "./redux/actions/category";
import { getHomeScreenData } from "./https/homeScreenRequests";
import { errorRequestHandel, openWhatsApp, toNumber } from "./utils/helperFile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  checkAppVersion,
  getAllCountryList,
  getBanners,
  getCountryDeliveryTaxes,
  getExchangeRates,
  getSiteContent,
} from "./https/generalRequests";
import {
  _getBanners,
  _getCountriesList,
  _getCountryDeliveryCharges,
  _getCountryDeliveryTaxes,
  _getExchangeRates,
  _getSiteContent,
  _phoneNumberSet,
} from "./redux/actions/generalActions";
import RichTextPage from "./screens/RichTextPage";
import { _setCountry, _toggleOverylay } from "./redux/actions/settingsAction";
import CustomerSupport from "./screens/customer-support/CustomerSupport";
import watsappIcon from "../src/assets/watsappIcon.svg";

import { persistor } from "./store/configureStore";
import { v4 as uuidv4 } from "uuid";
import { listAllCartItems } from "./https/cartRequests";
import { _getAllCartItems } from "./redux/actions/product";
import ResetPasswordViaEmailLink from "./screens/reset-password/ResetPasswordViaEmailLink";
import VerifyEmailAddress from "./screens/verify-email/VerifyEmailAddress";
import { _login } from "./redux/actions/authentication";
import { getUserProfileApi } from "./https/current-user";
import axios from "axios";
import OrderConfirmation from "./screens/order-confirmation/OrderConfirmation";
import AppleAuthentication from "./screens/authentication/AppleAuthentication";

function App() {
  const dispatch = useDispatch();
  const _allCategories = useSelector((state) => state._categories.categories);
  const _siteContent = useSelector((state) => state._categories.categories);
  const hasCalledSiteContentAPI = useRef(false);
  const token = localStorage.getItem("token");
  // const _allCountries = useSelector((state) => state._general.countryList);
  const _allCountries = useSelector((state) => state._general.countryList);

  const [userCurrentLocationData, setUserCurrentLocationData] = useState(null);

  useEffect(() => {
    // Check for authorization code in the URL after redirect

    fetchVersionAndCheck();
    checkReferral();
  }, []);

  const checkReferral = () => {
    const referrer = document.referrer;
    if (referrer.includes("facebook.com")) {
    }
  };

  useEffect(() => {
    if (!hasCalledSiteContentAPI.current) {
      dispatch(_toggleOverylay(false));
      hasCalledSiteContentAPI.current = true;
      if (process.env.REACT_APP_IS_PRODUCTION == "true") {
        // if dev env, dont call api, uae should be selected by default
        getUserPublicIPAddress();
      }
      fetchCategories();
      fetchSiteContent();
      fetchCountryList();
      fetchExchangeRates();
      fetchCountryDeliveryTaxes();
      fetchBanners();
    }
  }, [_allCategories, _siteContent]);

  useEffect(() => {
    if (_allCountries.length > 0) {
      autoSelectUserCountry();
    }
  }, [_allCountries, userCurrentLocationData]);

  const fetchBanners = async () => {
    try {
      const response = await getBanners();
      if (response.status === 200) {
        let formattedData = response.data.data.map((item) => {
          const attributes = item.attributes;
          return {
            identifier: attributes.identifier,
            sorting_number: attributes.sorting_number,
            desktop_image_url: attributes?.desktop_image?.data?.attributes?.url,
            mobile_image_url: attributes?.mobile_image?.data?.attributes?.url,
            mobile_video_url:
              attributes?.mobile_video.data !== null
                ? attributes?.mobile_video?.data?.attributes.url
                : "",
            category_id: attributes?.category?.data?.attributes?.identifier,
          };
        });
        formattedData.sort((a, b) => a.sorting_number - b.sorting_number);
        dispatch(_getBanners(formattedData));
      }
    } catch (error) {
      //errorRequestHandel({ error: error });
    }
  };
  const fetchExchangeRates = async () => {
    try {
      const response = await getExchangeRates();
      if (response.status === 200) {
        const formattedData = response.data.data.map((item) => ({
          fromCurrency: item.from_currency,
          toCurrency: item.to_currency,
          rate: item.rate,
        }));
        dispatch(_getExchangeRates(formattedData));
        // dispatch(_toggleOverylay(false));
      }
    } catch (error) {
      //errorRequestHandel({ error: error });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getHomeScreenData();
      if (response.status === 200) {
        dispatch(_getAllCategories(response.data.data));
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };

  const propertiesToConvert = [
    "pick_n_pack_fee",
    "cod_fee",
    "standard_delivery_fee",
    "same_day_delivery_fee",
    "government_export_tax_percentage",
    "fuel_surcharge_percentage",
    "free_shipping_threshold",
  ];

  const fetchCountryDeliveryTaxes = async () => {
    try {
      const response = await getCountryDeliveryTaxes();
      if (response.status === 200) {
        let formattedData = response.data?.data?.map((item) => {
          // Convert specific properties to numbers or replace null with 0
          propertiesToConvert.forEach((key) => {
            if (
              item.hasOwnProperty(key) &&
              (typeof item[key] === "string" || item[key] === null)
            ) {
              item[key] = toNumber(item[key]);
            }
          });

          return item;
        });

        dispatch(_getCountryDeliveryTaxes(formattedData));
      }
    } catch (error) {
      //errorRequestHandel({ error: error });
    }
  };

  const fetchSiteContent = async () => {
    try {
      const response = await getSiteContent();
      if (response.status === 200) {
        const formattedData = response.data.data.map((item) => ({
          title: item.attributes.title,
          identifier: item.attributes.identifier,
          content: item.attributes.content,
        }));
        dispatch(_getSiteContent(formattedData));
      }
    } catch (error) { }
  };
  const fetchCountryList = async () => {
    try {
      const response = await getAllCountryList();
      if (response.status === 200) {
        dispatch(_getCountriesList(response.data.data));
      }
    } catch (error) { }
  };

  const autoSelectUserCountry = () => {
    const storedCountry = JSON.parse(localStorage.getItem("country")); // Parse the stored country from localStorage
    if (
      storedCountry === null ||
      storedCountry === "" ||
      storedCountry === undefined
    ) {
      const defaultCountry = _allCountries?.find(
        (country) => country.code === (userCurrentLocationData?.country ?? "AE")
      );

      dispatch(_setCountry(defaultCountry));
    } else {
      const defaultCountry = _allCountries?.find(
        (country) => country.id === storedCountry.id
      );
      dispatch(_setCountry(defaultCountry));
    }
  };
  const getUserPublicIPAddress = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      if (response.status === 200) {
        const ipAddress = response?.data?.ip;
        if (ipAddress !== null || ipAddress !== undefined || ipAddress !== "") {
          await getUserCountryFromIP(ipAddress);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const getUserCountryFromIP = async (ipAddress) => {
    try {
      const response = await axios.get(
        `https://ipinfo.io/${ipAddress}?token=39e4f6a8bcefc1`
      );
      if (response.status === 200) {
        setUserCurrentLocationData(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchVersionAndCheck = async () => {
    try {
      const savedVersion = localStorage.getItem("appVersion");
      const response = await checkAppVersion();
      if (response.status === 200) {
        const data = response.data.data;
        if (data) {
          const { app_version, force_reload } = data;
          if (savedVersion !== app_version && force_reload) {
            await clearEverything();
            localStorage.setItem("appVersion", app_version);
          } else {
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching version:", error);
    }
  };

  const clearEverything = async () => {
    try {
      persistor.purge();
      localStorage.clear();
      sessionStorage.clear();

      // Clear IndexedDB
      const databases = await window.indexedDB.databases();
      databases.map((database) => {
        window.indexedDB.deleteDatabase(database.name);
      });

      // Unregister Service Workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        registration.unregister();
      }

      // Clear Cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      window.location.reload(true);
    } catch (error) { }
  };
  useEffect(() => {
    getCartItemsFromServer();
  }, []);

  const getCartItemsFromServer = async () => {
    try {
      const response = await listAllCartItems(token);
      if (response.status === 200) {
        dispatch(_getAllCartItems(response.data.data));
      }
    } catch (error) { }
  };

  return (
    <>
      <ToastContainer />
      <div
        className="floating_watsapp_container"
        onClick={() => openWhatsApp(SOCIAL_LINKS.watsapp)}
      >
        <img src={watsappIcon} />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customer-support" element={<CustomerSupport />} />
        <Route path="/our-story" element={<RichTextPage />} />
        <Route path="/brand-partnerships" element={<RichTextPage />} />
        <Route path="/shipping-and-delivery" element={<RichTextPage />} />
        <Route path="/return-and-exchange" element={<RichTextPage />} />
        <Route path="/faqs" element={<RichTextPage />} />
        <Route path="/cookies-policy" element={<RichTextPage />} />
        <Route path="/terms-conditions" element={<RichTextPage />} />
        <Route path="/privacy-policy" element={<RichTextPage />} />
        <Route path="/contact-us" element={<RichTextPage />} />
        <Route path="/search" element={<Search />} />
        <Route path={constRoute.privacyPolicy} element={<PrivacyPolicy />} />
        <Route
          path={constRoute.termsConditions}
          element={<TermsConditions />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path={constRoute.myOrders} element={<MyOrders />} />
        <Route
          path={`${constRoute.orderDetails}/:id`}
          element={<OrderDetails />}
        />
        <Route path="/my-addresses" element={<MyAddresses />} />
        <Route path="/my-personal-detail" element={<MyPersonalDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-placed" element={<Cart />} />
        <Route path="/categories/:id" element={<ProductInCategory />} />
        <Route path="/wish-list" element={<Wishlist />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/create-account" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/reset-password/:token"
          element={<ResetPasswordViaEmailLink />}
        />
        <Route path="/verify-email/:token" element={<VerifyEmailAddress />} />
        <Route path="/apple-login" element={<AppleAuthentication />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/observer" element={<Observer />} />
        <Route path="*" exact={true} element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
