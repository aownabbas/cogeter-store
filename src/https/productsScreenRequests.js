import client from ".";
import endPoints from "./endPoints";
import publicClient from "./publicClient";

export const getAllProducts = async ({
  categoryId = "",
  search = "",
  sort = "",
  color = "",
  size = "",
  limit = 10,
  page,
}) => {

  let _url = "";
  if (categoryId !== "") {
    _url = `/categories/products/${categoryId}`;
  }
  else {
    _url = `/products`;
  }
  return await client.get(
    `${_url}?sort=${sort}&color=${color}&size=${size}&search=${search}&limit=${limit}&page=${page}`
  );
};

export const getProductDetails = async ({ productId }) => {
  return await client.get(`${endPoints.PRODUCT_DETAILS}/${productId}`);
};

export const getProductsYouMayInterested = async () => {
  return await client.get(endPoints.INTERESTED_PRODUCT);
};
