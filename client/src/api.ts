import axios from "axios";

// Configure once, reuse everywhere.
const API_BASE_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🔑 include cookies for auth
});
