import React from "react";
import style from "./style.module.scss";
import classNames from "classnames";
import { renderItemDataOrEmptyNull } from "../../../helpers/Index";
import { Tooltip, Typography } from '@mui/material';

const CustomText = (props) => {
  const { variant = "one", title = "Heading" } = props;
  return (
   <p
  className={classNames(
    variant === "one"
      ? style.oneText
      : variant === "two"
      ? style.twoText
      : variant === "three"
      ? style.threeText
      : variant === "four"
      ? style.fourText
      : variant === "five"
      ? style.fiveText
      : style.simpleText,
    props.className
  )}
  style={props.style}
>
  {renderItemDataOrEmptyNull(title)}
</p>
  );
};

export default CustomText;
