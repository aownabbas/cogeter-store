import client from ".";
import endPoints from "./endPoints";

export const getHomeScreenData = async () => {
  return await client.get(`${endPoints.CATEGORIES}`);
};
