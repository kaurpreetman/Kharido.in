import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Lock, LogOut, Menu, X } from "lucide-react";
import { SearchBar } from "../ui/SearchBar";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser,fetchUser } from "../../context/userSlice"; // make sure this action exists

export const Header = () => {
  const dispatch = useDispatch();

  // ⬇ Redux selectors
const user = useSelector((state) => state.user.user);
const authLoading = useSelector((state) => state.user.authLoading);
  const totalCount = useSelector((state) => state.cart.totalCount);

  const isAdmin = user?.isAdmin || false;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-600 hover:text-blue-800 transition duration-300"
        >
          🛍️ Shopstore
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:block flex-1 max-w-2xl mx-8">
          <SearchBar />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          {user ? (
            <Link to="/products?category=All" className="hover:text-blue-600 transition-colors">
              🧾 Products
            </Link>
          ) : (
            <span
              onClick={() => toast.info("Please login to view products")}
              className="hover:text-blue-600 cursor-not-allowed opacity-50 transition-colors"
            >
              🧾 Products
            </span>
          )}

          {user ? (
            <Link to="/cart" className="relative hover:text-blue-600 transition-colors">
              <ShoppingCart />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalCount}
                </span>
              )}
            </Link>
          ) : (
            <span
              onClick={() => toast.info("Please login to access your cart")}
              className="relative hover:text-blue-600 cursor-not-allowed opacity-50 transition-colors"
            >
              <ShoppingCart />
            </span>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 text-white bg-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-700"
            >
              <Lock size={16} />
              🔐 Admin
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-white bg-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-700"
            >
              <LogOut size={16} />
              🚪 Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                🔑 Login
              </Link>
              <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                ✍️ Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-blue-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 pb-6 space-y-4">
          <SearchBar />
          {user ? (
            <Link to="/products" className="block hover:text-blue-600">
              🧾 Products
            </Link>
          ) : (
            <span
              onClick={() => toast.info("Please login to view products")}
              className="block text-gray-400 cursor-not-allowed"
            >
              🧾 Products
            </span>
          )}

          {user ? (
            <Link to="/cart" className="block hover:text-blue-600 flex items-center gap-2">
              🛒 Cart ({totalCount})
            </Link>
          ) : (
            <span
              onClick={() => toast.info("Please login to access your cart")}
              className="block text-gray-400 cursor-not-allowed"
            >
              🛒 Cart
            </span>
          )}

          {isAdmin && (
            <Link to="/admin" className="block hover:text-blue-600 flex items-center gap-2">
              Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              🚪 Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                🔑 Login
              </Link>
              <Link to="/signup" className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                ✍️ Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
