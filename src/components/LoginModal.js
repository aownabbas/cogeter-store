import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";
import RegistrationModal from "./RegistrationModal";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "../assets/icons/close-circle.svg";
import { loginWithSocialAccount, userLogin } from "../https/authentication";
import { _login } from "../redux/actions/authentication";
import { errorRequestHandel, isValidEmailAddress } from "../utils/helperFile";
import {
  _toggleLoginModal,
  _toggleOverylay,
} from "../redux/actions/settingsAction";
import { listAllCartItems } from "../https/cartRequests";
import { _getAllCartItems } from "../redux/actions/product";
import SocialButton from "./resuable/social-buttons/SocialButton";
import facebookIcon from "../assets/social-logins/facebook-icon.svg";
import gogoleIcon from "../assets/social-logins/gogole-icon.svg";
import appleIcon from "../assets/social-logins/apple-icon.svg";

import FacebookLogin from "react-facebook-login";
import { useGoogleLogin } from "@react-oauth/google";
import AppleLogin from "react-apple-login";
import { SOCIAL_LOGINS } from "../utils/const";
import axios from "axios";
import { toast } from "react-toastify";

function LoginModal({ loginModal, setLoginModal, fromScreen = null }) {
  const isLoginModal = useSelector((state) => state._settings.isLoginModal);
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });

  const logout = () => {
    window.FB.logout(() => {});
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registrationModal, setRegistrationModal] = useState(false);
  const openRegistrationModal = () => {
    dispatch(_toggleLoginModal(false));
    setRegistrationModal(true);
  };

  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const openForgotPasswordModal = () => {
    dispatch(_toggleLoginModal(false));
    setForgotPasswordModal(true);
  };

  const inputRefs = {
    email: useRef(null),
    password: useRef(null),
  };

  const onSubmit = async () => {
    const isEmailValid = isValidEmailAddress(values.identifier);
    if (values.identifier === "" && values.password === "") {
      setErrors({
        identifier: "This field is required",
        password: "This field is required",
      });
      return;
    }
    if (values.identifier === "") {
      setErrors({ ...errors, identifier: "This field is required" });
      inputRefs.email.current.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (values.identifier.includes(" ")) {
      setErrors({ ...errors, identifier: "Email cannot contain spaces" });
      inputRefs.email.current.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!isEmailValid) {
      setErrors({
        ...errors,
        identifier: "Email address is not valid",
      });
      inputRefs.email.current.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (values.password === "") {
      setErrors({ ...errors, password: "This field is required" });
      inputRefs.password.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (values.password.length < 6) {
      setErrors({
        ...errors,
        password: "password must be at least 6 characters",
      });
      inputRefs.password.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setLoading(true);
    try {
      const trimmedIdentifier = values.identifier.trim(); // Trim the email address
      const updatedValues = { ...values, identifier: trimmedIdentifier };
      const response = await userLogin(updatedValues);
      if (response.status === 200) {
        dispatch(_login(response.data.data));
        getCartItemsFromServer();
        setLoginModal(false);
        dispatch(_toggleOverylay(false));
        dispatch(_toggleLoginModal(false));
        setLoading(false);
        if (fromScreen !== null) {
          navigate(`/${fromScreen}`);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      setLoading(false);

      errorRequestHandel({ error: error });
    }
  };
  const getCartItemsFromServer = async () => {
    try {
      const response = await listAllCartItems(token);
      if (response.status === 200) {
        dispatch(_getAllCartItems(response.data.data));
      }
    } catch (error) {}
  };

  const responseFacebook = async (response) => {
    try {
      if (response) {
        let firstName = "";
        let lastName = "";

        if (response.name) {
          const [firstWord, ...restWords] = response?.name.split(" ");
          firstName = firstWord;
          lastName = restWords.join(" ");
        }
        const payload = {
          email: response?.email ?? response?.userID,
          username: response.email ?? response?.userID,
          first_name: firstName,
          last_name: lastName,
          phone: "",
          phone_code: "",
          auth_type: "FACEBOOK",
        };
        await loginUserWidthSocialAccounts(payload);
      }
    } catch (error) {}
  };

  const appleResponse = (response) => {
    // if (!response.error), {
    //   axios
    //     .post("/auth", response)
    //     .then((res) => this.setState({ authResponse: res.data }))
    //     .catch((err) => console.log(err));
    // }
  };

  // gogole login ****************
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) =>
      getUserGoogleProfile(tokenResponse?.access_token),
  });

  const getUserGoogleProfile = async (access_token) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const { name, email } = response.data;
      let firstName = "";
      let lastName = "";

      if (name) {
        const [firstWord, ...restWords] = name.split(" ");
        firstName = firstWord;
        lastName = restWords.join(" ");
      }
      const payload = {
        email: email,
        username: email,
        first_name: firstName,
        last_name: lastName,
        phone: "",
        phone_code: "",
        auth_type: "GOOGLE",
      };

      await loginUserWidthSocialAccounts(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const loginUserWidthSocialAccounts = async (payload) => {
    try {
      const response = await loginWithSocialAccount(payload);
      if (response.status === 200) {
        dispatch(_login(response.data.data));
        setLoginModal(false);
        dispatch(_toggleOverylay(false));
        dispatch(_toggleLoginModal(false));
        navigate("/");
        toast.success("Login success");
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };
  // gogole login end  ****************

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state) {
      // Handle the authorization code, e.g. send it to the server
    }

    // Ensure Apple's auth script is loaded
    const script = document.createElement("script");
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize Apple ID authentication
      window.AppleID.auth.init({
        clientId: "com.cogeter.store.appleLogin",
        scope: "name email",
        redirectURI: process.env.REACT_APP_WEBSITE_URL,
        state: "state",
        usePopup: true,
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const appleSignIn = () => {
    window.AppleID.auth.signIn();
  };

  const athenticatedAppleResponse = async () => {
    const authorizationCode =
      "c8b16422966604f7bac27423f408af9b6.0.rvyq.8nxOIrWEKejP9EqfTZCm3A";

    // Your client ID and secret obtained from Apple's developer portal
    const clientId = "your-client-id";
    const clientSecret = "your-client-secret";

    // The URL to exchange the code for tokens
    const tokenExchangeURL = "https://appleid.apple.com/auth/token";
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div
        // ref={ref}
        id="registrationModal"
        className={isLoginModal ? "fadeIn" : "fadeOut"}
      >
        <form>
          <div className="_header">
            <div>
              <h4>Login</h4>
              <p>Type your email address & password</p>
            </div>
            <div className="_close">
              <img
                className="_cursor_pointer"
                onClick={() => {
                  dispatch(_toggleOverylay(false));
                  dispatch(_toggleLoginModal(false));
                }}
                src={CloseIcon}
                alt="icons"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-12" ref={inputRefs.email}>
              <div className="floating-label">
                <input
                  type="email"
                  className={`form-control ${
                    errors.identifier !== ""
                      ? "custom-input-error"
                      : "custom-input"
                  }`}
                  required
                  placeholder="Email"
                  value={values?.identifier ?? ""}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      identifier: e.target.value.replace(/\s/g, ""),
                    })
                  }
                  onFocus={() => setErrors({ ...errors, identifier: "" })}
                />
              </div>
            </div>
          </div>
          <div className="text-danger">
            <span>{errors.identifier}</span>
          </div>
          <div className="form-group row">
            <div className="col-md-12" ref={inputRefs.password}>
              <div className="floating-label input-container">
                <span className="input-icon">
                  {showPassword == false ? (
                    <img
                      className="_cursor_pointer"
                      onClick={() => handleTogglePassword()}
                      src="/imgs/icons/hidePassword.png"
                      alt="Icon"
                      width={15}
                      height={15}
                    />
                  ) : (
                    <img
                      className="_cursor_pointer"
                      onClick={() => handleTogglePassword()}
                      src="/imgs/icons/eyeIcon.png"
                      alt="Icon"
                      width={15}
                      height={15}
                    />
                  )}
                </span>
                <input
                  type={showPassword == true ? "text" : "Password"}
                  className={`form-control ${
                    errors.password !== ""
                      ? "custom-input-error"
                      : "custom-input"
                  }`}
                  required
                  placeholder="Password"
                  value={values?.password ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
                  }
                  onFocus={() => setErrors({ ...errors, password: "" })}
                />
                <div></div>
              </div>
            </div>
          </div>
          <div className="text-danger">
            <span>{errors.password}</span>
          </div>

          <div className="form-group _forgotPassword mt-4">
            <Link to={"#"} onClick={openForgotPasswordModal}>
              Forgot Password ?
            </Link>
          </div>
          <Form.Group className="mb-3 _btnContainer">
            <Button
              variant="primary"
              className="_btnFlatCenter"
              onClick={onSubmit}
            >
              {loading ? (
                <Spinner animation="border" size="sm" role="status" />
              ) : (
                "Login"
              )}
            </Button>
          </Form.Group>
          <div className="social_buttons__row_container">
            <div className="social_buttons__row" />
            <div className="social_buttons__row_or">OR</div>
            <div className="social_buttons__row" />
          </div>
          <FacebookLogin
            appId={SOCIAL_LOGINS.FACEBOOK_CLIENT_ID}
            autoLoad={false}
            fields="name,email"
            onClick={() => {}} // Prevent the default click action (no-op)
            callback={responseFacebook}
            redirectUri={process.env.REACT_APP_WEBSITE_URL}
            cssClass="social_button__facebook_container"
            textButton="Continue with Facebook"
            scope="public_profile,email"
            buttonStyle={{
              fontSize: 14,
              color: "#000000",
              fontWeight: "500",
            }}
            icon={
              <div className="social_button__icon">
                <img
                  src={facebookIcon}
                  style={{
                    width: 22,
                    objectFit: "contain",
                    marginRight: "16px",
                    marginLeft: 2,
                  }}
                />
              </div>
            }
            containerStyle={{
              width: "100%",
              border: "1px solid #7089FB",
              height: 45,
              display: "flex",
              backgroundColor: "transparent",
              // marginTop: 10,
              boxShadow: "none",
              alignItems: "center",
              marginTop: 10,
            }}
          />

          <SocialButton
            title={"Continue with Google"}
            icon={gogoleIcon}
            onClick={() => googleLogin()}
          />

          {/* <AppleLogin
            clientId="com.cogeter.store.appleLogin"
            redirectURI="https://store-dev.cogeter.com/apple-login"
            callback={appleResponse} // Catch the response
            scope="email name"
            responseMode="query"
            usePopup={false}
            responseType={"code"}
            render={(
              renderProps //Custom Apple Sign in Button
            ) => (
              <SocialButton
                title={"Continue with Apple"}
                icon={appleIcon}
                onClick={renderProps.onClick}
              />
            )}
          /> */}
          {/* <SocialButton
            title={"Continue with Apple"}
            icon={appleIcon}
            onClick={appleSignIn}
          /> */}
          <Form.Group className="mb-3 _createAccountLinkContainer">
            <Link to={"#"} onClick={openRegistrationModal}>
              Don't have Cogeter.com account ?
            </Link>
          </Form.Group>
          <Form.Group className="mb-3  _btnContainer">
            <div
              onClick={openRegistrationModal}
              variant="primary"
              // className="_btnFlatCenter"
              className="_borderdButton"
            >
              Create Account
            </div>
          </Form.Group>
        </form>
      </div>
      <RegistrationModal
        registrationModal={registrationModal}
        setRegistrationModal={setRegistrationModal}
      />
      <ForgotPasswordModal
        forgotPasswordModal={forgotPasswordModal}
        setForgotPasswordModal={setForgotPasswordModal}
      />
    </>
  );
}
export default LoginModal;
