// frontend/src/pages/Favourites.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import api, { bookHeader } from "../utils/api";

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [msg, setMsg]               = useState("");

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  useEffect(() => {
    api.get("/api/v1/get-favourite-books")
      .then((res) => setFavourites(res.data.favourites || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (bookId) => {
    try {
      await api.delete("/api/v1/remove-book-from-favourites", { headers: bookHeader(bookId) });
      setFavourites((prev) => prev.filter((b) => b._id !== bookId));
      notify("Removed from favourites.");
    } catch (e) {
      notify("Error removing.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {msg && <div className="fixed top-20 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">{msg}</div>}

      <h1 className="text-3xl font-bold text-white mb-8">Favourites</h1>

      {favourites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 mb-4">No favourites yet.</p>
          <Link to="/all-books" className="text-blue-400 hover:underline text-sm">Browse books →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favourites.map((book) => (
            <div key={book._id} className="bg-zinc-800 rounded-xl p-4 flex gap-4 border border-zinc-700">
              <Link to={`/book/${book._id}`}>
                <img src={book.url} alt={book.title} className="w-16 h-20 object-cover rounded-lg" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/book/${book._id}`}>
                  <h3 className="text-white font-medium text-sm truncate hover:text-blue-400 transition">{book.title}</h3>
                </Link>
                <p className="text-zinc-400 text-xs mt-0.5">{book.author}</p>
                <p className="text-green-400 font-bold text-sm mt-1">₹{book.price}</p>
                <button
                  onClick={() => handleRemove(book._id)}
                  className="mt-2 text-red-400 hover:text-red-300 text-xs transition"
                >
                  Remove ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
