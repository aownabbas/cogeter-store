import React from "react";

import ShimerEffect from "../../Shimer";
const ProductDetaillShimer = () => {
  return (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="product_details_shimer__item">
          <ShimerEffect width={1000} height={600} />
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="product_details_shimer__item">
          <ShimerEffect width={1000} height={50} />
        </div>
        <div className="product_details_shimer__item">
          <ShimerEffect width={1000} height={50} />
        </div>
        <div className="product_details_shimer__item">
          <ShimerEffect width={1000} height={50} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetaillShimer;
