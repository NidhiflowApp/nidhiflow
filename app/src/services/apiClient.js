import axios from "axios";
import authService from "./authService";

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://nidhiflow-backend.onrender.com/api";

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* Attach token automatically */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* Handle global errors (401 auto logout) */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      authService.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;