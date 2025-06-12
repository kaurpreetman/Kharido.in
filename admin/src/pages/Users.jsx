import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Mail, Shield, Trash2 } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/analytics/getusers', {
        withCredentials: true,
      });
      setUsers(data.users || data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/analytics/dltuser/${userId}`, {
          withCredentials: true,
        });
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Users Management</h1>
        <span className="text-gray-400">{users.length} users found</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Admin Users</p>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.role === 'admin').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Users Table */}
     <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
  <div className="bg-gray-700/50 px-6 py-4">
    <div className="grid grid-cols-3 gap-6 text-sm font-medium text-gray-300">
      <span>User</span>
      <span>Contact</span>
      <span className="text-center">Actions</span>
    </div>
  </div>

  <div className="divide-y divide-gray-700">
    {users.map((user) => (
      <div key={user._id} className="px-6 py-4 hover:bg-gray-700/30 transition-colors">
        <div className="grid grid-cols-3 gap-6 items-center">
          {/* User */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-gray-400 text-sm">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>
              {user.role === 'admin' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400 mt-1">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-gray-300 text-sm flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              {user.email}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => deleteUser(user._id)}
              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Delete User"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      {/* Empty state */}
      {users.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No users found</div>
        </div>
      )}
    </div>
  );
};

export default Users;