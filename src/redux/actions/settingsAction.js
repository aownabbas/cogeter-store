export const CHANGE_COUNTRY = "CHANGE_COUNTRY";
export const TOGGLE_OVERLAY = "TOGGLE_OVERLAY";
export const IS_LOGIN_MODAL = "IS_LOGIN_MODAL";

export const _setCountry = (country) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_COUNTRY,
      payload: country,
    });
  };
};

export const _toggleOverylay = (toggle) => {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_OVERLAY,
      payload: toggle,
    });
  };
};
export const _toggleLoginModal = (toggle) => {
  return (dispatch) => {
    dispatch({
      type: IS_LOGIN_MODAL,
      payload: toggle,
    });
  };
};
