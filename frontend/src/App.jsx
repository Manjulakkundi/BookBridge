// frontend/src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./stores/authSlice";
import api from "./utils/api";

// Layout
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

// Pages
import Home             from "./pages/Home";
import AllBooks         from "./pages/AllBooks";
import ViewBookDetails  from "./pages/ViewBookDetails";
import Cart             from "./pages/Cart";
import Favourites       from "./pages/Favourites";
import Profile          from "./pages/Profile";
import SignUp           from "./pages/SignUp";
import SignIn           from "./pages/SignIn";
import VerifyOTP        from "./pages/VerifyOTP";
import OrderHistory     from "./pages/OrderHistory";
import AllOrders        from "./pages/AllOrders";
import AddBook          from "./pages/AddBook";
import UpdateBook       from "./pages/UpdateBook";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/sign-in" replace />;
};

const AdminRoute = ({ children }) => {
  const { isLoggedIn, role } = useSelector((s) => s.auth);
  if (!isLoggedIn) return <Navigate to="/sign-in" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const dispatch   = useDispatch();
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);

  // On app load, fetch fresh user data if a token exists
  useEffect(() => {
    if (isLoggedIn) {
      api.get("/api/v1/get-user-information")
        .then((res) => dispatch(setUser(res.data)))
        .catch(() => {}); // silently ignore — user might have expired token
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/"              element={<Home />} />
          <Route path="/all-books"     element={<AllBooks />} />
          <Route path="/book/:id"      element={<ViewBookDetails />} />
          <Route path="/sign-up"       element={<SignUp />} />
          <Route path="/sign-in"       element={<SignIn />} />
          <Route path="/verify-otp"    element={<VerifyOTP />} />

          {/* Protected user routes */}
          <Route path="/cart"          element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/favourites"    element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
          <Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />

          {/* Admin-only routes */}
          <Route path="/all-orders"    element={<AdminRoute><AllOrders /></AdminRoute>} />
          <Route path="/add-book"      element={<AdminRoute><AddBook /></AdminRoute>} />
          <Route path="/update-book/:id" element={<AdminRoute><UpdateBook /></AdminRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
