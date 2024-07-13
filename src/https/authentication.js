import client from ".";
import endPoints from "./endPoints";

export const userLogin = async (payload) => {
  const session_id = localStorage.getItem("session_id");
  if (session_id) {
    payload.session_id = session_id;
  }
  return await client.post(`${endPoints.LOGIN}`, payload);
};

export const userRegister = async (payload) => {
  const session_id = localStorage.getItem("session_id");
  if (session_id) {
    payload.session_id = session_id;
  }
  return await client.post(`${endPoints.USER_REGISTER}`, payload);
};

export const onForGotPassword = async (payload) => {
  return await client.post("/auth/local/forgot-password", payload);
};

export const onResetPassword = async (payload) => {
  return await client.post(endPoints.RESET_PASSWORD, payload);
};

export const onResendEmailVerification = async () => {
  return await client.post(endPoints.RESEND_EMAIL);
};
export const onEmailVerification = async (payload) => {
  return await client.post(endPoints.EMAIL_VERIFY, payload);
};

export const loginWithSocialAccount = async (payload) => {
  const session_id = localStorage.getItem("session_id");
  if (session_id) {
    payload.session_id = session_id;
  }
  return await client.post(endPoints.SOCIAL_USER_LOGIN, payload);
};

export const onAccountSetup = async (payload) => {
  return await client.post(endPoints.ACCOUNT_SETUP, payload);
};

export const onAppleLogin = async (payload) => {
  return await client.post(endPoints.APPLE_LOGIN, payload);
};
