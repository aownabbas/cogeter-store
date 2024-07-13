import React from "react";
import "./style.css"; // Create this CSS file for styling
import { Shimmer } from "react-shimmer";

const ShimmerEffect = ({ width, height }) => {
  return <Shimmer width={width} height={height} />;
};

export default ShimmerEffect;
