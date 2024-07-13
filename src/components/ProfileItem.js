import React from "react";
import { Link } from "react-router-dom";
import { LazyImage } from "../helpers/Index";
function ProfileItem({ icon, title, description, redirectTo, onClick }) {
  const Image = (src) => {
    return <img src={src} />;
  };
  return (
    <div className="_item">
      <div className="_body">
        <div className="_column1">{Image(icon)}</div>
        <div className="_column2">
          <Link to={redirectTo} onClick={onClick}>
            {title}
          </Link>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
export default ProfileItem;
