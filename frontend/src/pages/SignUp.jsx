// frontend/src/pages/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "", email: "", password: "", address: "", phoneNumber: "",
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/v1/sign-up", form);
      // Pass email to verify-otp page so it knows which email to verify
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.message
        || err.response?.data?.message
        || "Sign-up failed. Please try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="bg-zinc-800 rounded-2xl p-8 w-full max-w-md border border-zinc-700">
        <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
        <p className="text-zinc-400 text-sm mb-6">Join BookBridge and start your reading journey</p>

        {error && <p className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm px-4 py-2 rounded-lg mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "username",    label: "Username",     type: "text",     placeholder: "At least 4 characters" },
            { name: "email",       label: "Email",        type: "email",    placeholder: "you@example.com" },
            { name: "password",    label: "Password",     type: "password", placeholder: "At least 6 characters" },
            { name: "phoneNumber", label: "Phone Number", type: "text",     placeholder: "10-digit number" },
            { name: "address",     label: "Address",      type: "text",     placeholder: "Your delivery address" },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="text-zinc-300 text-sm block mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="w-full bg-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition mt-2"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-zinc-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-blue-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
