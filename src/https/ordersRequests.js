import client from ".";
import endPoints from "./endPoints";

export const getOrdersList = async ({ limit = 10, page }) => {
  return await client.get(`${endPoints.ORDERS}?limit=${limit}&page=${page}`);
};

export const getOrdersDetails = async (id) => {
  return await client.get(`${endPoints.ORDERS}/${id}`);
};

export const retryPayment = async (id, payment_type) => {
  const endPoint =
    payment_type == "Card"
      ? endPoints.RETRY_PAYMENT
      : payment_type === "TAMARA"
      ? endPoints.RETRY_TAMARA_PAYMENT
      : endPoints.RETRY_TABBY_PAYMENT;
  return await client.get(`${endPoint}/${id}`);
};

export const updatePaymentStatus = async (id) => {
  return await client.get(
    `${endPoints.UPDATE_ORDER_PAYMENT}?order_identifier=${id}`
  );
};

export const createOrder = async (payload) => {
  return await client.post(endPoints.ORDERS, payload);
};

export const checkTabby = async (payload) => {
  return await client.post(endPoints.TABBY, payload);
};
export const checkTamara = async (payload) => {
  return await client.post(endPoints.TAMARA, payload);
};

export const applyCouponCode = async ({ code }) => {
  return await client.get(`${endPoints.COUPON}?code=${code}`);
};
