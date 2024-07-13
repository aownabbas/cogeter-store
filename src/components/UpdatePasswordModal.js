import React, { useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { errorRequestHandel, validatePassword } from "../utils/helperFile";
import { updatePasswordApi } from "../https/current-user";
import { _toggleOverylay } from "../redux/actions/settingsAction";
import CloseIcon from "../assets/icons/close-circle.svg";

function UpdatePasswordModal({ isUpdatePassword, setIsUpdatePassword }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
    validate: "",
  });
  const fetch_authentication = useSelector((state) => state.authentication);

  useEffect(() => {
    if (isUpdatePassword) {
      let code = fetch_authentication?.payload?.code;
      let data = fetch_authentication?.payload?.data;
      if (code == "ERR_BAD_REQUEST") {
        toast.error(
          fetch_authentication?.payload?.response?.data?.error?.message
        );
      } else if (data?.jwt) {
        toast.success("Your session has been expired, please login");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }, [fetch_authentication, dispatch]);

  const updatePassword = async () => {
    const { currentPassword, newPassword, repeatPassword } = values;
    const isValidPassword = validatePassword(values.newPassword);

    if (currentPassword === "" || newPassword === "" || repeatPassword === "") {
      setErrors({
        currentPassword: "This field is required",
        newPassword: "This field is required",
        repeatPassword: "This field is required",
      });
      return;
    }
    if (newPassword !== repeatPassword) {
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
      let user = localStorage.getItem("user");
      let email = JSON.parse(user)?.email;
      let data = {
        new_password: values.newPassword,
        password: values.currentPassword,
        email: email,
      };

      setLoading(true);
      const response = await updatePasswordApi(data);
      if (response.status === 200) {
        toast.success("Password updated");
        setIsUpdatePassword(false);
        dispatch(_toggleOverylay(false));
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    } finally {
      setLoading(false);
    }
  };

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);
  const toggleCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  const toggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleRepeatedPassword = () => {
    setShowRepeatedPassword(!showRepeatedPassword);
  };

  return (
    <>
      <div
        id="registrationModal"
        className={isUpdatePassword ? "fadeIn" : "fadeOut"}
      >
        <form>
          <div className="_header">
            <div>
              <h4>Update Password</h4>
            </div>
            {/* <div className="_close">
              <span
                className="fa fa-close"
                onClick={() => {
                  setIsUpdatePassword(false);
                  dispatch(_toggleOverylay(false));
                }}
              ></span>
            </div> */}
            <div className="_close">
              <img
                className="_cursor_pointer"
                onClick={() => {
                  setIsUpdatePassword(false);
                  dispatch(_toggleOverylay(false));
                }}
                src={CloseIcon}
                alt="icons"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-12">
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
                  placeholder="Current Password"
                  value={values?.currentPassword ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, currentPassword: e.target.value })
                  }
                  onFocus={() => setErrors({ ...errors, currentPassword: "" })}
                />
              </div>
            </div>
          </div>
          <div className="text-danger">
            <span>{errors.currentPassword}</span>
          </div>
          <div className="form-group row">
            <div className="col-md-12">
              <div className="floating-label input-container">
                <span className="input-icon">
                  {showNewPassword == false ? (
                    <img
                      className="_cursor_pointer"
                      onClick={() => toggleNewPassword()}
                      src="/imgs/icons/hidePassword.png"
                      alt="Icon"
                      width={15}
                      height={15}
                    />
                  ) : (
                    <img
                      className="_cursor_pointer"
                      onClick={() => toggleNewPassword()}
                      src="/imgs/icons/eyeIcon.png"
                      alt="Icon"
                      width={15}
                      height={15}
                    />
                  )}
                </span>
                <input
                  type={showNewPassword == true ? "text" : "Password"}
                  className="form-control custom-input"
                  required
                  placeholder="New Password"
                  value={values?.newPassword ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, newPassword: e.target.value })
                  }
                  onFocus={() =>
                    setErrors({ ...errors, newPassword: "", validate: "" })
                  }
                />
              </div>
            </div>
          </div>
          <div className="text-danger">
            <span>{errors.newPassword}</span>
          </div>
          <div className="form-group row">
            <div className="col-md-12">
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
                  onFocus={() =>
                    setErrors({ ...errors, repeatPassword: "", validate: "" })
                  }
                />
              </div>
            </div>
          </div>
          <div className="text-danger">
            <span>
              {errors.repeatPassword ? errors.repeatPassword : errors.validate}
            </span>
          </div>
          <Form.Group className="mb-3 _btnContainer">
            <Button
              variant="primary"
              className="_btnFlatCenter"
              onClick={updatePassword}
            >
              {loading ? (
                <Spinner animation="border" size="sm" role="status" />
              ) : (
                "Update Password"
              )}
            </Button>
          </Form.Group>
        </form>
      </div>
    </>
  );
}
export default UpdatePasswordModal;
