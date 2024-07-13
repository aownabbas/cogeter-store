import React from "react";
import "./style.css";
import fast from "../../../assets/offers/1.svg";
import slim from "../../../assets/offers/6.svg";
import stylish from "../../../assets/offers/2.svg";
import soft from "../../../assets/offers/5.svg";
import delivery from "../../../assets/offers/4.svg";
import support from "../../../assets/offers/3.svg";

const WhatWeOffer = () => {
  return (
    <div className="we_offer__container_master">
      <div className="we_offer__container">
        <div className="we_offer__dev">
          <div className="we_offer__dev_icon">
            <img src={fast} />
          </div>
          <div className="we_offer__dev_title">
            <p>FAST SHIPPING</p>
          </div>
        </div>
        <div className="we_offer__dev">
          <div className="we_offer__dev_icon">
            <img src={slim} />
          </div>
          <div className="we_offer__dev_title">
            <p>SLIMMING DESIGN</p>
          </div>
        </div>
      </div>
      <div className="we_offer__container">
        <div className="we_offer__dev">
          <div className="we_offer__dev_icon">
            <img src={stylish} />
          </div>
          <div className="we_offer__dev_title">
            <p>STYLISH LOOK</p>
          </div>
        </div>
        <div className="we_offer__dev">
          <div className="we_offer__dev_icon">
            <img src={soft} />
          </div>
          <div className="we_offer__dev_title">
            <p>ULTRA SOFT</p>
          </div>
        </div>
      </div>
      <div className="we_offer__container">
        <div className="we_offer__dev">
          <div className="we_offer__dev_icon">
            <img src={support} />
          </div>
          <div className="we_offer__dev_title">
            <p>
              ONE DAY <br />
              DELIVERY UAE
            </p>
          </div>
        </div>
        <div className="we_offer__dev">
          <div className="we_offer__dev_icon">
            <img src={delivery} />
          </div>
          <div className="we_offer__dev_title">
            <p>RAPID SUPPORT</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhatWeOffer;
