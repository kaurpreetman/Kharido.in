import React from 'react';
import { useUser } from '../context/UserContext';
import { LogOut, User, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useUser();
 
  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Kharido.in</h1>
            <p className="text-sm text-gray-400">Admin Panel</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <User className="w-5 h-5" />
            <span className="hidden md:block">Welcome, {user.user.name || 'Admin'}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;