// frontend/src/stores/authSlice.js
// Manages authentication state across the whole app using Redux.

import { createSlice } from "@reduxjs/toolkit";

// On page load, try to restore session from localStorage
const storedUser  = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const storedRole  = localStorage.getItem("role");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: !!storedToken,
    token:      storedToken || null,
    role:       storedRole  || "user",
    user:       storedUser  ? JSON.parse(storedUser) : null,
  },
  reducers: {
    // Called after successful login
    login(state, action) {
      const { token, user } = action.payload;
      state.isLoggedIn = true;
      state.token      = token;
      state.role       = user.role;
      state.user       = user;

      // Persist to localStorage so session survives page refresh
      localStorage.setItem("token", token);
      localStorage.setItem("role",  user.role);
      localStorage.setItem("id",    user.id);
      localStorage.setItem("user",  JSON.stringify(user));
    },
    // Called on logout
    logout(state) {
      state.isLoggedIn = false;
      state.token      = null;
      state.role       = "user";
      state.user       = null;

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("id");
      localStorage.removeItem("user");
    },
    // Called after fetching fresh user info from the API
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
