import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
function DeliveryContent({ hide, addAddress, proceedToPayment }) {
  const [address, setAddress] = useState({});

  const selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );
  useEffect(() => {
    let user_address = localStorage.getItem("user_address");
    user_address = user_address ? JSON.parse(user_address) : {};
    setAddress(user_address);
  }, []);
  return (
    <div className={`_deliveryContent ${hide}`}>
      <div className="_item">
        <div className="_header">Home Delivery</div>
        <div className="_body">
          <div className="_column1">
            <h3>Standard Home Delivery</h3>
            <p>Thursday, May 25-Saturday, May 27</p>
          </div>
          <div className="_column2">
            <Link to={"#"}>{selectedCountry?.currency} 29</Link>
            <h3>Free Delivery</h3>
          </div>
        </div>
      </div>
      {address && (
        <div className="_item _address">
          <div className="_body">
            <span className="fa fa-check"></span>
            <div className="_column1">
              <h3>{address?.title}</h3>
              <p>{address?.address_1}</p>
              <p>{address?.address_2}</p>
            </div>
          </div>
        </div>
      )}

      <div className="_item _button">
        <div className="_body">
          <div className="_column1">
            <button onClick={addAddress}>
              <span className="fa fa-plus"></span> Add Address to continue
            </button>
          </div>
        </div>
        <div className="_footer">
          <button
            type="button"
            className="_paymentButton"
            onClick={proceedToPayment}
          >
            Proceed to Payments
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeliveryContent;
