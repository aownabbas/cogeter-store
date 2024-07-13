import React from "react";
import "./style.css";
import fromDubai from "../../../assets/payment/fromDubai.svg";
import dhl from "../../../assets/payment/dhl.svg";
import fastSupport from "../../../assets/payment/fastSupport.svg";
import refund from "../../../assets/payment/refund.svg";

const HomeShippingSnipet = () => {
  return (
    <div className="home_shipping_snipts__container">
      <div className="home_shipping_snipts__items">
        <img src={refund} />
        <p>
          14 DAYS <br />
          RETURN
        </p>
      </div>
      <div className="home_shipping_snipts__items">
        <img src={fastSupport} />
        <p>
          SUPERFAST <br />
          SUPPORT
        </p>
      </div>
      <div className="home_shipping_snipts__items">
        <img src={fromDubai} />
        <p>
          SHIPS FROM <br />
          DUBAI
        </p>
      </div>
      <div className="home_shipping_snipts__items">
        <img src={dhl} className="home_shipping_snipts__dhl" />
        <p>
          DELIVERY <br />
          PARTNERS
        </p>
      </div>
    </div>
  );
};

export default HomeShippingSnipet;
