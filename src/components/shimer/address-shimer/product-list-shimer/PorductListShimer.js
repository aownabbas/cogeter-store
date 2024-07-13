import React from "react";
import "./style.css";
import ShimmerEffect from "../../Shimer";

const PorductListShimer = () => {
  const width = window.innerWidth;

  return (
    <>
      <br />
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="product_single__item">
            <ShimmerEffect height={500} width={width} />
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="product_single__item">
            <ShimmerEffect height={500} width={width} />
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="product_single__item">
            <ShimmerEffect height={500} width={width} />
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="product_single__item">
            <ShimmerEffect height={500} width={width} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="product_single__item">
            <ShimmerEffect height={500} width={300} />
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="product_single__item">
            <ShimmerEffect height={500} width={300} />
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="product_single__item">
            <ShimmerEffect height={500} width={300} />
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="product_single__item">
            <ShimmerEffect height={500} width={300} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PorductListShimer;
