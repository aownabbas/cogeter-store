import React from "react";
import { Button, Form } from "react-bootstrap";

import "./style.css";
import check from "../../../assets/checkout/confirmationIcon.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { _clearCartItems } from "../../../redux/actions/product";
const ConfirmationModal = ({ orderId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onContinueShopping = () => {
    dispatch(_clearCartItems());
  };
  return (
    <div className="confirmation_moda__container">
      <div className="confirmation_moda__icon">
        <img src={check} />
      </div>
      <div className="confirmation_oder__info">
        <p>Order placed successfully</p>
      </div>
      <div className="confirmation_oder__button">
        {/* <Link to={"/"}> */}
        <Link to={`/orders/details/${orderId}`}>
          <Form.Group className="mb-2 _btnContainer">
            <Button
              onClick={onContinueShopping}
              variant="primary"
              className="_btnFlatCenter"
            >
              Continue Shopping
            </Button>
          </Form.Group>
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationModal;
