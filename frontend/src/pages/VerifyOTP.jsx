// frontend/src/pages/VerifyOTP.jsx
import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email    = location.state?.email || "";

  const [otp,     setOtp]     = useState("");
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/v1/verify-otp", { email, otp });
      setSuccess("Email verified! Redirecting to sign in...");
      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="bg-zinc-800 rounded-2xl p-8 w-full max-w-sm border border-zinc-700 text-center">
        <div className="text-4xl mb-3">📧</div>
        <h1 className="text-2xl font-bold text-white mb-1">Verify your Email</h1>
        <p className="text-zinc-400 text-sm mb-6">
          We sent a 6-digit OTP to <strong className="text-white">{email}</strong>.<br />
          Enter it below to activate your account.
        </p>

        {error   && <p className="bg-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg mb-4">{error}</p>}
        {success && <p className="bg-green-500/20 text-green-400 text-sm px-4 py-2 rounded-lg mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            required
            className="w-full bg-zinc-700 text-white text-center text-xl tracking-widest rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-zinc-500 text-xs mt-4">
          Wrong email?{" "}
          <Link to="/sign-up" className="text-blue-400 hover:underline">Go back</Link>
        </p>
      </div>
    </div>
  );
}
