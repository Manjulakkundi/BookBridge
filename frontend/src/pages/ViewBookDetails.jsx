// frontend/src/pages/ViewBookDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Loader from "../components/Loader/Loader";
import api, { bookHeader } from "../utils/api";

export default function ViewBookDetails() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const { isLoggedIn, role } = useSelector((s) => s.auth);

  const [book, setBook]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState("");
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating]   = useState(5);
  const username              = useSelector((s) => s.auth.user?.username || "Anonymous");

  useEffect(() => {
    Promise.all([
      api.get(`/api/v1/get-book-by-id/${id}`),
      api.get(`/api/v1/get-reviews/${id}`),
    ])
      .then(([bookRes, reviewRes]) => {
        setBook(bookRes.data.data);
        setReviews(reviewRes.data.reviews || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const handleCart = async () => {
    if (!isLoggedIn) return navigate("/sign-in");
    try {
      const res = await api.put("/api/v1/add-book-to-cart", {}, { headers: bookHeader(id) });
      notify(res.data.message);
    } catch (e) {
      notify(e.response?.data?.message || "Error adding to cart");
    }
  };

  const handleFavourite = async () => {
    if (!isLoggedIn) return navigate("/sign-in");
    try {
      const res = await api.put("/api/v1/add-book-to-favourites", {}, { headers: bookHeader(id) });
      notify(res.data.message);
    } catch (e) {
      notify(e.response?.data?.message || "Error");
    }
  };

  const handleDeleteBook = async () => {
    if (!window.confirm("Delete this book permanently?")) return;
    try {
      await api.delete("/api/v1/delete-book", { headers: bookHeader(id) });
      navigate("/all-books");
    } catch (e) {
      notify(e.response?.data?.message || "Error deleting");
    }
  };

  const handleAddReview = async () => {
    if (!comment.trim()) return notify("Please write a comment.");
    try {
      const res = await api.post("/api/v1/add-review", { bookId: id, user: username, comment, rating });
      setReviews((prev) => [res.data.review, ...prev]);
      setComment("");
      setRating(5);
    } catch (e) {
      notify("Failed to add review.");
    }
  };

  if (loading) return <Loader />;
  if (!book)   return <p className="text-center text-zinc-400 py-20">Book not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {msg && (
        <div className="fixed top-20 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">
          {msg}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-10"
      >
        {/* Cover */}
        <div className="w-full md:w-64 flex-shrink-0">
          <img
            src={book.url}
            alt={book.title}
            className="w-full rounded-xl object-cover shadow-2xl"
            onError={(e) => { e.target.src = "https://via.placeholder.com/300x400?text=No+Cover"; }}
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
          <p className="text-zinc-400 text-lg mb-1">by {book.author}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-full">{book.genre}</span>
            <span className="bg-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-full">{book.language}</span>
          </div>
          <p className="text-green-400 text-2xl font-bold mb-4">₹{book.price}</p>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">{book.desc}</p>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleCart}      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition">
              Add to Cart
            </button>
            <button onClick={handleFavourite} className="bg-zinc-700 hover:bg-zinc-600 text-white px-5 py-2 rounded-lg text-sm transition">
              ♡ Favourite
            </button>
            {role === "admin" && (
              <>
                <button onClick={() => navigate(`/update-book/${id}`)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-lg text-sm transition">
                  Edit
                </button>
                <button onClick={handleDeleteBook} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm transition">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-xl font-bold text-white mb-6">Reviews</h2>

        {isLoggedIn && (
          <div className="bg-zinc-800 rounded-xl p-4 mb-8">
            <h3 className="text-white text-sm font-medium mb-3">Leave a Review</h3>
            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5].map((star) => (
                <button key={star} onClick={() => setRating(star)}
                  className={`text-xl ${star <= rating ? "text-yellow-400" : "text-zinc-600"}`}>★</button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              rows={3}
              className="w-full bg-zinc-700 text-white text-sm rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button onClick={handleAddReview}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
              Submit Review
            </button>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-zinc-500 text-sm">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-zinc-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">{r.user}</span>
                  <span className="text-yellow-400 text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                <p className="text-zinc-400 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
