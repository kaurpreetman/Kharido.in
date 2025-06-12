import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, List, ShoppingCart, Users, Package, Clock
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/analytics/stats', {
          withCredentials: true,
        });
        const data = res.data;

        const formattedStats = [
          {
            title: 'Total Products',
            value: data.totalProducts,
            icon: Package,
            color: 'from-blue-500 to-blue-600',
          },
          {
            title: 'Pending Orders',
            value: data.pendingOrders,
            icon: ShoppingCart,
            color: 'from-green-500 to-green-600',
          },
          {
            title: 'Total Orders',
            value: data.totalOrders,
            icon: ShoppingCart,
            color: 'from-yellow-500 to-yellow-600',
          },
          {
            title: 'Total Users',
            value: data.totalUsers,
            icon: Users,
            color: 'from-purple-500 to-purple-600',
          },
        ];

        setStats(formattedStats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Add a new product to your store',
      icon: Plus,
      link: '/add',
      color: 'from-blue-500 to-purple-600',
    },
    {
      title: 'Manage Products',
      description: 'View and edit existing products',
      icon: List,
      link: '/list',
      color: 'from-green-500 to-teal-600',
    },
    {
      title: 'View Orders',
      description: 'Manage customer orders and status',
      icon: ShoppingCart,
      link: '/orders',
      color: 'from-orange-500 to-red-600',
    },
    {
      title: 'Manage Users',
      description: 'View and manage registered users',
      icon: Users,
      link: '/users',
      color: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-8 py-12">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Kharido.in Admin</h1>
        <p className="text-blue-100 text-lg">
          Manage your e-commerce store efficiently with our comprehensive admin panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:transform hover:scale-105"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`bg-gradient-to-r ${action.color} p-3 rounded-lg group-hover:shadow-lg transition-all duration-200`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;