import React from "react";
import "./style.css";
import cod from "../../../assets/payment/cod.svg";
import masterCard from "../../../assets/payment/masterCard.svg";
import stripe from "../../../assets/payment/stripe.svg";
import visa from "../../../assets/payment/visa.svg";
import lock from "../../../assets/payment/lock.svg";
import gogolePay from "../../../assets/payment/goolePay.svg";
import applePay from "../../../assets/payment/applePay.svg";
import tabbiIcon from "../../../assets/payment/tabbiIcon.svg";
const PaymentMethod = ({ hideText = false }) => {
  return (
    <div className="payment_method__container">
      {!hideText && (
        <div className="payment_method">
          <img src={lock} alt="secure" className="img-fluid" />
          <p>Secure Payments</p>
        </div>
      )}
      <div className="container text-center">
        <div className="payment_method__icons">
          {/* <div className="col-auto">
            <img src={stripe} alt="American Express" className="img-fluid" />
          </div> */}
          <div className="col-auto">
            <img src={visa} alt="Visa" className="img-fluid" />
          </div>
          <div className="col-auto">
            <img src={masterCard} alt="MasterCard" className="img-fluid" />
          </div>
          <div className="col-auto">
            <img src={gogolePay} alt="MasterCard" className="img-fluid" />
          </div>
          <div className="col-auto">
            <img src={applePay} alt="MasterCard" className="img-fluid" />
          </div>

          <div className="col-auto">
            <img src={cod} alt="Discover" className="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
