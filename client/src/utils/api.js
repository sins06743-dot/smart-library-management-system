import axios from "axios";

// Axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // Send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
