import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import IsWishlist from "../assets/icons/is-wishlist.svg";
import NotWishlistIcon from "../assets/icons/not-wishlist.svg";
import AddSizePlusIcon from "../assets/icons/minusSizes.svg";
import AddSizeMinusIcon from "../assets/icons/plusSizes.svg";
import useWindowSize from "../utils/hooks/useWindowSize";
import { hideClothSizes, moveToTop, zoomIn } from "../helpers/Index";
import { useDispatch } from "react-redux";

import { ASSET_URL } from "../utils/const";
import ProductSizes from "./product-related/ProductSizes";
import ProductFooter from "./product-related/ProductFooter";
import {
  _toggleWishlistModal,
  _toggleWishlistProduct,
} from "../redux/actions/product";
import { addProductToWishList } from "../https/wishlistRequests";
import { toast } from "react-toastify";
import {
  _toggleLoginModal,
  _toggleOverylay,
} from "../redux/actions/settingsAction";
import { addPreFixToMediaUrl } from "../utils/helperFile";

function ProductComponent({
  item,
  removeItemFromWishlist,
  selectSimilarProducts,
  onAddToWishList,
}) {
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const [isOnMobile, setIsOnMobile] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const userToken = localStorage.getItem("token");

  let product_url = item?.cover_image;

  const dispatch = useDispatch();

  useEffect(() => {
    if (width > 768) {
      setIsOnMobile(false);
    }
  }, [width]);

  const markProductFavourite = async () => {
    if (userToken == null || userToken === undefined || userToken === "") {
      dispatch(_toggleLoginModal(true));
      return;
    }
    try {
      const action =
        item.is_wishlist || removeItemFromWishlist ? "remove" : "add";
      dispatch(_toggleWishlistProduct(item.id));
      onAddToWishList(item);
      const data = {
        product: item.id,
      };
      if (removeItemFromWishlist) {
        removeItemFromWishlist(item.id);
      }
      const response = await addProductToWishList({ data: data });
      if (response.status === 200) {
        if (action === "add") {
          toast.success("Product added to wishlist");

          // dispatch(_toggleWishlistModal(true));
          // dispatch(_toggleOverylay(true));
        } else {
          toast.success("Product removed from wishlist");
        }
      }
    } catch (error) {
      dispatch(_toggleWishlistProduct(item.id));
    }
  };

  const handleClick = () => {
    setIsOnMobile((prevIsToggled) => !prevIsToggled);
  };

  const hideSearchAndShowMain = () => {
    const mainContent = document.querySelector("._mainContent");
    const searchModal = document.querySelector("._searchModal");
    if (!searchModal.classList.contains("_hidden")) {
      searchModal.classList.add("_hidden");
      mainContent.classList.remove("_hidden");
    }
  };

  const isSoldOut = item?.variants.every(
    (product) => product.quantity === "0" || product.quantity === 0
  );
  // Define class names
  const tagContainerClass = `product_tags_container ${
    width > 768 ? "" : "_mob"
  } ${isSoldOut ? "_soldout" : ""}`;
  const tagTextClass = `tags_text${width > 768 ? "" : "_mob"}`;

  // Helper to check if the product was published within the last 30 days
  const isNewProduct = () => {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(
      currentDate.setDate(currentDate.getDate() - 30)
    );
    return new Date(item?.published_at) >= thirtyDaysAgo;
  };

  // Determine which tags to show
  const tags = [];

  // Check if the product is sold out
  if (isSoldOut) {
    tags.push(
      <div className={`${tagContainerClass} soldout`}>
        <div>Sold Out</div>
      </div>
    );
  } else {
    // If the product is new, add 'New' tag
    if (isNewProduct(item.published_at)) {
      tags.push(
        <div className={`${tagContainerClass} new`}>
          <div>New</div>
        </div>
      );
    }

    if (item.on_sale) {
      tags.push(
        <div className={`${tagContainerClass} new`}>
          <div>On Sale</div>
        </div>
      );
    }
  }

  return (
    <>
      <div className="_item">
        <div className="_tags_parent">{tags}</div>
        <div className="product_heart_container">
          <div>
            {item?.is_wishlist ? (
              <div className="_icon_overlay">
                <img
                  onClick={markProductFavourite}
                  src={IsWishlist}
                  alt={"/imgs/no_img.png"}
                  data-productid={item?.id}
                  data-is_favorite="0"
                  data-add="addToWishList"
                  // loading="lazy"
                />
              </div>
            ) : (
              <div className="_icon_overlay">
                <img
                  onClick={markProductFavourite}
                  src={NotWishlistIcon}
                  alt={"/imgs/no_img.png"}
                  data-productid={item?.id}
                  data-is_favorite="1"
                  data-add="addToWishList"
                  // loading="lazy"
                />
              </div>
            )}
          </div>
          {width < 768 && (
            <div>
              {isOnMobile ? (
                <div className="_icon_overlay">
                  <img
                    onClick={handleClick}
                    src={AddSizeMinusIcon}
                    alt={"/imgs/no_img.png"}
                    data-productid={item?.id}
                    data-is_favorite="0"
                    data-add="addToWishList"
                    // loading="lazy"
                  />
                </div>
              ) : (
                <div className="_icon_overlay">
                  <img
                    onClick={() => setIsOnMobile(true)}
                    src={AddSizePlusIcon}
                    alt={"/imgs/no_img.png"}
                    data-productid={item?.id}
                    data-is_favorite="1"
                    data-add="addToWishList"
                    // loading="lazy"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="_body" onMouseLeave={hideClothSizes}>
          <div className="_productImageContainer">
            {/* <Link to={`/products/${item.identifier}`}> */}
            <div
              onClick={() => {
                hideSearchAndShowMain();
                navigate(`/products/${item.identifier}`);
                // if (selectSimilarProducts) {
                //   selectSimilarProducts(item.identifier);
                // }
                // if (window.location.href.includes('/products/')) {
                //   navigate(`/products/${item.identifier}`);
                //   window.location.reload();
                // }
                // else {
                //   navigate(`/products/${item.identifier}`);
                // }
              }}
              style={{ cursor: "pointer" }}
            >
              <figure
                onMouseMove={(e) => {
                  if (width > 768) {
                    zoomIn(e);
                  } else {
                  }
                }}
                style={{
                  backgroundImage: `url(${product_url})`,
                  backgroundPosition: backgroundPosition,
                }}
              >
                <img
                  src={addPreFixToMediaUrl(product_url)}
                  alt={"/imgs/no_img.png"}
                  loading="lazy"
                />
              </figure>
            </div>
            {/* </Link> */}
            <ProductSizes product={item} isOnMobile={isOnMobile} />
          </div>
        </div>

        <ProductFooter item={item} hideSearchAndShowMain={hideSearchAndShowMain}/>
        {/* {item.on_sale ? (
          <div className="product_sale_container">
            <p>On Sale</p>
          </div>
        ) : null} */}
      </div>
    </>
  );
}
export default ProductComponent;
