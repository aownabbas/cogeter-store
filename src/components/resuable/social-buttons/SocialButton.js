import React, { Children } from "react";
import "./style.css";

const SocialButton = ({ icon, title, onClick, fontSize }) => {
  return (
    <div className="social_button__container_custom" onClick={onClick}>
      <div className="social_button__custom_icon">
        <img src={icon} />
      </div>
      <div className="social_button__custom_description">
        <p style={{ fontSize: fontSize }}>{title}</p>
      </div>
    </div>
  );
};

export default SocialButton;
