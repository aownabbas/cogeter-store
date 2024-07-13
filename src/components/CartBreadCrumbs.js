import React from "react";
import { makeTheCurrentPageActive } from "../helpers/Index";
import { Link } from "react-router-dom";
import frwrdArrow from "../assets/icons/frwrd-arrow.svg";
function CartBreadCrumbs({
  selectedTab,
  onTabCart,
  onTabInformation,
  onTabShippingOptions,
  onTabPaymentOption,
}) {
  return (
    <section id="pageLinks">
      <ul>
        <li onClick={onTabCart}>
          {/* <li > */}
          <Link to={"#"} className="_active">
            Cart
          </Link>
        </li>
        <img src={frwrdArrow} className="farword_arrow" />
        <li onClick={onTabInformation}>
          {/* <li> */}
          <Link to={"#"} className={selectedTab >= 1 ? "_active" : ""}>
            Information
          </Link>
        </li>
        <img src={frwrdArrow} className="farword_arrow" />

        {/* <li onClick={onTabShippingOptions}> */}
        <li>
          <Link to={"#"} className={selectedTab >= 2 ? "_active" : ""} style={{ cursor: "default" }}>
            Shipping
          </Link>
        </li>
        {/* <img src={frwrdArrow} className="farword_arrow" /> */}
        {/* <li onClick={onTabPaymentOption}>
          <Link to={"#"} className={selectedTab >= 3 ? "_active" : ""}>
            Payment
          </Link>
        </li> */}
      </ul>
    </section>
  );
}
export default CartBreadCrumbs;
