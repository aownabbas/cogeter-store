import React from "react";

import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Header() {
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#">
            <Link to="/">Cogetor Store</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link
                to="/create-account"
                role="button"
                data-rr-ui-event-key="#"
                className="nav-link"
              >
                Register
              </Link>
              <Link
                to="/forgot-password"
                role="button"
                data-rr-ui-event-key="#"
                className="nav-link"
              >
                Forgot Password
              </Link>
              <Link
                to="/login"
                role="button"
                data-rr-ui-event-key="#"
                className="nav-link"
              >
                Login
              </Link>
              <Link
                to="/todo"
                role="button"
                data-rr-ui-event-key="#"
                className="nav-link"
              >
                Todo
              </Link>
              <Link
                to="/products"
                role="button"
                data-rr-ui-event-key="#"
                className="nav-link"
              >
                Products
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
export default Header;
