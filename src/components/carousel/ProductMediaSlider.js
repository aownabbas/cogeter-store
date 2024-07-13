import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./style.css";
import LeftArrowIcon from "../../assets/icons/carousel/left-icon.svg";
import RightArrowIcon from "../../assets/icons/carousel/right-icon.svg";

import rightBigArrow from "../../assets/slick_slider/right_big_arrow.svg";
import rightSmallArrow from "../../assets/slick_slider/right_small_arrow.svg";
import leftBigArrow from "../../assets/slick_slider/left_big_arrow.svg";
import lefttSmallArrow from "../../assets/slick_slider/left_small_arrow.svg";

import WishlistFilledMobileIcon from "../../../src/assets/icons/mobile-icons/wishlist-filled-mobile-icon.svg";
import WishlistUnfilledMobileIcon from "../../../src/assets/icons/mobile-icons/wishlist-unfilled-mobile-icon.svg";
import ShareMobileIcon from "../../../src/assets/icons/mobile-icons/share-mobile-icon.svg";

import ImageModal from "./ProductImageModal";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className="slick__left_Arrow" onClick={onClick}>
      <img src={rightBigArrow} className="slick__Arrow_icon" />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className="slick__right_Arrow" onClick={onClick}>
      <img src={leftBigArrow} className="slick__Arrow_icon" />
    </div>
  );
}

function Slide2NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className="slick__left_bottom_slide_Arrow" onClick={onClick}>
      <img src={rightSmallArrow} className="slick__bottom_Arrow_icon" />
    </div>
  );
}

function Slide2PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className="slick__right_bottom_slide_Arrow" onClick={onClick}>
      <img src={lefttSmallArrow} className="slick__bottom_Arrow_icon" />
    </div>
  );
}

const ProductMediaSlider = ({ product, markProductFavourite, isFav }) => {
  const productGallery = [];
  if (product?.cover_image) {
    productGallery.push({ type: "image", url: product?.cover_image });
  }
  if (product?.video) {
    productGallery.push({ type: "video", url: product?.video });
  }
  if (product?.gallery?.length > 0) {
    product?.gallery?.forEach((item) => {
      productGallery.push({ type: "image", url: item.url });
    });
  }
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
  }, []);

  let slider1, slider2;

  const [openImageModal, setOpenImageModal] = useState(false);
  const [productImages, setProductImages] = useState([]);

  const renderFavShareIcons = () => {
    return (
      <>
        <div className="_fav_share_icons">
          <div onClick={() => markProductFavourite(product)}>
            {isFav ? (
              <>
                <img
                  src={WishlistFilledMobileIcon}
                  alt={"/imgs/no_img.png"}
                  data-productid={"1"}
                  data-is_favorite="0"
                  data-add="addToWishList"
                />
              </>
            ) : (
              <img
                src={WishlistUnfilledMobileIcon}
                alt={"/imgs/no_img.png"}
                data-productid={"2"}
                data-is_favorite="1"
                data-add="addToWishList"
              />
            )}
          </div>

          <div onClick={shareProduct}>
            <img src={ShareMobileIcon} alt={"/imgs/no_img.png"} />
          </div>
        </div>
      </>
    );
  };

  const shareProduct = async () => {
    const productUrl = window.location.href;
    try {
      await navigator.share({
        title: "Share via",
        text: product.title,
        url: productUrl,
      });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  function moveItemToFront(array, specificItemUrl) {
    const itemIndex = array.findIndex((item) => item.url === specificItemUrl);
    if (itemIndex !== -1) {
      // Extract the item from its current position
      const itemToMove = array.splice(itemIndex, 1)[0];
      array.unshift(itemToMove);
    }
  }

  return (
    <div className="slick__slider__container">
      <Slider
        asNavFor={nav2}
        ref={(slider) => (slider1 = slider)}
        nextArrow={<SampleNextArrow />}
        prevArrow={<SamplePrevArrow />}
      >
        {productGallery?.map((item) => {
          if (item.type === "video") {
            return (
              <div className="slider__top_video">
                <video
                  key={product?.identifier}
                  //   className="video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={item?.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          }
          return (
            <div
              onClick={() => {
                setOpenImageModal(true);
                const specificItemUrl = item.url; // The ID of the item you want to move to the front
                moveItemToFront(productGallery, specificItemUrl);
                setProductImages(productGallery);
              }}
            >
              {/* <SlideshowLightbox className="container grid grid-cols-3 gap-2 mx-auto"> */}
              <img src={item.url} style={{ width: "100%" }} />
              {/* </SlideshowLightbox> */}
            </div>
          );
        })}
      </Slider>
      <div style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Slider
          asNavFor={nav1}
          ref={(slider) => (slider2 = slider)}
          slidesToShow={4}
          swipeToSlide={true}
          focusOnSelect={true}
          nextArrow={<Slide2NextArrow />}
          prevArrow={<Slide2PrevArrow />}
          className="bottom_slider"
        >
          {productGallery?.map((item) => {
            if (item.type === "video") {
              return (
                <div className="slider__video">
                  <video
                    key={product?.identifier}
                    // className="video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  >
                    <source src={item?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              );
            }
            return (
              <div className="slick__thumnail">
                <img src={item.url} style={{ height: 100 }} />
              </div>
            );
          })}
        </Slider>
      </div>
      {renderFavShareIcons()}
      <ImageModal
        openImageModal={openImageModal}
        setOpenImageModal={setOpenImageModal}
        productImages={productImages}
        productGallery={productGallery}
      />
    </div>
  );
};

export default ProductMediaSlider;
