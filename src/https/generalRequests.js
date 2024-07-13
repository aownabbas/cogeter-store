import client from ".";
import endPoints from "./endPoints";

export const getSiteContent = async () => {
  return await client.get(`${endPoints.SITE_CONTENT}`);
};

export const getBanners = async () => {
  return await client.get(`${endPoints.BANNERS}`);
};

export const getAllCountryList = async () => {
  return await client.get(endPoints.COUNTRIES_LIST);
};

export const getExchangeRates = async () => {
  return await client.get(endPoints.EXCHANGE_RATES);
};

export const getCountryDeliveryTaxes = async () => {
  return await client.get(`${endPoints.COUNTRY_DELIVERY_TAXES}`);
};

export const checkAppVersion = async () => {
  return await client.get(endPoints.APP_VERSION);
};

export const submitRequestForCustomerSupport = async (data) => {
  return await client.post(endPoints.CUSTOMER_SUPPORT, data);
};
