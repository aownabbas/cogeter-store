import React from "react";
import SuperMaster from "../layouts/SuperMaster";
import AddressItem from "../components/AddressItem";
function MyAddresses() {
  return (
    <SuperMaster>
      <div id="myPurchases" className="_myAddress">
        <h3>My Addresses</h3>
        <AddressItem />
      </div>
    </SuperMaster>
  );
}
export default MyAddresses;
