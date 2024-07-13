import client from ".";
import endPoints from "./endPoints";

export const paymentImplementation = async (data) => {
  return await client.post(`${endPoints.PAYMENT}`, data);
};
