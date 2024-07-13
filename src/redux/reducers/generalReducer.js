import { GET_SITE_CONTENT } from "../../actionTypes/Index";
import {
  COUNTRY_DELIVERY_TAXES,
  EXCHANGE_RATES,
  GET_BANNERS,
  GET_COUNTRIES_LIST,
  PHONE_NUMBER_SET,
} from "../actions/generalActions";

const initialState = {
  siteContent: [],
  countryList: [],
  exchangeRates: [],
  countryDeliveryTaxes: [],
  banners: [],
  isPhoneNumberSet: false,
};

export default function generalReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SITE_CONTENT:
      return {
        ...state,
        siteContent: action.payload,
      };
    case GET_COUNTRIES_LIST:
      // localStorage.setItem("countries", action.payload);
      return {
        ...state,
        countryList: action.payload,
      };
    case EXCHANGE_RATES:
      return {
        ...state,
        exchangeRates: action.payload,
      };
    case COUNTRY_DELIVERY_TAXES:
      return {
        ...state,
        countryDeliveryTaxes: action.payload,
      };
    case GET_BANNERS:
      return {
        ...state,
        banners: action.payload,
      };
    case PHONE_NUMBER_SET:
      return {
        ...state,
        isPhoneNumberSet: action.payload,
      };
    default:
      return state;
  }
}
