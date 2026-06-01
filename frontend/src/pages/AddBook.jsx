// frontend/src/pages/AddBook.jsx  (admin only)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const GENRES    = ["Fiction", "Non-Fiction", "Science", "Technology", "History", "Biography", "Fantasy", "Mystery", "Romance", "Self-Help", "Other"];
const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "Bengali", "Marathi", "Other"];

const EMPTY = { url: "", title: "", author: "", price: "", desc: "", genre: "Fiction", language: "English" };

export default function AddBook() {
  const navigate  = useNavigate();
  const [form, setForm]     = useState(EMPTY);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/v1/add-book", form);
      navigate("/all-books");
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.message
        || err.response?.data?.message
        || "Failed to add book.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Add New Book</h1>

      {error && <p className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm px-4 py-2 rounded-lg mb-4">{error}</p>}

      <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "title",  label: "Title",              type: "text" },
            { name: "author", label: "Author",             type: "text" },
            { name: "price",  label: "Price (₹)",          type: "number" },
            { name: "url",    label: "Cover Image URL",    type: "url" },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="text-zinc-300 text-sm block mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                min={type === "number" ? 0 : undefined}
                step={type === "number" ? "0.01" : undefined}
                className="w-full bg-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-300 text-sm block mb-1">Genre</label>
              <select name="genre" value={form.genre} onChange={handleChange}
                className="w-full bg-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500">
                {GENRES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-zinc-300 text-sm block mb-1">Language</label>
              <select name="language" value={form.language} onChange={handleChange}
                className="w-full bg-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500">
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-zinc-300 text-sm block mb-1">Description</label>
            <textarea
              name="desc"
              value={form.desc}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Live preview */}
          {form.url && (
            <div className="mt-2">
              <p className="text-zinc-400 text-xs mb-2">Cover Preview:</p>
              <img src={form.url} alt="preview"
                className="h-32 object-cover rounded-lg"
                onError={(e) => { e.target.style.display = "none"; }} />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm py-2.5 rounded-lg transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm py-2.5 rounded-lg transition">
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
