import React, { useEffect, useState } from "react";
import "./style.css";
import SuperMaster from "../../layouts/SuperMaster";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { onEmailVerification } from "../../https/authentication";
import { toast } from "react-toastify";
import { errorRequestHandel } from "../../utils/helperFile";
import { useDispatch } from "react-redux";
import { _login } from "../../redux/actions/authentication";
import { Button, Form } from "react-bootstrap";

import check from "../../assets/checkout/confirmationIcon.svg";

const VerifyEmailAddress = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const token = params?.token?.trim();

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (email && token) {
      emailVerification();
    }
  }, []);

  const emailVerification = async () => {
    try {
      setLoading(true);
      const payload = {
        email: email,
        code: token,
      };
      const response = await onEmailVerification(payload);
      if (response.status === 200) {
        toast.success("Email verified");

        setSuccess(true);
        setLoading(false);

        dispatch(_login(response.data.data));
        // navigate("/");
      }
    } catch (error) {
      //   errorRequestHandel({ error: error });
      setLoading(false);
      setSuccess(false);
    }
  };
  return (
    <SuperMaster>
      {loading ? null : (
        <div className="verifyEmail__container">
          <div className="verifyEmail__confirmation">
            <div className="confirmation_moda__icon">
              <img src={check} />
            </div>
            <p>Your email has been verified successfully!</p>
            <div
              className="_confirm__button"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              Continue
            </div>
          </div>
        </div>
      )}
    </SuperMaster>
  );
};

export default VerifyEmailAddress;
