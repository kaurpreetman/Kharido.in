import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Lock,
  LogOut,
  Menu,
  X,
  User,
  ShoppingBag,
} from "lucide-react";
import { SearchBar } from "../ui/SearchBar";
import { ThemeToggle } from "../ui/ThemeToggle";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../context/userSlice";

export const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const totalCount = useSelector((state) => state.cart.totalCount);
  const isAdmin = user?.role === "admin";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const showSearchBar = location.pathname.startsWith("/products");

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-dark-900/80 border-b border-gray-200/20 dark:border-dark-700/20 shadow-lg theme-transition">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-display font-bold gradient-text hover:scale-105 transition-transform duration-300 group"
        >
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="text-shadow">Kharido.in</span>
        </Link>

        {/* Desktop Search */}
        {showSearchBar && (
          <div className="hidden lg:block flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <Link
              to="/products?category=All"
              className="relative group px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 hover:from-primary-500/20 hover:to-secondary-500/20 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 font-medium"
            >
              <span className="relative z-10">Products</span>
            </Link>
          ) : (
            <button
              onClick={() => toast.info("Please login to view products")}
              className="px-5 py-2.5 rounded-xl text-gray-400 cursor-not-allowed opacity-50 font-medium"
            >
              Products
            </button>
          )}

          {user ? (
            <Link
              to="/cart"
              className="relative group p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-300"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce-subtle shadow-lg">
                    {totalCount}
                  </span>
                )}
              </div>
            </Link>
          ) : (
            <button
              onClick={() => toast.info("Please login to access your cart")}
              className="p-3 text-gray-400 cursor-not-allowed opacity-50 rounded-xl"
            >
              <ShoppingCart className="w-6 h-6" />
            </button>
          )}

          {isAdmin && (
            <Link to="http://localhost:5714" className="btn-primary gap-2">
              <Lock size={16} />
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 transition-all duration-300 font-medium"
              >
                <User size={16} />
                <span className="hidden lg:inline">Profile</span>
              </Link>
              <button onClick={handleLogout} className="btn-danger gap-2">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="btn-primary">
                Login
              </Link>
              <Link to="/signup" className="btn-secondary">
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-3 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 px-6 py-4 bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl border-t border-gray-200/20 dark:border-dark-700/20 shadow-2xl animate-slide-down">
          <div className="space-y-4">
            {showSearchBar && <SearchBar />}
            <div className="flex justify-center">
              <ThemeToggle />
            </div>

            {user ? (
              <>
                <Link
                  to="/products"
                  className="btn-primary w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>

                <Link
                  to="/cart"
                  className="btn-primary w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cart ({totalCount})
                </Link>

                <Link
                  to="/profile"
                  className="btn-primary w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>

                {isAdmin && (
                  <Link
                    to="http://localhost:5714"
                    className="btn-primary w-full justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-danger w-full justify-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-primary w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-secondary w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
