// frontend/src/pages/AllBooks.jsx
import React, { useEffect, useState } from "react";
import BookCard from "../components/BookCard/BookCard";
import Loader from "../components/Loader/Loader";
import api from "../utils/api";

export default function AllBooks() {
  const [books, setBooks]         = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/v1/get-all-books?page=${currentPage}&limit=12`)
      .then((res) => {
        setBooks(res.data.data || []);
        setPagination(res.data.pagination || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">All Books</h1>
      <p className="text-zinc-500 text-sm mb-8">
        {pagination.totalBooks ? `${pagination.totalBooks} books available` : ""}
      </p>

      {loading ? (
        <Loader />
      ) : books.length === 0 ? (
        <p className="text-zinc-500 text-center py-20">No books found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} data={book} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>
              <span className="text-zinc-400 text-sm">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
                className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
