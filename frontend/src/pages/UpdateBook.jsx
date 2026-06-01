// frontend/src/pages/UpdateBook.jsx  (admin only)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import api, { bookHeader } from "../utils/api";

const GENRES    = ["Fiction", "Non-Fiction", "Science", "Technology", "History", "Biography", "Fantasy", "Mystery", "Romance", "Self-Help", "Other"];
const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "Bengali", "Marathi", "Other"];

export default function UpdateBook() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [form, setForm]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [msg,     setMsg]     = useState("");

  useEffect(() => {
    api.get(`/api/v1/get-book-by-id/${id}`)
      .then((res) => setForm(res.data.data))
      .catch(() => setError("Failed to load book."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.put("/api/v1/update-book", form, { headers: bookHeader(id) });
      setMsg("Book updated successfully!");
      setTimeout(() => navigate(`/book/${id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!form)   return <p className="text-center text-zinc-400 py-20">Book not found.</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Update Book</h1>

      {error && <p className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm px-4 py-2 rounded-lg mb-4">{error}</p>}
      {msg   && <p className="bg-green-500/20 border border-green-500/50 text-green-400 text-sm px-4 py-2 rounded-lg mb-4">{msg}</p>}

      <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "title",  label: "Title",            type: "text" },
            { name: "author", label: "Author",           type: "text" },
            { name: "price",  label: "Price (₹)",        type: "number" },
            { name: "url",    label: "Cover Image URL",  type: "url" },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="text-zinc-300 text-sm block mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                required
                min={type === "number" ? 0 : undefined}
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
            <textarea name="desc" value={form.desc || ""} onChange={handleChange} required rows={4}
              className="w-full bg-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm py-2.5 rounded-lg transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60 text-white text-sm py-2.5 rounded-lg transition">
              {saving ? "Saving..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
