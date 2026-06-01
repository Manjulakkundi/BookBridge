// frontend/src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import api, { bookHeader } from "../utils/api";

export default function Cart() {
  const [cart,    setCart]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg,     setMsg]     = useState("");

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const fetchCart = () => {
    setLoading(true);
    api.get("/api/v1/get-cart")
      .then((res) => setCart(res.data.cart || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCart(); }, []);

  const handleRemove = async (bookId) => {
    try {
      await api.delete("/api/v1/remove-book-from-cart", { headers: bookHeader(bookId) });
      setCart((prev) => prev.filter((b) => b._id !== bookId));
      notify("Removed from cart.");
    } catch (e) {
      notify("Error removing book.");
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    try {
      await api.post("/api/v1/place-order", { order: cart });
      notify("Order placed successfully! 🎉");
      setCart([]);
    } catch (e) {
      notify(e.response?.data?.message || "Failed to place order.");
    }
  };

  const total = cart.reduce((sum, b) => sum + (b.price || 0), 0);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {msg && (
        <div className="fixed top-20 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">{msg}</div>
      )}

      <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 mb-4">Your cart is empty.</p>
          <Link to="/all-books" className="text-blue-400 hover:underline text-sm">Browse books →</Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.map((book) => (
              <div key={book._id} className="bg-zinc-800 rounded-xl p-4 flex items-center gap-4 border border-zinc-700">
                <img src={book.url} alt={book.title} className="w-16 h-20 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm truncate">{book.title}</h3>
                  <p className="text-zinc-400 text-xs mt-0.5">{book.author}</p>
                  <p className="text-green-400 font-bold text-sm mt-1">₹{book.price}</p>
                </div>
                <button
                  onClick={() => handleRemove(book._id)}
                  className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <div className="flex justify-between text-white mb-4">
              <span className="text-zinc-400">Total ({cart.length} items)</span>
              <span className="font-bold text-lg">₹{total}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
