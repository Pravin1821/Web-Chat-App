import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Optional helper functions (you can still use fetch if you want)
export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", {
    usernameOrEmail: email,
    password,
  });
  return res.data;
};

export const fetchMessages = async () => {
  const res = await api.get("/messages");
  return res.data;
};

export default api;
