import axios from "axios";

let headers = {};

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers,
});
client.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token && token !== "") {
      config.headers.Authorization = "Bearer " + token;
    }
    config.headers.Accept = "application/json";
    // config.headers.ContentType = "application/json";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default client;
