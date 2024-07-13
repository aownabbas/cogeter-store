import React from "react";
import "./style.css";

const NoDataFound = ({ icon, title, subTitle }) => {
  return (
    <div className="no_data__found__container">
      <img src={icon} />
      <p>{title}</p>
      <span>{subTitle}</span>
    </div>
  );
};

export default NoDataFound;
