import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import ShimmerEffect from "../Shimer";
import "./style.css"; // Import your CSS file for styling

const HomeScreenShimer = () => {
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <Container fluid>
        <Row className="mb-3">
          <Col md={6}>
            <ShimmerEffect width={700} height={600} />
          </Col>
          <Col md={6}>
            <ShimmerEffect width={700} height={600} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomeScreenShimer;
