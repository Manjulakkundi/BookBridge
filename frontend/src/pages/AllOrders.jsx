// frontend/src/pages/AllOrders.jsx  (admin only)
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import api from "../utils/api";

const STATUSES = ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_COLORS = {
  "Order Placed": "bg-blue-500/20 text-blue-400",
  "Processing":   "bg-yellow-500/20 text-yellow-400",
  "Shipped":      "bg-purple-500/20 text-purple-400",
  "Delivered":    "bg-green-500/20 text-green-400",
  "Cancelled":    "bg-red-500/20 text-red-400",
};

export default function AllOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg,     setMsg]     = useState("");

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  useEffect(() => {
    api.get("/api/v1/get-all-orders")
      .then((res) => setOrders(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await api.put(`/api/v1/update-order-status/${orderId}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: res.data.data.status } : o))
      );
      notify("Status updated.");
    } catch (e) {
      notify("Failed to update status.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {msg && <div className="fixed top-20 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">{msg}</div>}

      <h1 className="text-3xl font-bold text-white mb-2">All Orders</h1>
      <p className="text-zinc-500 text-sm mb-8">{orders.length} total orders</p>

      {orders.length === 0 ? (
        <p className="text-zinc-500 text-center py-20">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
              <div className="flex items-center gap-4">
                <img
                  src={order.book?.url}
                  alt={order.book?.title}
                  className="w-12 h-16 object-cover rounded-lg"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/60x80?text=?"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{order.book?.title}</p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Customer: <span className="text-zinc-300">{order.user?.username || "Unknown"}</span>
                  </p>
                  <p className="text-zinc-500 text-xs">{order.user?.email}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-green-400 font-bold text-sm">₹{order.book?.price}</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="bg-zinc-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
