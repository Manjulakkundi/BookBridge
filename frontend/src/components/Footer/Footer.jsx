// frontend/src/components/Footer/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-zinc-500 text-sm">
          📚 <span className="text-white font-medium">BookBridge</span> — Your gateway to great reads
        </p>
        <div className="flex gap-6">
          <Link to="/"          className="text-zinc-500 hover:text-zinc-300 text-sm transition">Home</Link>
          <Link to="/all-books" className="text-zinc-500 hover:text-zinc-300 text-sm transition">All Books</Link>
        </div>
        <p className="text-zinc-600 text-xs">© {new Date().getFullYear()} BookBridge. All rights reserved.</p>
      </div>
    </footer>
  );
}
