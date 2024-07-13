import React, { useState } from "react";
import "./style.css";

const SizeChart = ({ item }) => {
  const [imaageChart, setImageChart] = useState(item.size_chart_inches);
  const [selectedButton, setSelectedButton] = useState("inches"); // Default selected button

  const handleButtonClick = (unit) => {
    setSelectedButton(unit);
  };

  return (
    <div className="sizechart__container">
      <div>
        <h5>Size Chart</h5>
      </div>
      <p>Select required unit</p>
      <div className="sizechart__unit">

        <div
          className={`sizechart__unit_unit__button ${selectedButton === "inches" ? "active" : ""
            }`}
          onClick={() => {
            handleButtonClick("inches");
            setImageChart(item.size_chart_inches);
          }}
        >
          INCHES
        </div>
        <div className="separator">|</div>

        <div
          className={`sizechart__unit_cent__button ${selectedButton === "centimeter" ? "active" : ""
            }`}
          onClick={() => {
            handleButtonClick("centimeter");
            setImageChart(item.size_chart_cm);
          }}
        >
          CM
        </div>
      </div>
      <div className="sizechart__cover">
        <img src={imaageChart} />
      </div>
    </div>
  );
};

export default SizeChart;
