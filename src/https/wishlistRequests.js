import client from ".";
import endPoints from "./endPoints";

export const getAllWishlistProducts = async ({ limit = 10, page }) => {
  return await client.get(`${endPoints.WISHLISTS}?limit=${limit}&page=${page}`);
};

export const addProductToWishList = async ({ data }) => {
  return await client.post(endPoints.WISHLISTS, data);
};

export const removeProductFromWishList = async ({ id }) => {
  return await client.delete(`${endPoints.WISHLISTS}/${id}`);
};
