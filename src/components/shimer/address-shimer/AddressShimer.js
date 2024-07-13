import React from "react";
import "./style.css";
import ShimerEffect from "../Shimer";

const AddressShimer = () => {
  return (
    <>
      {[1, 2, 3, 4].map((item) => {
        return (
          <div className="address_shimer__container" key={item}>
            <ShimerEffect width={1300} height={100} />
          </div>
        );
      })}
    </>
  );
};

export default AddressShimer;
