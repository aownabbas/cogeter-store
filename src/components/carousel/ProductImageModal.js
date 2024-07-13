import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Slider from "react-slick";

import rightBigArrow from "../../assets/slick_slider/right_big_arrow.svg";
import rightSmallArrow from "../../assets/slick_slider/right_small_arrow.svg";
import leftBigArrow from "../../assets/slick_slider/left_big_arrow.svg";
import lefttSmallArrow from "../../assets/slick_slider/left_small_arrow.svg";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const style = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100vh",
  bgcolor: "background.paper",
  border: "5px solid #000",
  boxShadow: 24,
  //   p: 4,
};

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

export default function ImageModal({
  openImageModal,
  setOpenImageModal,
  productImages,
  productGallery,
}) {
  // const handleOpen = () => setOpenImageModal(true);
  const handleClose = () => setOpenImageModal(false);
  const [nav2, setNav2] = useState(null);
  let slider1;
  useEffect(() => {
    setNav2(slider1);
  }, []);
  const transformWrapperRef = useRef();
  const handleZoomInClick = () => {
    const transformWrapper = transformWrapperRef.current;
    if (transformWrapper) {
      // You can use the library's API to programmatically zoom in
      transformWrapper.zoomIn();
    }
  };

  return (
    <div>
      <Modal
        open={openImageModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <Button
            className="slick__left_Arrow"
            style={{ position: 'absolute', top: 25, color: 'black', zIndex: 9 }}
            onClick={handleClose}
          >
            Close
          </Button> */}
          <div
            className="gallery_close_icon"
            style={{ position: "absolute", top: 25, zIndex: 9, right: 6 }}
          >
            <img
              className="pointer"
              onClick={handleClose}
              src="/imgs/icons/close_icon.png"
              width="35px"
              height="35px"
              alt="closeModal"
            />
          </div>
          <Slider
            asNavFor={nav2}
            ref={(slider) => (slider1 = slider)}
            nextArrow={<SampleNextArrow />}
            prevArrow={<SamplePrevArrow />}
          >
            {productImages.length !== 0 &&
              productImages?.map((item) => {
                if (item.type !== "video") {
                  return (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100vh",
                      }}
                    >
                      <TransformWrapper
                        options={{
                          limitToBounds: false, // Allows panning beyond the image edges
                          minScale: 0.5, // Minimum zoom scale
                          maxScale: 3.0, // Maximum zoom scale
                        }}
                      >
                        <TransformComponent>
                          <img
                            // className="w-full rounded"
                            src={item.url}
                            height="100%"
                            width="100%"
                            style={{
                              width: "100%",
                              height: "99vh",
                              objectFit: "cover",
                            }}
                            onClick={handleZoomInClick}
                          />
                        </TransformComponent>
                      </TransformWrapper>
                    </div>
                  );
                }
              })}
          </Slider>
        </Box>
      </Modal>
    </div>
  );
}
