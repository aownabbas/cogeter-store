import React from "react";
import "./style.css";

import WhatWeOffer from "../../product-related/what-we-offer/WhatWeOffer";
import HomeShippingSnipet from "../../resuable/shipping-option-home/HomeShippingSnipet";

const VideoContainer = () => {
  return (
    <>
      <div className="offer__container">
        <div className="offer_container_collection__title"></div>
        <div className="offer_items_container">
          <div className="offer_items_container__left">
            <div className="offer_left__video">
              <video
                className="video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source
                  src="https://assets.cogeter.com/production/CDRARTUNWN_1_a3b5804399.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <HomeShippingSnipet />
            </div>
          </div>
          <div className="offer_items_container__right">
            <div className="offer_right__container">
              <WhatWeOffer />
            </div>
          </div>
        </div>
      </div>
      <div className="offer_container_collection__title"></div>
    </>
  );
};

export default VideoContainer;

{
  /* <div className="video_container__row">
  <div className="video-wrapper overlay">
    <video className="video" autoPlay muted loop>
      <source
        src="https://v4.cdnpk.net/videvo_files/video/free/video0469/large_watermarked/_import_6173bd6e21cd20.45039082_FPpreview.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
    <div className="overlay-title">
      <h2>Collection Title</h2>
    </div>
  </div>
  <div className="offer_container overlay">
    <div className="overlay-title">
      <h2>Collection Title</h2>
    </div>
  </div>
</div>; */
}
