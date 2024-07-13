import client from ".";
import endPoints from "./endPoints";

export const getAddressesList = async ({ limit = 10, page }) => {
  return await client.get(`${endPoints.ADDRESSES}?limit=${limit}&page=${page}`);
};

export const updateAddress = async ({ data, id }) => {
  return await client.put(`${endPoints.ADDRESSES}/${id}`, data);
};
export const addNewAddress = async ({ data }) => {
  return await client.post(`${endPoints.ADDRESSES}`, data);
};
export const deleteAddress = async ({ id }) => {
  return await client.delete(`${endPoints.ADDRESSES}/${id}`);
};
