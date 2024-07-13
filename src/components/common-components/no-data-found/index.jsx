import React from "react";
import style from "./style.module.scss";
import { Row } from "react-bootstrap";

const NoDataFound = ({
  height = "100%",
  content = () => {
    return <p className={style.noDataFound}>No data found</p>;
  },
}) => {
  return (
    <Row
      className={style.noDataFoundContainer}
      justify={"center"}
      align="middle"
      style={{ height }}
    >
      {content()}
    </Row>
  );
};

export default NoDataFound;
