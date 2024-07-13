import React from "react";
import style from "./style.module.scss";
import classNames from "classnames";
import { Button } from "react-bootstrap";

const CustomButton = (props) => {
  const { variant = "one" } = props;

  return (
    <Button
      className={classNames(
        variant === "one"
          ? style.oneBtn
          : variant === "two"
          ? style.twoBtn
          : style.simpleBtn,
        props.className
      )}
      block={props.block}
      danger={props.danger}
      disabled={props.disabled || props.loading}
      ghost={props.ghost}
      href={props.href}
      htmlType={props.htmlType}
      icon={props.icon}
      loading={props.loading}
      shape={props.shape}
      style={props.style}
      size={props.size}
      target={props.target}
      type={props.type}
      onClick={props.onClick}
      {...props}
    >
      {props.startData || ""} {props.title} {props.endData || ""}
    </Button>
  );
};

export default CustomButton;
