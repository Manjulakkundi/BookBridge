// frontend/src/components/Navbar/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../stores/authSlice";

export default function Navbar() {
  const { isLoggedIn, role } = useSelector((s) => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/sign-in");
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          📚 <span>BookBridge</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/"          className="text-zinc-400 hover:text-white text-sm transition">Home</Link>
          <Link to="/all-books" className="text-zinc-400 hover:text-white text-sm transition">All Books</Link>

          {isLoggedIn && (
            <>
              <Link to="/cart"          className="text-zinc-400 hover:text-white text-sm transition">Cart</Link>
              <Link to="/favourites"    className="text-zinc-400 hover:text-white text-sm transition">Favourites</Link>
              <Link to="/order-history" className="text-zinc-400 hover:text-white text-sm transition">Orders</Link>
              <Link to="/profile"       className="text-zinc-400 hover:text-white text-sm transition">Profile</Link>
            </>
          )}

          {isLoggedIn && role === "admin" && (
            <>
              <Link to="/add-book"   className="text-yellow-400 hover:text-yellow-300 text-sm transition">Add Book</Link>
              <Link to="/all-orders" className="text-yellow-400 hover:text-yellow-300 text-sm transition">All Orders</Link>
            </>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-lg transition"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-3">
              <Link to="/sign-in" className="text-zinc-300 hover:text-white text-sm border border-zinc-600 px-4 py-1.5 rounded-lg transition">
                Sign In
              </Link>
              <Link to="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-zinc-400" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-2 flex flex-col gap-3 px-2 pb-4">
          <Link to="/"          onClick={() => setOpen(false)} className="text-zinc-300 text-sm py-1">Home</Link>
          <Link to="/all-books" onClick={() => setOpen(false)} className="text-zinc-300 text-sm py-1">All Books</Link>
          {isLoggedIn && (
            <>
              <Link to="/cart"          onClick={() => setOpen(false)} className="text-zinc-300 text-sm py-1">Cart</Link>
              <Link to="/favourites"    onClick={() => setOpen(false)} className="text-zinc-300 text-sm py-1">Favourites</Link>
              <Link to="/order-history" onClick={() => setOpen(false)} className="text-zinc-300 text-sm py-1">Orders</Link>
              <Link to="/profile"       onClick={() => setOpen(false)} className="text-zinc-300 text-sm py-1">Profile</Link>
            </>
          )}
          {isLoggedIn && role === "admin" && (
            <>
              <Link to="/add-book"   onClick={() => setOpen(false)} className="text-yellow-400 text-sm py-1">Add Book</Link>
              <Link to="/all-orders" onClick={() => setOpen(false)} className="text-yellow-400 text-sm py-1">All Orders</Link>
            </>
          )}
          {isLoggedIn
            ? <button onClick={handleLogout} className="text-red-400 text-sm py-1 text-left">Logout</button>
            : <>
                <Link to="/sign-in" onClick={() => setOpen(false)} className="text-zinc-300 text-sm py-1">Sign In</Link>
                <Link to="/sign-up" onClick={() => setOpen(false)} className="text-zinc-300 text-sm py-1">Sign Up</Link>
              </>
          }
        </div>
      )}
    </nav>
  );
}
