// frontend/src/pages/Profile.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";

export default function Profile() {
  const user = useSelector((s) => s.auth.user);

  const [address, setAddress] = useState(user?.address || "");
  const [msg,     setMsg]     = useState("");
  const [saving,  setSaving]  = useState(false);

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/v1/update-address", { address });
      notify("Address updated successfully.");
    } catch (e) {
      notify("Failed to update address.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      {msg && <div className="fixed top-20 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">{msg}</div>}

      <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

      <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <img src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/6915/6915987.png"}
            alt="avatar" className="w-16 h-16 rounded-full object-cover border-2 border-zinc-600" />
          <div>
            <p className="text-white font-semibold text-lg">{user?.username}</p>
            <p className="text-zinc-400 text-sm">{user?.email}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${user?.role === "admin" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-zinc-700 pb-2">
            <span className="text-zinc-400">Phone</span>
            <span className="text-white">{user?.phoneNumber || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Member since</span>
            <span className="text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
          </div>
        </div>
      </div>

      {/* Update Address */}
      <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700">
        <h2 className="text-white font-semibold mb-4">Update Address</h2>
        <form onSubmit={handleUpdateAddress} className="space-y-4">
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full bg-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm px-5 py-2 rounded-lg transition"
          >
            {saving ? "Saving..." : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
}
