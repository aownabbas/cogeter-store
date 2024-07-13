// homeScreen
const endPoints = {
  CATEGORIES: "/categories",
  ORDERS: "/orders",
  RETRY_PAYMENT: "/generate-stripe-payment-url",
  RETRY_TABBY_PAYMENT: "/generate-tabby-payment-url",
  RETRY_TAMARA_PAYMENT: "/generate-tamara-payment-url",
  UPDATE_ORDER_PAYMENT: "/place-order",
  ADDRESSES: "/addresses",
  PRODUCT_DETAILS: "/products",
  INTERESTED_PRODUCT: "/interested-products",
  WISHLISTS: "/wish-lists",
  SITE_CONTENT: "/site-contents",
  COUNTRIES_LIST: "/countries-list",
  EXCHANGE_RATES: "/exchange-rates",
  UPDATE_USER_PROFILE: "/auth/local/update-user-profile",
  GET_USER_PROFILE: "/auth/local/user-profile",
  UPDATE_PASSWORD: "/auth/local/update-password",
  COUNTRY_DELIVERY_TAXES: "/country-delivery-taxes?populate=*",
  LOGIN: "/auth/local",
  USER_REGISTER: "/auth/local/register",
  SOCIAL_USER_LOGIN: "/auth/local/social-login",
  COUPON: "promo-codes",
  BANNERS: "/banners?populate=*",
  APP_VERSION: "/app-releases?populate=*",
  // cart
  CART: "/carts",
  // customer support
  CUSTOMER_SUPPORT: "/customer-supports",
  RESET_PASSWORD: "/auth/local/reset-password",
  RESEND_EMAIL: "/auth/local/resend-email-verification",
  EMAIL_VERIFY: "/auth/local/verify-email",

  // TABBY
  TABBY: "/tabby/prescoring",
  TAMARA: "/tamara/precheck",
  PAYMENT: "/orders/place",
  ACCOUNT_SETUP: "/auth/local/account/setup",
  APPLE_LOGIN: ""
};
export default endPoints;
