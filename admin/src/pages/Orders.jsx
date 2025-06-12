import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Package, MapPin, CreditCard, Calendar, User } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const statusTabs = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/list', {
        withCredentials: true,
      });
      setOrders(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        'http://localhost:5000/api/orders/status',
        {
          orderId,
          status: newStatus,
        },
        { withCredentials: true }
      );
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-400',
      shipped: 'bg-purple-500/20 text-purple-400',
      delivered: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
      returned: 'bg-blue-500/20 text-blue-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const filteredOrders =
    selectedStatus === 'all'
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  useEffect(() => {
    fetchOrders();
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
        <h1 className="text-2xl font-bold text-white">Orders Management</h1>
        <span className="text-gray-400">{filteredOrders.length} orders found</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-3 mb-4">
        {statusTabs.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition ${
              selectedStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600/20 text-white hover:bg-gray-600/40'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Order Cards */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Order Icon */}
              <div className="flex justify-center lg:justify-start">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Products and Address */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Products
                  </h3>
                  <div className="space-y-1">
                    {order.products.map((item, idx) => (
                      <p key={idx} className="text-gray-300 text-sm">
                        • {item.product?.name || 'Unnamed'} × {item.quantity}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Shipping Address
                  </h3>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p className="font-medium">
                      {order.address?.firstName} {order.address?.lastName}
                    </p>
                    <p>{order.address?.street}</p>
                    <p>
                      {order.address?.city}, {order.address?.state}{' '}
                      {order.address?.zipCode}
                    </p>
                    <p>{order.address?.country}</p>
                    <p className="flex items-center mt-2">
                      <span className="mr-2">📞</span>
                      {order.address?.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span className="text-sm">Payment: {order.paymentMethod}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-sm">
                    Status: {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-300">
                  <User className="w-4 h-4 mr-2" />
                  <div className="text-sm">
                    <p>{order.user?.name || 'N/A'}</p>
                    <p className="text-gray-400">{order.user?.email || 'No Email'}</p>
                  </div>
                </div>
              </div>

              {/* Amount and Status */}
              <div className="space-y-4">
                <div className="text-center lg:text-left">
                  <p className="text-gray-400 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-white">₹{order.totalAmount.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Order Status</p>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                  </select>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No orders found</div>
        </div>
      )}
    </div>
  );
};

export default Orders;