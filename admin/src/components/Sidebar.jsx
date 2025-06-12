import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Plus, List, ShoppingCart, Users, Package } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/add', icon: Plus, label: 'Add Product' },
    { path: '/list', icon: List, label: 'Products List' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/users', icon: Users, label: 'Users' },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 w-64 min-h-screen fixed left-0 top-16 z-40">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;