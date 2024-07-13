import { toast } from "react-toastify";
import { Store } from "../store/configureStore";
import { ASSET_URL } from "./const";
import copy from "copy-to-clipboard";
import { _logout } from "../redux/actions/authentication";
import { _clearCartItems } from "../redux/actions/product";
import { _phoneNumberSet } from "../redux/actions/generalActions";

export const errorRequestHandel = ({ error }) => {
  // toast.error(error.message);
  if (error?.response?.status === 422) {
    const err = error.response.data.errors;
    toast.error(err[Object.keys(err)[0]]);
  } else if (error?.response?.status === 400) {
    toast.error(error?.response?.data?.message ?? error?.response?.data?.error);
  } else if (error?.response?.status === 401) {
    Store.dispatch(_logout());
    Store.dispatch(_clearCartItems());
    Store.dispatch(_phoneNumberSet(false));
    window.location.href = "/";
  } else if (error?.response?.status === undefined) {
    toast.error("Server down temporarily");
  } else {
    toast.error(error?.response?.data?.message ?? error?.response?.data?.error);
  }
  return null;
};

// Function to convert between currencies
export const getCurrencyMultiplier = (_exchangeRates, userCurrency) => {
  let _rateMultiplier = 1;
  if (userCurrency !== "AED") {
    const _obj = _exchangeRates?.find(
      (item) => item.toCurrency === userCurrency
    );
    if (_obj) {
      _rateMultiplier = _obj.rate;
    }
  }
  return _rateMultiplier;
};

export const formatRichText = (htmlContent) => {
  let convertedContent = "";
  if (
    htmlContent !== null &&
    htmlContent !== undefined &&
    !Array.isArray(htmlContent)
  ) {
    convertedContent = htmlContent?.replace(/\n/g, "  \n");
  }
  return convertedContent;
};

export const formatDecimal = (number) => {
  if (typeof number === 'number') {
  const formattedNumber = number?.toFixed(2);
  if (parseFloat(formattedNumber) === Math.floor(number)) {
    return Math.floor(number).toString();
  }
  return formattedNumber;
}
};

// Function to convert between currencies

export const addPreFixToMediaUrl = (url) => {
  if (url === null) {
    return "/imgs/no_img.png";
  }
  return url;
  // if (url !== null && url !== "" && url !== undefined) {
  //   if (url.startsWith("https://")) {
  //     return url; // If URL already starts with "https://", return as is
  //   } else {
  //     return ASSET_URL + url; // Add the prefix if URL doesn't start with "https://"
  //   }
  // }
  // return url;
};

export const toNumber = (value) => {
  if (value === null) return 0;
  const number = Number(value);
  return isNaN(number) ? 0 : number;
};

export const convertToTitleCase = (value) => {
  return value.replace(/_/g, " ").toUpperCase();
};

export const cartItemsSummary = (
  sameDayShipping,
  cashPayment,
  discount,
  cartItems,
  selectedCountryDeliveryTaxes,
  rateMultiplier
) => {
  let subTotal = 0;
  let saleItemsTotal = 0;
  let noOfItems = 0;
  cartItems?.forEach((item) => {
    if (item.onSale) {
      saleItemsTotal += item.quantity * item.salePrice;
    }
    subTotal +=
      item.quantity * (item.onSale ? item.salePrice : item.regularPrice);
    noOfItems = noOfItems + item.quantity;
  });
  let codFee = 0;
  if (cashPayment) {
    codFee = selectedCountryDeliveryTaxes?.cod_fee; // Add 10 for cash payment
  }

  // Calculate the discount amount based on the discount type
  let discountAmount = 0;
  if (discount.type === "Percentage") {
    discountAmount = ((subTotal - saleItemsTotal) * discount.value) / 100;
  } else if (discount.type === "Fixed") {
    discountAmount = discount.value;
  }

  // Calculate delivery charges based on country and shipping type
  let standardDeliveryCharges = 0; // Initial delivery charges
  let sameDayDeliveryCharges = 0; // Initial delivery charges

  let pickAndPackFee = selectedCountryDeliveryTaxes?.pick_n_pack_fee ?? 0; // minimum pick and pack fees
  if (subTotal < selectedCountryDeliveryTaxes?.free_shipping_threshold) {
    sameDayDeliveryCharges +=
      selectedCountryDeliveryTaxes?.same_day_delivery_fee; // Add 30 for same day shipping
    standardDeliveryCharges +=
      selectedCountryDeliveryTaxes?.standard_delivery_fee;

    const totalTaxPercentage =
      selectedCountryDeliveryTaxes?.government_export_tax_percentage +
      selectedCountryDeliveryTaxes?.fuel_surcharge_percentage;
    standardDeliveryCharges +=
      standardDeliveryCharges * (totalTaxPercentage / 100);
    sameDayDeliveryCharges +=
      sameDayDeliveryCharges * (totalTaxPercentage / 100);

    if (noOfItems > 4) {
      // if increases than 5 items, for each item keep on adding 1 aed
      pickAndPackFee = pickAndPackFee + (noOfItems - 4);
    }
    standardDeliveryCharges += pickAndPackFee; // depoter pick and pack
    sameDayDeliveryCharges += pickAndPackFee; // depoter pick and pack
  }
  // Calculate the total amount with discounts, delivery charges, and tax
  let totalAmount =
    subTotal + standardDeliveryCharges + codFee - discountAmount;
  if (sameDayShipping) {
    totalAmount = subTotal + sameDayDeliveryCharges + codFee - discountAmount;
  }

  return {
    subTotal: formatDecimal(subTotal * rateMultiplier),
    totalAmount: formatDecimal(totalAmount * rateMultiplier),
    discountAmount: formatDecimal(discountAmount * rateMultiplier),
    standardDeliveryCharges: formatDecimal(
      standardDeliveryCharges * rateMultiplier
    ),
    sameDayDeliveryCharges: formatDecimal(
      sameDayDeliveryCharges * rateMultiplier
    ),
    codFee: formatDecimal(codFee * rateMultiplier),
  };
};

export const isValidEmailAddress = (email) => {
  let pattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  var p = password,
    errors = [];
  if (p.length < 8) {
    errors.push("Password must be 8 charactor long");
  }
  if (p.search(/[a-z]/i) < 0) {
    errors.push("Your password must contain one letter");
  }
  if (p.search(/[0-9]/) < 0) {
    errors.push("Your password must contain one digit");
  }
  return errors;
};

export const openExternalLinks = (link) => {
  if (!link.startsWith("https://") && !link.startsWith("http://")) {
    link = `https://${link}`;
  }
  window.open(link, "_blank");
};

export const openWhatsApp = (phoneNumber) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  window.open(whatsappUrl, "_blank");
};

export const copyToClicpBoard = (link) => {
  copy(link);
  toast.success("Copied");
};
