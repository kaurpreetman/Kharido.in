import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">ℹ️ About Us</h3>
            <p className="text-sm leading-relaxed">
              ForEver is your go-to for premium shopping. Great deals, fast shipping, and products you’ll ❤️.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">🔗 Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="hover:text-white">🧾 Products</Link></li>
              <li><Link to="/cart" className="hover:text-white">🛒 Cart</Link></li>
              <li><Link to="/profile" className="hover:text-white">👤 My Account</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">🛠️ Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:text-white">❓ FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white">🚚 Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-white">🔁 Returns</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">📲 Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-white"><Facebook /></a>
              <a href="#" aria-label="Twitter" className="hover:text-white"><Twitter /></a>
              <a href="#" aria-label="Instagram" className="hover:text-white"><Instagram /></a>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center">
          <p>© {new Date().getFullYear()} ForEver. All rights reserved. 🛍️</p>
        </div>
      </div>
    </footer>
  );
};
