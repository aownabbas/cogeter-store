import React, { useState, useRef, useEffect } from "react";
import { Col, Row, Form, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CartModal from "./CartModal";
import LoginModal from "./LoginModal";
import LeftSideBarModal from "./LeftSideBarModal";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../actions/Search";
import {
  toggleMoveToTopButtonWhenPageScroll,
  moveToTop,
  LazyImage,
  isUserLoggedIn,
} from "../helpers/Index";
import UseOnClickOutside from "./useOnClickOutside";
import { authProfile } from "../helpers/Index";
import WishListModal from "./WishListModal";
import "react-country-dropdown/dist/index.css";
// import { ReactDropDownComponent } from "./ReactDropDownComponent";
import {
  _ToggleCartModal,
  _getAllCartItems,
  _onCartItemsFaulure,
  _onCartItemsSuccess,
} from "../redux/actions/product";
import { _setCountryItem } from "../redux/actions/generalActions";
import {
  _setCountry,
  _toggleLoginModal,
  _toggleOverylay,
} from "../redux/actions/settingsAction";
import ArrowUp from "../assets/icons/arrow-down.svg";
import useWindowSize from "../utils/hooks/useWindowSize";
import { listAllCartItems } from "../https/cartRequests";

function SuperHeader() {
  const { width } = useWindowSize();
  const _countryList = useSelector((state) => state._general.countryList);
  const selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );
  const _allCategories = useSelector((state) => state._categories.categories);
  const _cartItems = useSelector((state) => state._products.cartItems);

  const [openSearchModal, setOpenSearchModal] = useState(true);
  const [toggleMobile, setToggleMobile] = useState(false);
  const [wishListModel, setWishListModel] = useState(false);
  const [countryList, setCountryList] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [userDetail, setUserDetail] = useState([]);
  const [search, setSearch] = useState("");
  const [cartModal, setCartModal] = useState(false);
  const [sideBarModal, setSideBarModal] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const sideBarRef = useRef();
  const mobileMenuRef = useRef();

  const Image = (src) => {
    return LazyImage(<img src={src} />);
  };

  const searchValue = useSelector((state) => state.search);
  const openLoginModal = () => {
    // setLoginModal(true);
    dispatch(_toggleOverylay(true));
    dispatch(_toggleLoginModal(true));
  };
  const openCartModal = () => {
    setCartModal(true);
  };
  const openSidebarModal = () => {
    setSideBarModal((prevCheck) => !prevCheck);
  };

  // UseOnClickOutside(sideBarRef, () => setSideBarModal(false));
  // UseOnClickOutside(mobileMenuRef, () => setToggleMobile(false));
  useEffect(() => {
    window.addEventListener("scroll", toggleMoveToTopButtonWhenPageScroll);
    document
      .querySelector("._searchBar")
      ?.addEventListener("click", openSearchBarModal);
    document
      .querySelector("._closeSearchModal")
      ?.addEventListener("click", closeSearchBarModal);
    window.addEventListener("load", setCountryCodeDropDown);
    var moveToTop = document.querySelector("._moveToTop");
    moveToTop.style.opacity = "0"; // Hide the element

    return () => {
      window.removeEventListener("scroll", toggleMoveToTopButtonWhenPageScroll);
      document
        .querySelector("._searchBar")
        ?.removeEventListener("click", openSearchBarModal);
      document
        .querySelector("._closeSearchModal")
        ?.removeEventListener("click", closeSearchBarModal);
      window.removeEventListener("load", setCountryCodeDropDown);
    };
  }, []);
  const setCountryCodeDropDown = () => { };
  useEffect(() => {
    let country = localStorage.getItem("country");
    country = country ? JSON.parse(country) : "AE";
    setCountryCode(country?.code);
  }, [countryCode, selectedCountry]);
  // const searchProductsOnQuery = (e) => {
  //     if (e.key == "Enter") {
  //         const inputValue = e.target.value;
  //         dispatch(searchProducts(inputValue));
  //         navigate("/search");
  //     }
  // }
  const isLoggedIn = useSelector((state) => state._auth.isAuthenticated);

  const openSearchBarModal = () => {
    setOpenSearchModal(true);
    document.querySelector("._mainContent").classList.add("_hidden");
    document.querySelector("._searchModal").classList.remove("_hidden");
  };
  const closeSearchBarModal = () => {
    setOpenSearchModal(true);
    document.querySelector("._mainContent").classList.remove("_hidden");
    document.querySelector("._searchModal").classList.add("_hidden");
  };
  const toggleMobileMenu = () => {
    const dropDownMenu = document.querySelector("._dropDownMenu");
    if (dropDownMenu.classList.contains("_hide")) {
      setToggleMobile(true);
    } else {
      setToggleMobile(false);
    }
  };
  useEffect(() => {
    let logo = document.querySelector("#logo > span[data-toggler='toggler']");
    let leftSideBarModal = document.querySelector(
      "._leftSideBarModal .fa.fa-times-circle-o,._leftSideBarModal ul li "
    );
    if (leftSideBarModal) {
      leftSideBarModal.addEventListener("click", closeLeftSideBarModal);
    }
    if (logo) {
      logo.addEventListener("click", showLeftSideBarModal);
    }

    return () => {
      if (leftSideBarModal) {
        leftSideBarModal.removeEventListener("click", closeLeftSideBarModal);
      }
      if (logo) {
        logo.removeEventListener("click", showLeftSideBarModal);
      }
    };
  });
  const closeLeftSideBarModal = () => {
    // let leftSideBarModal = document.querySelector("._leftSideBarModal");
    // leftSideBarModal.classList.add("_hidden");
    setSideBarModal(true);
  };
  const showLeftSideBarModal = () => {
    // let leftSideBarModal = document.querySelector("._leftSideBarModal");
    setSideBarModal(false);
    // leftSideBarModal.classList.remove("_hidden");
  };
  const handleSelect = (country) => {
    setCountryCode(country?.code);
    localStorage.setItem("country", JSON.stringify(country));
  };

  const getCartItemsFromServer = async () => {
    try {
      dispatch(_onCartItemsSuccess());
      const response = await listAllCartItems(isLoggedIn);
      if (response.status === 200) {
        dispatch(_getAllCartItems(response.data.data));
        dispatch(_onCartItemsFaulure());
      }
    } catch (error) {
      dispatch(_onCartItemsFaulure());
    }
  };

  const countryListRef = useRef(null);
  useEffect(() => {
    // Add an event listener to the document click event
    const handleOutsideClick = (event) => {
      if (
        countryListRef.current &&
        !countryListRef.current.contains(event.target)
      ) {
        // Clicked outside the country list, so close it
        setCountryList(false);
      }
    };

    // Attach the event listener when the dropdown is open
    if (countryList) {
      document.addEventListener("click", handleOutsideClick);
    }

    // Clean up the event listener when the component unmounts or when the dropdown is closed
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [countryList]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = _countryList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="_moveToTop _hide">
        {_allCategories?.length > 0 && (
          <img onClick={() => moveToTop()} src={ArrowUp} alt="scrollToTop" />
        )}
      </div>
      <header>
        {/* <Container fluid={true}> */}
        <div className="_headerContainer">
          <div id="logo">
            <span
              onClick={() => {
                dispatch(_toggleOverylay(true));
                openSidebarModal();
              }}
              data-toggler="toggler"
              className="_icon"
            >
              <img
                style={{ cursor: "pointer" }}
                data-toggler="toggler"
                src={process.env.PUBLIC_URL + "/imgs/toggler.svg"}
                alt="toggleSidebar"
              />
            </span>
            <img
              onClick={() => {
                window.location.href = "/";
              }}
              src={process.env.PUBLIC_URL + "/imgs/logo.svg"}
              alt="logo"
            />
          </div>

          <div className="_topHeaderMenuIcons" ref={countryListRef}>
            <ul className="_headerMenu">
              <li>
                <Link to={"#"} onClick={() => setCountryList(!countryList)}>
                  <span className="_icon">
                    <img src={selectedCountry?.icon} alt="" />
                  </span>
                </Link>
              </li>
              <span className="header__devider">|</span>
              {countryList && (
                <div className="header_countrylist__container">
                  <div className="header_countrylist__search">
                    <input
                      placeholder="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {filteredCountries.map((item, index) => {
                    return (
                      <div
                        className="header_countrylist__items"
                        key={index}
                        onClick={() => {
                          setCountryList(false);
                          dispatch(_setCountry(item));
                          localStorage.setItem("country", JSON.stringify(item));
                        }}
                      >
                        <div className="header_countrylist__items_icon">
                          <img src={item.icon} alt="country-flag" />
                        </div>
                        <div className="header_countrylist__items_title">
                          <p>
                            {item.name} {`( ${item.currency} )`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <li>
                <Link className="_searchBar">
                  <span className="_icon">
                    <img
                      src={process.env.PUBLIC_URL + "/imgs/search.svg"}
                      alt="search"
                    />
                  </span>{" "}
                  {/* <span className="_hide"></span> */}
                </Link>
              </li>
              {width > 768 ? (
                isLoggedIn ? (
                  <li>
                    <Link to={"/profile"}>
                      <span className="_icon">
                        {" "}
                        <img
                          src={process.env.PUBLIC_URL + "/imgs/user.svg"}
                          alt="profile"
                        />{" "}
                      </span>{" "}
                      <span className="_hide">
                        {/* {userDetail?.username ? userDetail?.username : "NO Name"} */}
                      </span>
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link to={"#"} onClick={openLoginModal}>
                      <span className="_icon">
                        {" "}
                        <img
                          src={process.env.PUBLIC_URL + "/imgs/user.svg"}
                          alt="profile"
                        />{" "}
                      </span>{" "}
                      {/* <span className="_hide">SIGN IN</span> */}
                    </Link>
                  </li>
                )
              ) : (
                <></>
              )}
              {isLoggedIn && (
                <li className="_hide_on_mobile">
                  <Link to={"/wish-list"}>
                    <span className="_icon">
                      {" "}
                      <img
                        src={process.env.PUBLIC_URL + "/heart.svg"}
                        alt="wishlist"
                      />{" "}
                    </span>{" "}
                  </Link>
                </li>
              )}
              <li
                className="custom__badge_container"
                onClick={() => {
                  getCartItemsFromServer();
                  dispatch(_ToggleCartModal(true));
                  dispatch(_toggleOverylay(true));
                }}
              >
                {_cartItems && _cartItems?.length > 0 && (
                  <div className="custom_badge">
                    <span>{_cartItems.length}</span>
                  </div>
                )}
                <Link>
                  <span className="_icon">
                    <img
                      src={process.env.PUBLIC_URL + "/imgs/cart.svg"}
                      alt="cart"
                    />
                  </span>{" "}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* </Container> */}
      </header>
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />
      <CartModal cartModal={cartModal} setCartModal={setCartModal} />
      <LeftSideBarModal
        sideBarModal={sideBarModal}
        setSideBarModal={setSideBarModal}
        sideBarRef={sideBarRef}
      />
      <WishListModal
        wishListModel={wishListModel}
        setWishListModel={setWishListModel}
      />
    </>
  );
}
export default SuperHeader;
