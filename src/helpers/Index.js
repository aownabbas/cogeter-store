import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Circles } from "react-loader-spinner";
import jwt_decode from "jwt-decode";
import { fetchCartItems, fetchWishList } from "../actions/Cart";
import { EMPTY_NULL_DATA } from "../utils/const";
import { formatDecimal } from "../utils/helperFile";

const ASSET_URL = process.env.REACT_APP_BACKEND_ASSETS_URL;

function removeActiveClassFromAllElementAndSetBackToCurrentElement(
  e,
  firstEl,
  secondEl,
  thirdEl,
  fourthEl
) {
  firstEl.classList.remove("_hidden");
  secondEl.classList.remove("_hidden");
  thirdEl.classList.remove("_hidden");
  fourthEl.classList.remove("_hidden");

  firstEl.classList.remove("_active");
  secondEl.classList.add("_hidden");
  thirdEl.classList.add("_hidden");
  fourthEl.classList.add("_hidden");
  document
    .querySelectorAll("#pageLinks ul li")
    .forEach((el) => el.firstChild.classList.remove("_active"));
  e.target.setAttribute("class", "_active");
}

// export const makeTheCurrentPageActive = (e) => {
//   const cartContent = document.querySelector("._cartContent");
//   const deliveryContent = document.querySelector("._deliveryContent");
//   const paymentContent = document.querySelector("._paymentContent");
//   const confirmationContent = document.querySelector("._confirmationContent");
//   if (e.target.tagName == "A") {
//     if (e.target.textContent === "Cart") {
//       pushStateToUrl("");
//       removeActiveClassFromAllElementAndSetBackToCurrentElement(
//         e,
//         cartContent,
//         deliveryContent,
//         paymentContent,
//         confirmationContent
//       );
//     } else if (e.target.textContent === "Delivery") {
//       pushStateToUrl("address");
//       removeActiveClassFromAllElementAndSetBackToCurrentElement(
//         e,
//         deliveryContent,
//         cartContent,
//         paymentContent,
//         confirmationContent
//       );
//     } else if (e.target.textContent === "Payment") {
//       pushStateToUrl("payment");
//       removeActiveClassFromAllElementAndSetBackToCurrentElement(
//         e,
//         paymentContent,
//         deliveryContent,
//         cartContent,
//         confirmationContent
//       );
//     } else if (e.target.textContent === "Confirmation") {
//       removeActiveClassFromAllElementAndSetBackToCurrentElement(
//         e,
//         confirmationContent,
//         paymentContent,
//         deliveryContent,
//         cartContent
//       );
//       pushStateToUrl("confirmation");
//     }
//   }
// };

export const toggleCartMenuItem = (e) => {
  const cartMenu = document.querySelectorAll("._leftPanel ._header ._text h3");
  cartMenu.forEach((el) => el.removeAttribute("class"));
  const bar = document.querySelectorAll("._leftPanel ._header ._bar span");
  bar.forEach((el) => el.removeAttribute("class"));
  const currentItemText = e.target.getAttribute("data-menu-item");
  const barItemText = document.querySelectorAll(
    "._leftPanel ._header ._bar span"
  );
  barItemText.forEach((el) => {
    var elementText = el.getAttribute("bar-item-text");
    if (elementText == currentItemText) {
      el.setAttribute("class", "_active");
      return;
    }
  });
  e.target.setAttribute("class", "_active");
  const dataMenuItem = e.target.getAttribute("data-menu-item");
  const favElement = document.querySelector("._favoriteItem");
  const cartElement = document.querySelector("._cartItem");
  if (dataMenuItem == "favorite") {
    favElement.classList.remove("_hidden");
    cartElement.classList.add("_hidden");
  } else {
    favElement.classList.add("_hidden");
    cartElement.classList.remove("_hidden");
  }
};

export const addAddress = () => {
  const pageLinks = document.querySelector("#pageLinks");
  const content = document.querySelector("#content");
  // const categories = document.querySelector("#categories");
  const address = document.querySelector("#address");
  content.classList.add("_hidden");
  pageLinks.classList.add("_hidden");
  // categories.classList.add("_hidden");
  address.classList.remove("_hidden");
};

export const goBack = () => {
  const pageLinks = document.querySelector("#pageLinks");
  const content = document.querySelector("#content");
  // const categories = document.querySelector("#categories");
  const address = document.querySelector("#address");
  content.classList.remove("_hidden");
  pageLinks.classList.remove("_hidden");
  // categories.classList.remove("_hidden");
  address.classList.add("_hidden");
};

// Cart Page End

//MoveToTop Event
export const moveToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
export const toggleMoveToTopButtonWhenPageScroll = () => {
  var moveToTop = document.querySelector("._moveToTop");
  var windowBottom = window.innerHeight + window.pageYOffset;
  if (windowBottom >= document.body.offsetHeight) {
    moveToTop.style.opacity = "1"; // Show the element
  } else {
    moveToTop.style.opacity = "0"; // Hide the element
  }
};

//Product page

export const changeProductVariety = (e) => {
  const currentElement = e.target;
  const tagName = currentElement.tagName;
  if (tagName == "IMG") {
    const productItems = document.querySelector(
      "#productsContainer > ._leftPanel > div._item"
    );
    const productImg = productItems.querySelector("img");
    productImg.setAttribute("src", currentElement.getAttribute("src"));
    const leftPanelItems = document.querySelector(
      "#productsContainer  #items"
    ).children;
    for (let i = 0; i < leftPanelItems.length; i++) {
      leftPanelItems[i].removeAttribute("style");
    }
    if (currentElement?.getAttribute("data-img") == "true") {
      currentElement.parentNode.style.border = "3px solid #6c5ffc";
    }
  }
}; //change product color
export const changeProductSizes = (e) => {
  const currentElement = e.target;
  const tagName = currentElement.tagName;
  if (tagName == "BUTTON") {
    const currentElementSize = currentElement.getAttribute("data-size");
    const productItems = document.querySelector(
      "#productsContainer > ._leftPanel > div._item"
    );
    const productImg = productItems.querySelector("img");
    productImg.setAttribute("src", currentElementSize);
    const currentElementChildren = currentElement.parentNode?.children;
    for (let i = 0; i < currentElementChildren.length; i++) {
      currentElementChildren[i].classList.remove("_active");
    }
    currentElement.classList.add("_active");
  }
}; //change product size

//Product Page end

export const loader = () => {
  return (
    <Circles
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="circles-loading"
      wrapperStyle={{}}
      wrapperclass=""
      visible={true}
    />
  );
};

export const LazyImage = (content) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const placeholderRef = useRef(null);

  useEffect(() => {
    if (!shouldLoad && placeholderRef.current) {
      const observer = new IntersectionObserver(([{ intersectionRatio }]) => {
        if (intersectionRatio > 0) {
          setShouldLoad(true);
        }
      });
      observer.observe(placeholderRef.current);
      return () => observer.disconnect();
    }
  }, [shouldLoad, placeholderRef]);
  return shouldLoad ? (
    content
  ) : (
    <span className="_pageLoader" ref={placeholderRef}>
      {loader()}
    </span>
  );
};

// export const animateElegantSlider = (e) => {
//   const sliderContainer = e.currentTarget;
//   const items = sliderContainer.querySelectorAll("._item");
//   for (var i = 0; i < items.length; i++) {
//     items[i].className = "_item _fold";
//   }
//   const currentElement = e.target.parentNode;
//   currentElement.className = "_item _explode";
// };

export const postReq = async (endpoint, payload) => {
  return await client.post(endpoint, payload);
};
export const putReq = async (endpoint, payload) => {
  return await client.put(endpoint, payload);
};

export const getReq = async (endpoint) => await client.get(endpoint);

export const isUserLoggedIn = () => {
  const token = localStorage.getItem("isUserLoggedInToken");
  if (
    token == "undefined" ||
    token == undefined ||
    token == null ||
    token == "false" ||
    token == false
  ) {
    return false;
  } else if (
    token != "undefined" &&
    token != undefined &&
    token != null &&
    token != "false" &&
    token != false
  ) {
    return true;
  }
};
export const myToken = () => {
  const token = localStorage.getItem("isUserLoggedInToken");
  if (
    token != "undefined" &&
    token != undefined &&
    token != null &&
    token != "false" &&
    token != false
  ) {
    const decode = token != "false" ? jwt_decode(token) : "false";
    return decode;
  }
  return "NO TOKEN";
};

export const authProfile = () => {
  const token = localStorage.getItem("isUserLoggedInToken");
  if (
    token != "undefined" &&
    token != undefined &&
    token != null &&
    token != "false" &&
    token != false
  ) {
    const user = localStorage.getItem("user");
    return JSON.parse(user);
  }
  return [];
};

const client = axios.create({
  // baseURL: "http://localhost:1337/api",
  baseURL: process.env.REACT_APP_BASE_URL,
  // baseURL: "https://store-api.cogeter.com/api",

  // headers: {
  //     Authorization: `Bearer ${myToken()}`,
  //     "Content-Type": "application/json",
  // },
});

export const serverResponse = (server, configuration) => {
  // else if (component == "loggedOut") {
  //     toast.success(user_message);
  //     configuration?.navigate("/");
  // } else if (component == "isForgotPassword") {
  //     toast.success(user_message);
  //     configuration?.setForgotPasswordModal(false);
  //     configuration?.setResetPasswordModal(true);
  // } else if (component == "resetPassword") {
  //     configuration?.navigate("/?isOpenLoginModal=true");
  //     toast.success(user_message);
  //     configuration?.setResetPasswordModal(false);
  // }
};
export const getParams = (queryString) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(queryString);
};

let cartItems = localStorage.getItem("cartItems");
let wishListItems = localStorage.getItem("wishListItems");
cartItems = JSON.parse(cartItems);
wishListItems = JSON.parse(wishListItems);

// export const pushStateToUrl = (page) => {
//   const currentLocation = window.location.href;
//   const url = new URL(currentLocation);
//   url.searchParams.set("page", page);
//   window.history.pushState({}, "", url);
// };
export const formatOrder = (inputDate) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateObj = new Date(inputDate);
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
};

export const formatDeliveryDate = (inputDate) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const deliveryDate = new Date(inputDate);

  // Calculate the estimated delivery dates
  const deliveryStartDate = new Date(deliveryDate);
  deliveryStartDate.setDate(deliveryStartDate.getDate() + 5); // Add 5 days for the start of the delivery range
  const deliveryEndDate = new Date(deliveryDate);
  deliveryEndDate.setDate(deliveryEndDate.getDate() + 7); // Add 7 days for the end of the delivery range

  // Format the dates
  const deliveryStartFormatted = `${daysOfWeek[deliveryStartDate.getDay()]}, ${months[deliveryStartDate.getMonth()]
    } ${deliveryStartDate.getDate()}`;
  const deliveryEndFormatted = `${daysOfWeek[deliveryEndDate.getDay()]}, ${months[deliveryEndDate.getMonth()]
    } ${deliveryEndDate.getDate()}`;

  return `Est. Delivery: ${deliveryStartFormatted} - ${deliveryEndFormatted}`;
};

export const makeProductFavorite = (data) => {
  data.dispatch(data.isProductFavorite(data));
  data.dispatch(data.fetchCategories());
  data.dispatch(data.fetchProducts());

  if (data?.is_favorite != 1) {
    let wishListItems = localStorage.getItem("wishListItems");
    wishListItems = wishListItems ? JSON.parse(wishListItems) : [];
    wishListItems = wishListItems?.filter(
      (item) => parseInt(item?.product_id) != parseInt(data?.product_id)
    );
    localStorage.setItem("wishListItems", JSON.stringify(wishListItems));
  }
  data.setWishListModel(true);
};

// export const productFooter = (
//   product_colors,
//   variant_images,
//   product_name,
//   product_sale,
//   product_sale_price,
//   product_price,
//   addToWishListWrapper,
//   isFavorite,
//   product_id,
//   dispatch,
//   isProductFavorite,
//   fetchCategories,
//   setWishListModel,
//   isWishList,
//   fetchProducts
// ) => {
//   return (
//     <div className="_footer">
//       <div className="_varieties">
//         <div>
//           {product_colors?.data?.length > 0 &&
//             product_colors?.data.map((color, index) => {
//               let product_url =
//                 variant_images != null
//                   ? ASSET_URL + variant_images[index]?.attributes?.url
//                   : "/imgs/no_img.png";
//               let name = (color?.attributes?.name).toLowerCase();
//               let id = color?.id;
//               return (
//                 <span
//                   style={{ backgroundColor: name }}
//                   data-color_id={id}
//                   onClick={changeImageVariety}
//                   data-imgurl={product_url}
//                   data-color={name}
//                   className="_color  _active"
//                 ></span>
//               );
//             })}
//         </div>
//       </div>
//       <div className="product_title__and_wishlist">
//         <Link to={"/"}>{product_name}</Link>
//         {!isWishList && (
//           <div className="_footerIcons" onClick={addToWishListWrapper}>
//             {isFavorite ? (
//               <>
//                 <img
//                   onClick={() =>
//                     makeProductFavorite({
//                       product_id,
//                       is_favorite: 0,
//                       dispatch,
//                       isProductFavorite,
//                       fetchCategories,
//                       setWishListModel,
//                       fetchProducts,
//                     })
//                   }
//                   src={"/favorite.svg"}
//                   alt={"/imgs/no_img.png"}
//                   data-productid={product_id}
//                   data-is_favorite="0"
//                   data-add="addToWishList"
//                   loading="lazy"
//                 />
//               </>
//             ) : (
//               <img
//                 onClick={() =>
//                   makeProductFavorite({
//                     product_id,
//                     is_favorite: 1,
//                     dispatch,
//                     isProductFavorite,
//                     fetchCategories,
//                     setWishListModel,
//                     fetchProducts,
//                   })
//                 }
//                 src={"/heart.svg"}
//                 alt={"/imgs/no_img.png"}
//                 data-productid={product_id}
//                 data-is_favorite="1"
//                 data-add="addToWishList"
//                 loading="lazy"
//               />
//             )}
//           </div>
//         )}
//       </div>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           width: "100%",
//           height: "40px",
//         }}
//       >
//         <span>
//           {isSaleProduct(product_sale, product_sale_price, product_price)}
//         </span>
//         {product_sale && (
//           <div className="product_sale__container">
//             <p>
//               {calculateDiscountPercentage(
//                 product_sale_price,
//                 product_price,
//                 product_sale
//               )}
//               % OFF
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
export const addToWishList = (e, request) => {
  let props = request.props;
  let category_id = request.params?.id;
  request.setWishListModel(false);
  request.setCartModal(false);
  if (Object.keys(props).length) {
    props?.setFilterModal(false);
  }
  const addToCart = e.target.getAttribute("data-add");
  const product_id = e.target.getAttribute("data-productid");
  let categories = request.fetch_categories?.payload?.data?.data;
  let category = categories?.filter(
    (item) => parseInt(item?.id) == parseInt(category_id)
  );
  let selected_products = [];
  let variant_id = "";
  let variant_size = "";
  let isFavorite = true;
  if (category?.length > 0) {
    selected_products = category[0]?.attributes?.products?.data;
    let product = selected_products?.filter(
      (item) => parseInt(item?.id) == parseInt(product_id)
    );
    if (product?.length > 0) {
      isFavorite = product[0]?.attributes?.isFavorite;
      variant_id = product[0]?.attributes?.varients?.data[0]?.id;
      variant_size =
        product[0]?.attributes?.varients?.data[0]?.attributes?.size;
    }
  }
  if (addToCart == "addToWishList") {
    request.dispatch(
      request.addToCartItemAction({
        product_id,
        modal: "wishlist",
        variant: variant_size,
        variant_id: variant_id,
        isFavorite: isFavorite ? 0 : 1,
      })
    );
    request.dispatch(fetchWishList());
  } else if (addToCart == "addToCart") {
    request.dispatch(
      request.addToCartItemAction({
        product_id,
        modal: "wishlist",
        variant: variant_size,
        variant_id: variant_id,
        isFavorite: isFavorite ? 0 : 1,
      })
    );
    request.dispatch(fetchWishList());
  }

  request.dispatch(fetchWishList());
  e.target.style.color = "#7386fb";
  request.setWishListModel(true);
};

export const zoomIn = (e) => {
  if (e) {
    var zoomer = e.currentTarget;
    let currentElement = e.target;
    let offsetX = e.nativeEvent.offsetX
      ? e.nativeEvent.offsetX
      : e.nativeEvent.offsetX;
    let offsetY = e.nativeEvent.offsetY
      ? e.nativeEvent.offsetY
      : e.nativeEvent.offsetY;
    let x = (offsetX / zoomer.offsetWidth) * 100;
    let y = (offsetY / zoomer.offsetHeight) * 100;
    zoomer.style.backgroundPosition = x + "% " + y + "%";
    if (currentElement) {
      currentElement.parentNode.parentNode.querySelector(
        "._clothSizes"
      ).style.transition = ".4s";
      currentElement.parentNode.parentNode.querySelector(
        "._clothSizes"
      ).style.opacity = ".6";
    }
  }
};
export const hideClothSizes = (e) => {
  let targetElement = e.target;
  if (targetElement) {
    targetElement.parentNode.parentNode.querySelector(
      "._clothSizes"
    ).style.opacity = "0";
  }
};

export const productSizes = (
  product_variants,
  addItemToCartWithVariety,
  other
) => {
  let color = "";
  let color_id = "";
  let product_colors = other?.product_colors;
  let product_id = other?.product_id;
  return (
    <div className="_clothSizes">
      {product_variants.length > 0 &&
        product_variants.map((variant, index) => {
          let size = variant?.size;
          let variant_id = variant?.id;
          if (index == 0) {
            color = product_colors?.data[0]?.attributes?.name;
            color_id = product_colors?.data[0]?.id;
          }
          let variant_url =
            ASSET_URL + (variant?.attributes?.image?.data != null) > 0
              ? variant?.attributes?.image?.data[0]?.attributes?.url
              : "/imgs/no_img.png";
          return (
            <span
              onClick={(e) =>
                addItemToCartWithVariety(e, {
                  size,
                  variant_id,
                  product_id,
                })
              }
              data-productid={product_id}
              data-add="addToCart"
              data-color_id={color_id}
              data-color={color}
              data-imgurl={variant_url}
            >
              {size}
            </span>
          );
        })}
    </div>
  );
};

// export const singleProduct = (
//   listProducts,
//   addToWishList,
//   makeProductFavorite,
//   addItemToCartWithVariety,
//   backgroundPosition,
//   isWishList = false
// ) => {};

export const addItemToCartWithVariety = (
  e,
  data,
  props,
  dispatch,
  fetchProducts,
  _cartItems,
  setCartModal
) => {
  let currentElement = e.target;
  let color = currentElement.getAttribute("data-color");
  let color_id = currentElement.getAttribute("data-color_id");
  let cartItems = localStorage.getItem("cartItems");
  cartItems = cartItems ? JSON.parse(cartItems) : [];
  let isProductExist = cartItems?.filter(
    (item) => parseInt(item?.product_id) == parseInt(data?.product_id)
  );
  let updatedArray = [];
  if (isProductExist?.length == 0) {
    updatedArray = [
      ...cartItems,
      {
        product_id: data?.product_id,
        qty: 1,
        variant: data?.size,
        variant_id: data?.variant_id,
        color,
        color_id,
      },
    ];
    localStorage.setItem("cartItems", JSON.stringify(updatedArray));
  } else {
    isProductExist[0]["variant_id"] = data?.variant_id;
    isProductExist[0]["variant"] = data?.size;
    isProductExist[0]["color"] = color;
    isProductExist[0]["color_id"] = color_id;
    isProductExist = isProductExist[0];
    let notMatchProducts = cartItems?.filter(
      (item) => parseInt(item?.product_id) != parseInt(data?.product_id)
    );
    updatedArray = [...notMatchProducts, isProductExist];
    localStorage.setItem("cartItems", JSON.stringify(updatedArray));
  }
  let user = localStorage.getItem("user");
  user = user ? JSON.parse(user).id : "";
  let record = {
    product: data?.product_id,
    variant: data?.size?.toUpperCase(),
    variant_id: data?.variant_id,
    color: color,
    color_id: color_id,
    user_id: user,
    qty: "1",
  };
  let isProductExistInDb = _cartItems?.find(
    (item) =>
      item?.attributes?.product?.data?.id == data?.product_id &&
      item?.attributes?.user_id?.data?.id == user
  );
  if (isProductExistInDb) {
    props.putReqCartItems(isProductExistInDb?.id, record);
    props.getReqCartItems();
  } else {
    props.postReqCartItems(record);
    props.getReqCartItems();
  }
  setCartModal(true);
  dispatch(fetchCartItems());
  dispatch(fetchProducts());
};

export const changeImageVariety = (e) => {
  const currentElement = e.target;

  const itemElement =
    currentElement.parentNode?.parentNode?.parentNode.parentNode;
  var items = itemElement.querySelectorAll("._varieties > div:first-child");
  items.forEach(function (selectedItem) {
    var children = selectedItem.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      child.classList.remove("_active");
    }
  });
  let color = currentElement.getAttribute("data-color");
  let color_id = currentElement.getAttribute("data-color_id");
  let varieties = itemElement.querySelectorAll("._clothSizes span");
  for (let i = 0; i < varieties.length; i++) {
    varieties[i].setAttribute("data-color", color);
    varieties[i].setAttribute("data-color_id", color_id);
  }
  const tagName = currentElement.tagName;
  if (tagName == "SPAN") {
    const imgSource = currentElement.getAttribute("data-imgurl");
    const clothSizes = currentElement.getAttribute("data-size");
    if (clothSizes && clothSizes == "true") {
      itemElement.querySelector("figure img").setAttribute("src", imgSource);
    } else {
      currentElement.classList.add("_active");
      const figure = itemElement.querySelector("figure");
      const img = itemElement.querySelector("figure img");
      figure.style.backgroundImage = `url(${imgSource})`;
      img.setAttribute("src", imgSource);
    }
  }
};
export const isSaleProduct = (
  sale,
  product_sale_price,
  product_price,
  selectedCountry
) => {
  if (sale) {
    return (
      <>
        <span id="productSalePrice">
          {" "}
          {formatDecimal(product_sale_price)} {selectedCountry?.currency}{" "}
          &nbsp;&nbsp;{" "}
        </span>
        <span id="deprecatedPrice">
          {formatDecimal(product_price)} {selectedCountry?.currency}
        </span>
      </>
    );
  } else {
    return (
      <span id="productSalePrice">
        {formatDecimal(product_price)}&nbsp;
        {product_price ? selectedCountry?.currency : ""}
      </span>
    );
  }
};

export const calculateDiscountPercentage = (
  salePrice,
  regularPrice,
  isSale
) => {
  if (isSale) {
    const discountAmount = regularPrice - salePrice;
    const discountPercentage = (discountAmount / regularPrice) * 100;
    return discountPercentage.toFixed(0);
  } else {
    return 0; // No discount when the sale is not on
  }
};

export const sortCol = (a, b, dataIndex) => {
  if (a[dataIndex]?.length > 0 && b[dataIndex]?.length > 0) {
    return a[dataIndex].length - b[dataIndex].length;
  } else {
    return null;
  }
};

export const renderItemDataOrEmptyNull = (text) => {
  if (text) {
    if (typeof text === "number") {
      return numberWithCommas(text);
    } else {
      return text;
    }
  } else {
    if (text === 0) {
      return 0;
    } else {
      return EMPTY_NULL_DATA;
    }
  }
};

export function numberWithCommas(value) {
  if (
    value === "NaN" ||
    Number.isNaN(value) ||
    value === "" ||
    value === undefined
  ) {
    return "";
  } else {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

export const copyToClipboard = (text) => {
  var textField = document.createElement("textarea");
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand("copy");
  textField.remove();
};
