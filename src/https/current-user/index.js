import client from "../index";
import endPoints from "../endPoints"

export const updateUserProfileApi = async (payload) => {
  return await client.post(endPoints.UPDATE_USER_PROFILE, payload);
};

export const getUserProfileApi = async () => {
  return await client.get(endPoints?.GET_USER_PROFILE);
};

export const updatePasswordApi = async (payload) => {
  return await client.post(endPoints.UPDATE_PASSWORD, payload);
};
