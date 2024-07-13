import client from ".";
import endPoints from "./endPoints";
import { v4 as uuidv4 } from "uuid";


export const listAllCartItems = async (isLoggIn) => {
  let params = "";
  if (!isLoggIn) {
    const session_id = await getSessionId();
    params = `?session_id=${session_id}`;
  }
  return await client.get(`${endPoints.CART}${params}`);
};
export const onAddItemToCart = async (payload) => {
  payload.session_id = await getSessionId();
  return await client.post(`${endPoints.CART}/item`, payload);
};

export const onRemoveItemFromCart = async (payload) => {
  payload.session_id = await getSessionId();
  return await client.post(`${endPoints.CART}/item`, payload);
};

export const onIncrementItemQuantityInCart = async (payload) => {
  payload.session_id = await getSessionId();

  return await client.post(`${endPoints.CART}/item`, payload);
};

export const onDecrementItemQuantityInCart = async (payload) => {
  payload.session_id = await getSessionId();
  return await client.post(`${endPoints.CART}/item`, payload);
};

const getSessionId = async () => {
  let sessionId = localStorage.getItem("session_id");
  // If there's no session_id in the localStorage, generate a new one and save it
  if (sessionId === undefined || sessionId === "" || sessionId === null) {
    sessionId = uuidv4();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
};
