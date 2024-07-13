import React, { Children, useCallback, useState, useEffect } from "react";
import Footer from "../components/Footer";
import SuperHeader from "../components/SuperHeader";
import Categories from "../components/Categories";
import { Button, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style.css";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../actions/Search";
import { useNavigate } from "react-router-dom";
import { isUserLoggedIn } from "../helpers/Index";
import SearchModal from "../components/SearchModal";
import { fetchProducts } from "../actions/Products";
import Search from "../screens/Search";
import { _toggleOverylay } from "../redux/actions/settingsAction";

function SuperMaster({ children, hasFooter, hideHeader = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [productIds, setProductIds] = useState([]);
  // const dispatchProductsAction = useCallback(() => {
  //     const action = fetchProducts();
  //     dispatch(action);
  // }, [dispatch]);
  const fetch_products = useSelector((state) => state.products);
  // useEffect(() => {
  //     dispatchProductsAction();
  // }, [dispatchProductsAction, dispatch]);

  const { payload, status } = fetch_products;
  const data = payload?.data?.data;
  const searchProductsOnQuery = (e) => {
    let filterProducts = [];
    if (data) {
      filterProducts = data.filter((item) => {
        let name = item?.attributes?.name;
        let description = item?.attributes?.description;
        name = name ? name : "";
        description = description ? description : "";
        return (
          name?.toLowerCase().indexOf(search?.toLowerCase()) != -1 ||
          description?.toLowerCase().indexOf(search?.toLowerCase()) != -1
        );
      });
      const productIds = filterProducts.map((item) => item.id);
      setProductIds(productIds);
    }
    if (e.key == "Enter") {
      setSearch("");
      navigate(`/search?products=${JSON.stringify(productIds)}`);
    }
  };

  const routes = [
    "/cart",
    "/profile",
    "/my-purchases",
    "/my-personal-detail",
    "/about-us",
    "/my-addresses",
    "/privacy-policy",
    "/404",
    "/terms-conditions",
    "/search",
  ];

  const isFooterShow = ["/404"];
  const location = useLocation();
  // const categories = !routes.includes(location.pathname) ? <Categories /> : "";
  const footer = !isFooterShow.includes(location.pathname) ? <Footer /> : "";
  const pathName = location.pathname;

  const overlayEnabled = useSelector((state) => state._settings.overlayEnabled);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Update the isMobile state based on the screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // You can adjust the threshold for mobile screens
    };

    // Initial call to set the initial value
    handleResize();

    // Attach the resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Rest of your component code...

  return (
    <div
      className={`master__div ${
        !isMobile && overlayEnabled ? "master__div__overlay_disabled" : ""
      }`}
    >
      <div
        className={!isMobile && overlayEnabled ? "master__div__overlay" : ""}
      />

      <SearchModal />
      <div className="_mainContent">
        {!hideHeader && <SuperHeader />}
        {pathName != "/search" ? (
          <div className="_searchInputOnSearchPage px-3 _hidden">
            {search && productIds.length == 0 ? (
              <div className="_notFoundText">
                <p>Product not found</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}

        {pathName == "/" || pathName == "/search" ? (
          <>{children}</>
        ) : (
          <Container
            style={{
              minWidth: "95%",
              height: "auto",
              margin: "auto",
              paddingTop: 20,
              minHeight: "40vh",
            }}
          >
            {children}
          </Container>
        )}

        {(isMobile && hasFooter) || hasFooter ? null : footer}
      </div>
    </div>
  );
}
export default SuperMaster;
