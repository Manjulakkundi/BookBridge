// frontend/src/components/BookCard/BookCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function BookCard({ data }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-zinc-500 transition-colors"
    >
      <Link to={`/book/${data._id}`}>
        <div className="relative h-52 overflow-hidden">
          <img
            src={data.url}
            alt={data.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = "https://via.placeholder.com/300x400?text=No+Cover"; }}
          />
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {data.genre}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm truncate">{data.title}</h3>
          <p className="text-zinc-400 text-xs mt-1 truncate">{data.author}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-green-400 font-bold text-sm">₹{data.price}</span>
            <span className="text-zinc-500 text-xs">{data.language}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
