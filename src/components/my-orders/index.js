import React from "react";
import SuperMaster from "../../layouts/SuperMaster";
import OrderItems from "./order-items/OrderItems";
import Heading from "../common-components/heading";

function MyOrders() {
  return (
    <SuperMaster>
      <div id="myPurchases">
        <Heading title="My Orders" variant="one" />
        <OrderItems />
      </div>
    </SuperMaster>
  );
}
export default MyOrders;
