// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BookCard from "../components/BookCard/BookCard";
import Loader from "../components/Loader/Loader";
import api from "../utils/api";

export default function Home() {
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    api.get("/api/v1/get-recent-books")
      .then((res) => setRecentBooks(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900/30 py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Discover Your Next <span className="text-blue-400">Great Read</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
            Browse thousands of books across all genres. Buy, explore, and build your personal library.
          </p>
          <Link
            to="/all-books"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium text-lg transition inline-block"
          >
            Browse All Books →
          </Link>
        </motion.div>
      </section>

      {/* Recently Added */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Recently Added</h2>
          <Link to="/all-books" className="text-blue-400 hover:text-blue-300 text-sm transition">
            View all →
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : recentBooks.length === 0 ? (
          <p className="text-zinc-500 text-center py-12">No books yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentBooks.map((book) => (
              <BookCard key={book._id} data={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
