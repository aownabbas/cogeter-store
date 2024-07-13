export const GET_SITE_CONTENT = "GET_SITE_CONTENT";
export const GET_COUNTRIES_LIST = "GET_COUNTRIES_LIST";
export const SET_COUNTRY_ITEM = "SET_COUNTRY_ITEM";
export const EXCHANGE_RATES = "EXCHANGE_RATES";
export const COUNTRY_DELIVERY_TAXES = "COUNTRY_DELIVERY_TAXES";
export const GET_BANNERS = "GET_BANNERS";
export const PHONE_NUMBER_SET = "PHONE_NUMBER_SET";

export const _getSiteContent = (data) => {
  return (dispatch) => {
    dispatch({
      type: GET_SITE_CONTENT,
      payload: data,
    });
  };
};

export const _getCountriesList = (data) => {
  return (dispatch) => {
    dispatch({
      type: GET_COUNTRIES_LIST,
      payload: data,
    });
  };
};

export const _getExchangeRates = (data) => {
  return (dispatch) => {
    dispatch({
      type: EXCHANGE_RATES,
      payload: data,
    });
  };
};

export const _getCountryDeliveryTaxes = (data) => {
  return (dispatch) => {
    dispatch({
      type: COUNTRY_DELIVERY_TAXES,
      payload: data,
    });
  };
};

export const _getBanners = (data) => {
  return (dispatch) => {
    dispatch({
      type: GET_BANNERS,
      payload: data,
    });
  };
};

export const _phoneNumberSet = (isNumberSet) => {
  return {
    type: PHONE_NUMBER_SET,
    payload: isNumberSet,
  };
};
