import React from "react";
import ShimmerEffect from "../Shimer";

const ProfileShimer = () => {
  return (
    <div>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="product_details_shimer__item">
            <ShimmerEffect width={1000} height={50} />
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="product_details_shimer__item">
            <ShimmerEffect width={1000} height={50} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="product_details_shimer__item">
            <ShimmerEffect width={1000} height={50} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileShimer;
