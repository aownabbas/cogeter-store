import React, { useState, useEffect } from "react";
import Slider from "react-slick";

const ExampleMediaSlider = ({ product }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
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

  return (
    <div>
      <Slider asNavFor={nav2} ref={(slider) => (slider1 = slider)}>
        {productGallery?.map((item) => {
          if (item.type === "video") {
            return (
              <video
                className="video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                style={{ height: "100%" }}
              >
                <source src={item?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            );
          }
          return (
            <div>
              <img src={item.url} style={{ width: "100%" }} />
            </div>
          );
        })}
      </Slider>

      <Slider
        asNavFor={nav1}
        ref={(slider) => (slider2 = slider)}
        slidesToShow={4}
        swipeToSlide={true}
        focusOnSelect={true}
      >
        {productGallery?.map((item) => {
          if (item.type === "video") {
            return (
              <video
                className="video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={item?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
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
  );
};

export default ExampleMediaSlider;
