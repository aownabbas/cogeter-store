import React, { useEffect, useState } from "react";
import fromDubai from "../../../assets/payment/fromDubai.svg";
import dhl from "../../../assets/payment/dhl.svg";
import fastSupport from "../../../assets/payment/fastSupport.svg";
import refund from "../../../assets/payment/refund.svg";
import freeshppingicon from "../../../assets/payment/freeshppingicon.svg";
import deliveryTimeicon from "../../../assets/payment/on-time.png";


import { useSelector } from "react-redux";
import { getCurrencyMultiplier } from "../../../utils/helperFile";

const ShippingOption = ({ hideText = false }) => {
  const selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );
  const exchangeRates = useSelector((state) => state._general.exchangeRates);

  const [rateMultiplier, setRateMultiplier] = useState(1);
  const countryDeliveryTaxes = useSelector(
    (state) => state._general.countryDeliveryTaxes
  );
  const _countryDeliveryTaxes = countryDeliveryTaxes?.find(
    (item) => item?.country?.id === selectedCountry?.id
  );

  useEffect(() => {
    setRateMultiplier(
      getCurrencyMultiplier(exchangeRates, selectedCountry?.currency)
    );
  }, [selectedCountry, exchangeRates]);

  return (
    <>
      {!hideText && (
        <>
          <div className="shipping__container_title">
            <img src={freeshppingicon} />
            <p>
              FREE SHIPPING ON ORDERS OVER{" "}
              {parseInt(
                _countryDeliveryTaxes?.free_shipping_threshold * rateMultiplier
              )}{" "}
              {selectedCountry?.currency}
            </p>
          </div>
          {_countryDeliveryTaxes?.estimated_delivery_time !== null &&
            <div className="shipping__container_title" style={{ marginTop: "8px" }}>
              <img src={deliveryTimeicon} height={15} width={15} />
              <p>
                ESTIMATED DELIVERY TIME: {" "}
                {_countryDeliveryTaxes?.estimated_delivery_time}
              </p>
            </div>
          }

        </>
      )}

      <div className="shipping__container">
        <div className="shipping__option_item">
          <div className="shipping__option_item_icon">
            <img src={refund} />
          </div>
          <p>
            14 DAYS
            <br /> RETURN
          </p>
        </div>
        <div className="shipping__option_item">
          <div className="shipping__option_item_icon">
            <img src={fastSupport} />
          </div>
          <p>
            SUPERFAST
            <br />
            SUPPORT
          </p>
        </div>
        <div className="shipping__option_item">
          <div className="shipping__option_item_icon">
            <img src={fromDubai} />
          </div>
          <p>
            SHIPS FROM
            <br />
            DUBAI
          </p>
        </div>
        <div className="shipping__option_item">
          <div className="shipping__option_item_icon">
            <img src={dhl} />
          </div>
          <p>
            DELIVERY
            <br />
            PARTNERS
          </p>
        </div>
      </div>
    </>
  );
};

export default ShippingOption;
