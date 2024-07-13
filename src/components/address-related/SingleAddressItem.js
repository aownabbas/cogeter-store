import React from "react";
import "./style.css";
import addressIcon from "../../assets/address-icon.svg";

const SingleAddressItem = ({ item, onClick, onDelete }) => {
  return (
    <div className="address_item__container">
      <div className="address_item__second_child text-truncate">
        <p>{item.address_line_1}</p>
      </div>
      <div className="address_item__third_child">
        <p onClick={onClick}>Change</p>
        {/* <img
          onClick={onDelete}
          style={{ width: 25, height: 25, border: 0 }}
          src="/trash.svg"
          loading="true"
          className="_action"
        /> */}
      </div>
    </div>
  );
};

export default SingleAddressItem;
