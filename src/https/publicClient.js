import axios from "axios";

let headers = {};

const publicClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers,
});
publicClient.interceptors.request.use(
  async (config) => {
    config.headers.Accept = "application/json";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default publicClient;
