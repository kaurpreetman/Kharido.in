import React from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, Phone,ShoppingBag, MapPin, Facebook, Twitter, Instagram, Youtube, Sparkles } from "lucide-react";

export const Footer = () => {
  return (
   <footer className="relative bg-white dark:bg-gradient-to-br dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 text-gray-900 dark:text-gray-300 mt-20 overflow-hidden">
  {/* Animated Background Pattern (only visible in dark mode) */}
  <div className="absolute inset-0 opacity-5 dark:opacity-5">
    <div className="absolute inset-0 bg-pattern dark:bg-pattern"></div>
  </div>

  {/* Floating Orbs (only visible in dark mode) */}
  <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl animate-float hidden dark:block"></div>
  <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-accent-500/20 to-primary-500/20 rounded-full blur-3xl animate-float hidden dark:block" style={{ animationDelay: '2s' }}></div>

  <div className="relative max-w-7xl mx-auto px-6 py-10">
    {/* Main Footer Content */}
    <div className="flex flex-wrap justify-around place-items-center gap-20 mb-8">
      {/* Brand Section */}
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-3 mb-6">
         <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                     <ShoppingBag className="w-6 h-6 text-white" />
                   </div>
          <h3 className="text-3xl font-display font-bold gradient-text dark:gradient-text">
            Kharido.in
          </h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-md text-lg">
          Your premium destination for exceptional shopping experiences. We curate the finest products with unmatched quality and style, delivering excellence in every purchase.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-black dark:text-white text-xl font-semibold mb-6 relative ">
          Quick Links
          <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
        </h3>
        <ul className="space-y-4">
          {[
            { to: "/products", label: "Products" },
            { to: "/bestseller", label: "Bestsellers" },
            { to: "/cart", label: "Shopping Cart" },
            { to: "/profile", label: "My Account" },
            { to: "/faq", label: "FAQ" },
          ].map(({ to, label }) => (
            <li key={to}>
              <Link 
                to={to} 
                className="text-gray-500 dark:text-gray-400 hover:text-primary-400 transition-all duration-300 hover:translate-x-2 transform inline-block group relative"
              >
                <span className="relative z-10">{label}</span>
                <div className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-primary-500/10 to-transparent transition-all duration-300 rounded"></div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Contact Info */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          icon: Mail,
          title: "Email Us",
          content: "kharidoatoz@gmail.com",
          href: "mailto:kharidoatoz@gmail.com",
          gradient: "from-blue-500 to-blue-600"
        },
        {
          icon: Phone,
          title: "Call Us",
          content: "+91-7819081686",
          href: "tel:+91-7819081686",
          gradient: "from-green-500 to-green-600"
        },
        {
          icon: MapPin,
          title: "Visit Us",
          content: "MNNIT Allahabad, 211004",
          href: "#",
          gradient: "from-purple-500 to-purple-600"
        },
      ].map(({ icon: Icon, title, content, href, gradient }, index) => (
        <a
          key={index}
          href={href}
          className="group relative p-6 rounded-2xl bg-gray-100 dark:bg-dark-800/50 backdrop-blur-sm border border-gray-300 dark:border-dark-700/50 hover:bg-gray-200 dark:hover:bg-dark-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${gradient} group-hover:shadow-lg transition-all duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-black dark:text-white font-semibold text-lg mb-1">{title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{content}</p>
            </div>
          </div>
        </a>
      ))}
    </div>

    {/* Copyright */}
    <p className="text-gray-500 flex items-center justify-center gap-2 text-lg mt-5">
      &copy; {new Date().getFullYear()} Kharido.in Made with 
      <Heart className="w-5 h-5 text-red-500 fill-current animate-bounce-subtle" /> 
      for amazing shopping experiences.
    </p>
  </div>
</footer>

  );
};