import React from "react";
import style from "./style.module.scss";
import classNames from "classnames";
import { renderItemDataOrEmptyNull } from "../../../helpers/Index";
import { Tooltip, Typography } from '@mui/material';

const Heading = (props) => {
  const { variant = "one", title = "Heading" } = props;
  return (
    <h2
      className={classNames(
        variant === "one"
          ? style.oneHeading
          : variant === "two"
            ? style.twoHeading
            : variant === "three"
              ? style.threeSmallHeading
              : style.simpleHeadig,
        props.className
      )}
      style={props.style}
    >{renderItemDataOrEmptyNull(title)}</h2>
  );
};

export default Heading;
