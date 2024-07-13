import React, { useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "./styles.css";
import LeftArrowIcon from "../../assets/icons/carousel/left-icon.svg";
import RightArrowIcon from "../../assets/icons/carousel/right-icon.svg";
import WishlistFilledMobileIcon from "../../../src/assets/icons/mobile-icons/wishlist-filled-mobile-icon.svg";
import WishlistUnfilledMobileIcon from "../../../src/assets/icons/mobile-icons/wishlist-unfilled-mobile-icon.svg";
import ShareMobileIcon from "../../../src/assets/icons/mobile-icons/share-mobile-icon.svg";

import { Link, useNavigate } from "react-router-dom";

const CustomCarousel = ({ product, isFav, markProductFavourite }) => {
  const carouselRef = useRef(null);
  const [currentItem, setCurrentItem] = useState(0);

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

  // Function to handle the previous slide action
  const handlePrev = () => {
    const newIndex =
      currentItem > 0 ? currentItem - 1 : productGallery?.length - 1;
    setCurrentItem(newIndex);
    carouselRef.current.moveTo(newIndex);
  };

  // Function to handle the next slide action
  const handleNext = () => {
    const newIndex = (currentItem + 1) % productGallery?.length;
    setCurrentItem(newIndex);
    carouselRef.current.moveTo(newIndex);
  };
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

  const renderImageVideo = (item) => {
    return (
      <>
        {item.type === "image" ? (
          <img src={item.url} alt="slide" />
        ) : (
          <>
            <video
              className="video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={item.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </>
        )}
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
  return (
    <div className="carousel-container">
      <div className="carousel-content">
        {renderFavShareIcons()}
        <Carousel
          ref={carouselRef}
          showThumbs={true}
          showIndicators={false}
          showStatus={false}
          showArrows={false}
          selectedItem={currentItem}
          onChange={setCurrentItem}
          swipeable={true}
          preventMovementUntilSwipeScrollTolerance={true}
          swipeScrollTolerance={50}
        >
          {productGallery?.map((item, index) => (
            <div key={index}>{renderImageVideo(item)}</div>
          ))}
        </Carousel>

        <div className="carousel-controls">
          <button onClick={handlePrev}>
            <img src={LeftArrowIcon} alt="Previous" className="carousel-icon" />
          </button>
          <span>
            {currentItem + 1} of {productGallery?.length}
          </span>
          <button onClick={handleNext}>
            <img src={RightArrowIcon} alt="Next" className="carousel-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomCarousel;
