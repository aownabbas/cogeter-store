import React from "react";
import { useSelector } from "react-redux";

function CartItem(item) {

  const selectedCountry = useSelector((state) => state._settings.selectedCountry);
  //selectedCountry?.currency
  return (
    <div className="_item">
      <div className="_img">
        <img src={item?.img} />
      </div>
      <div className="_body">
        <div className="_info">
          <div>
            <h3>{item?.name || 0}</h3>
            <p>Ref 201/234/253</p>
          </div>
        </div>
        <div className="_qty">
          <span className="_size">{item?.selected_variant || "SM"}</span>
          <span className="_color" style={{ background: item?.color }}></span>
        </div>
        <div className="_qtyIncrements">
          <button>{item?.qty || 0}</button>
        </div>
        <div className="_price">
          <h3>{item?.price || 0} {selectedCountry?.currency}</h3>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
