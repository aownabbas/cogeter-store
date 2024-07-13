import React, { useEffect, useState } from "react";
import "./style.css";
import SuperMaster from "../../layouts/SuperMaster";
import { Button, Form, Spinner } from "react-bootstrap";
import { errorRequestHandel, validatePassword } from "../../utils/helperFile";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { onResetPassword } from "../../https/authentication";
import { toast } from "react-toastify";

const ResetPasswordViaEmailLink = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const email = queryParams.get("email");
  const token = params?.token?.trim();
  const [values, setValues] = useState({
    password: "",
    repeatPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    repeatPassword: "",
    validate: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const isValidPassword = validatePassword(values.repeatPassword);
    if (values.password === "" && values.repeatPassword === "") {
      setErrors({
        password: "This field is required",
        repeatPassword: "This field is required",
      });
      return;
    }
    if (values.password !== values.repeatPassword) {
      setErrors({
        ...errors,
        repeatPassword: "Password does not matched",
      });
      return;
    }
    if (isValidPassword.length > 0) {
      setErrors({ ...errors, validate: isValidPassword.join("\n") });
      return;
    }
    try {
      setLoading(true);
      const payload = {
        email: email,
        code: token,
        password: values.repeatPassword,
      };
      const response = await onResetPassword(payload);
      if (response.status === 200) {
        toast.success("Password updated");
        navigate("/");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      errorRequestHandel({ error: error });
    }
  };

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);
  const toggleCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  const toggleRepeatedPassword = () => {
    setShowRepeatedPassword(!showRepeatedPassword);
  };

  return (
    <SuperMaster>
      <div className="customer-component">
        <h1 className="customer-h1">Password Reset</h1>
        <p className="customer-subtitle">Create a strong password</p>
        <form>
          <div className="form-group row">
            <div className="col-md-6">
              <div className="floating-label input-container">
                <span className="input-icon">
                  {showCurrentPassword == false ? (
                    <img
                      className="_cursor_pointer"
                      onClick={() => toggleCurrentPassword()}
                      src="/imgs/icons/hidePassword.png"
                      alt="Icon"
                      width={15}
                      height={15}
                    />
                  ) : (
                    <img
                      className="_cursor_pointer"
                      onClick={() => toggleCurrentPassword()}
                      src="/imgs/icons/eyeIcon.png"
                      alt="Icon"
                      width={15}
                      height={15}
                    />
                  )}
                </span>
                <input
                  type={showCurrentPassword == true ? "text" : "Password"}
                  className="form-control custom-input"
                  required
                  placeholder="Password"
                  value={values?.password ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
                  }
                  onFocus={() => setErrors({ ...errors, password: "" })}
                />
              </div>
              <div className="text-danger">
                <span>{errors.password}</span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="floating-label input-container">
                <span className="input-icon">
                  {showRepeatedPassword == false ? (
                    <img
                      className="_cursor_pointer"
                      onClick={() => toggleRepeatedPassword()}
                      src="/imgs/icons/hidePassword.png"
                      alt="Icon"
                      width={15}
                      height={15}
                    />
                  ) : (
                    <img
                      className="_cursor_pointer"
                      onClick={() => toggleRepeatedPassword()}
                      src="/imgs/icons/eyeIcon.png"
                      alt="Icon"
                      width={15}
                      height={15}
                    />
                  )}
                </span>
                <input
                  type={showRepeatedPassword == true ? "text" : "Password"}
                  className="form-control custom-input"
                  required
                  placeholder="Repeat Password"
                  value={values?.repeatPassword ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, repeatPassword: e.target.value })
                  }
                  onFocus={() => setErrors({ ...errors, repeatPassword: "" })}
                />
              </div>
              <div className="text-danger">
                <span>
                  {errors.validate ? errors.validate : errors.repeatPassword}
                </span>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-6"></div>
            <div className="col-md-6">
              <Form.Group className="mb-3 _btnContainer borderless">
                <Button
                  onClick={onSubmit}
                  variant="primary"
                  className="_btnFlatCenter _checkoutBtn"
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
};

export default ResetPasswordViaEmailLink;
