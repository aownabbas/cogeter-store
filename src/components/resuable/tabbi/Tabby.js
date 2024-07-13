import React, { useRef } from "react";
import "./style.css";
import tabbyIcon from "../../../assets/payment/tabby.svg";
import tamaraIcon from "../../../assets/payment/tamara.svg";
import { formatDecimal } from "../../../utils/helperFile";
import { useSelector } from "react-redux";

const Tabby = ({ amount }) => {
  const buttonRef = useRef();
  const _selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );
  const installmentAmount = formatDecimal(amount / 4);

  return (
    <>
      {_selectedCountry?.has_tabby_support && (
        <>
          <div className="tabby__container">
            <p>
              or 4 interest-free payments of <b>{_selectedCountry?.currency}</b>{" "}
              <b>{installmentAmount}</b>. No fees. Shariah-compliant.{" "}
              <span
                className="tabby__learn_more"
                onClick={() => buttonRef.current.click()}
              >
                Learn More
              </span>
            </p>
            <button
              ref={buttonRef}
              type="button"
              data-tabby-info="installments"
              data-tabby-price={amount}
              data-tabby-currency={_selectedCountry?.currency}
              style={{
                backgroundColor: "transparent",
                border: "none",
                display: "none",
              }}
            >
              Learn More
            </button>
            <img src={tabbyIcon} />
          </div>
        </>
      )}
      {/* Tamara */}
      {_selectedCountry?.has_tamara_support && (
        <>
          <div className="tabby__container">
            <p>
              Pay a minimum of <b>{installmentAmount}</b>{" "}
              <b>{_selectedCountry?.currency}</b> now, and the rest over time -
              no hidden fees, no interest.
            </p>
            <img src={tamaraIcon} />
          </div>
        </>
      )}
    </>
  );
};

export default Tabby;
