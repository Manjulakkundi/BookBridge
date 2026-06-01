// frontend/src/pages/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import api from "../utils/api";

const STATUS_COLORS = {
  "Order Placed": "bg-blue-500/20 text-blue-400",
  "Processing":   "bg-yellow-500/20 text-yellow-400",
  "Shipped":      "bg-purple-500/20 text-purple-400",
  "Delivered":    "bg-green-500/20 text-green-400",
  "Cancelled":    "bg-red-500/20 text-red-400",
};

export default function OrderHistory() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/v1/get-order-history")
      .then((res) => setOrders(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Order History</h1>

      {orders.length === 0 ? (
        <p className="text-zinc-500 text-center py-20">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-zinc-800 rounded-xl p-4 flex items-center gap-4 border border-zinc-700">
              <img
                src={order.book?.url}
                alt={order.book?.title}
                className="w-14 h-18 object-cover rounded-lg"
                onError={(e) => { e.target.src = "https://via.placeholder.com/60x80?text=?"; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{order.book?.title}</p>
                <p className="text-zinc-400 text-xs mt-0.5">{order.book?.author}</p>
                <p className="text-green-400 text-sm font-bold mt-1">₹{order.book?.price}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || "bg-zinc-700 text-zinc-300"}`}>
                  {order.status}
                </span>
                <p className="text-zinc-500 text-xs mt-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
