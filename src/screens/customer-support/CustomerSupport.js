import React, { useEffect, useRef, useState } from "react";
import SuperMaster from "../../layouts/SuperMaster";
import "./styles.css";
import WhatsappIcon from "../../assets/icons/customer-support/whatsapp.svg";
import EmailIcon from "../../assets/icons/customer-support/email.svg";
import CallIcon from "../../assets/icons/customer-support/call.svg";
import { Button, Form, Spinner } from "react-bootstrap";
import {
  errorRequestHandel,
  isValidEmailAddress,
} from "../../utils/helperFile";
import smalDownArrow from "../../assets/checkout/arrow-down.svg";
import { customerOptions } from "../../utils/const";
import ReCAPTCHA from "react-google-recaptcha";
import { submitRequestForCustomerSupport } from "../../https/generalRequests";
import { toast } from "react-toastify";

function CustomerSupport() {
  const [isExpandDropdown, setIsExpandDropwn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const recaptchaRef = useRef(null);
  const [values, setValues] = useState({
    subject: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    subject: "",
    email: "",
    message: "",
  });

  const toggleDropdown = () => {
    setIsExpandDropwn(!isExpandDropdown);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    let email = JSON.parse(user)?.email;
    if (user) {
      setValues({ ...values, email: email });
    }
  }, []);

  const onSubmit = async () => {
    const isEmailValid = isValidEmailAddress(values.email);
    try {
      if (
        values.subject === "" &&
        values.email === "" &&
        values.message === ""
      ) {
        setErrors({
          subject: "This field is required",
          email: "This field is required",
          message: "This field is required",
        });
        return;
      }
      if (values.subject === "") {
        setErrors({
          ...errors,
          subject: "This field is required",
        });
        return;
      }
      if (values.email === "") {
        setErrors({
          ...errors,
          email: "This field is required",
        });
        return;
      } else if (!isEmailValid) {
        setErrors({
          ...errors,
          email: "Email is not valid",
        });
        return;
      }
      if (values.message === "") {
        setErrors({
          ...errors,
          message: "This field is required",
        });
        return;
      }
      setLoading(true);
      const paylaod = {
        subject: values.subject,
        email: values.email,
        description: values.message,
        recaptchaToken: recaptchaToken,
      };
      const response = await submitRequestForCustomerSupport(paylaod);
      if (response.status === 200) {
        toast.success("Support ticket created");
        setValues({
          subject: "",
          email: "",
          message: "",
        });
        setRecaptchaToken("");
        recaptchaRef.current.reset();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    }
  };
  function onChange(value) {
    setRecaptchaToken(value);
  }

  return (
    <SuperMaster>
      <div className="customer-component">
        <h1 className="customer-h1">Customer Support</h1>
        <p className="customer-description">
          Expect to hear back from us within the next 24 hours. Whether you have
          queries about our services, need assistance, or simply want to chat,
          we're here for you.
        </p>
        <p className="customer-subtitle">Connect with us</p>

        <form>
          <div className="form-group row">
            <div className="col-md-6">
              <div className="floating-label">
                <input
                  type="text"
                  className="form-control custom-input"
                  required
                  placeholder="Email"
                  value={values?.email ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                  onFocus={() => setErrors({ ...errors, email: "" })}
                />
              </div>
              <div className="text-danger">
                <span>{errors.email}</span>
              </div>
            </div>

            <div className="col-md-6">
              <div
                className={`customer_card_expand ${isExpandDropdown ? "expanded" : ""
                  }`}
                onFocus={() => setErrors({ ...errors, subject: "" })}
              >
                <div
                  className="customer_card-header_dropdown"
                  onClick={toggleDropdown}
                >
                  {values?.subject.length ? (
                    <p>{values.subject}</p>
                  ) : (
                    <span>Subject</span>
                  )}
                  <img
                    src={smalDownArrow}
                    alt="Expand/Collapse Icon"
                    className={`arrow-icon ${isExpandDropdown ? "expanded" : ""
                      }`}
                  />
                </div>

                {isExpandDropdown && (
                  <div className="card-body">
                    <div className="customer_card__expand_dropwn_body">
                      {customerOptions.map((item, index) => {
                        return (
                          <>
                            <div
                              key={index}
                              className="addres_dropdown_items"
                              onClick={() => {
                                setValues({ ...values, subject: item.value });
                                setIsExpandDropwn(false);
                                setErrors({ ...errors, subject: "" });
                              }}
                            >
                              <span className="addres_dropdown_item">
                                {item.title}
                              </span>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-danger">
                <span>{errors.subject}</span>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-12">
              <div className="floating-label">
                <textarea
                  style={{
                    lineHeight: "1.8rem",
                    overflow: "hidden",
                    minHeight: 100,
                  }}
                  type="text"
                  className="form-control custom-input"
                  required
                  placeholder="Message"
                  value={values?.message ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, message: e.target.value })
                  }
                  onFocus={() => setErrors({ ...errors, message: "" })}
                />
              </div>
              <div className="text-danger">
                <span>{errors.message}</span>
              </div>
            </div>
          </div>

          <div className="form-group row">
            <div className="col-lg-6">
              <div className="customer_recaptcha">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LcgWf4nAAAAAIOc2CYxZhAz9dnhGPt9-X3yvCvC"
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <Form.Group className="mb-3 _btnContainer borderless">
                <Button
                  disabled={recaptchaToken === ""}
                  variant="primary"
                  className="_btnFlatCenter"
                  onClick={onSubmit}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" role="status" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Form.Group>
            </div>
          </div>
        </form>
      </div>
    </SuperMaster>
  );
}
export default CustomerSupport;
