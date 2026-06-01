// frontend/src/utils/api.js
// ONE place for the base URL. All components import from here.
// Vite picks the right .env file automatically:
//   npm run dev   → uses .env.development → http://localhost:5000
//   npm run build → uses .env.production  → your Render URL

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the JWT token automatically to every request
// so you don't have to add headers manually in every component
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Helper to build headers that include the bookid
// Usage: api.put("/api/v1/add-book-to-cart", {}, { headers: bookHeader(id) })
export const bookHeader = (bookId) => ({ bookid: bookId });

export default api;
