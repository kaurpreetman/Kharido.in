import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* About Us */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm leading-6 text-gray-400">
              Shopstore is your go-to destination for premium shopping. We offer exclusive deals, fast shipping, and top-quality products across all categories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">My Account</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm text-gray-400">
              Email us at: <a href="mailto:support@shopstore.com" className="text-blue-400 hover:text-blue-500 transition">support@forevershop.com</a>
            </p>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} ForEver. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
