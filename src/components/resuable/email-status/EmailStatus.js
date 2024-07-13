import React from "react";
import "./style.css";
import emailAccess from "../../../assets/email-access.svg";
import { onResendEmailVerification } from "../../../https/authentication";
import { toast } from "react-toastify";

const EmailStatus = () => {
  const resenEmail = async () => {
    try {
      const response = await onResendEmailVerification();
      if (response.status === 200) {
        toast.success("Verify link sent to your email");
      }
    } catch (error) {
    }
  };
  return (
    <div className="emial_status__container">
      {/* <img src={emailAccess} /> */}
      <p>To access all the features, please verify your email address.</p>
      <b onClick={resenEmail}>Verify Email</b>
    </div>
  );
};

export default EmailStatus;
