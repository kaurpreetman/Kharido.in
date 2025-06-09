import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  console.log(`token ${token}`);
  
  const fetchAllOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
        setCount(response.data.orders.length);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/orders/status`,
        { orderId, status: event.target.value },
        { headers: { token } }
      );

      if (response.data.success) {
        fetchAllOrders();
        toast.success('Order status updated');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">All Orders</h3>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : (
        <div>
          {count === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            orders.map((order, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-sm text-gray-700"
              >
                {/* Icon */}
                <img className="w-12" src={assets.parcel_icon} alt="Parcel" />

                {/* Products and Address */}
                <div>
                  <div>
                    <p className="font-medium mb-1">Products:</p>
                    {(order.products || []).map((item, idx) => (
                      <p key={idx} className="text-sm ml-2">
                        • {item.product?.name || 'Unnamed'} × {item.quantity}
                      </p>
                    ))}
                  </div>

                  <div className="mt-4">
                    <p className="font-medium">
                      {order.address?.firstName} {order.address?.lastName}
                    </p>
                    <p>{order.address?.street},</p>
                    <p>
                      {order.address?.city}, {order.address?.state}, {order.address?.country} -{' '}
                      {order.address?.zipCode}
                    </p>
                    <p>{order.address?.phone}</p>
                  </div>
                </div>

                {/* Payment and Date */}
                <div>
                  <p>Items: {order.products?.length}</p>
                  <p>Method: {order.paymentMethod}</p>
                  <p>Payment: {order.paymentStatus === 'paid' ? 'Done' : 'Pending'}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-base font-semibold">
                    {currency}
                    {order.totalAmount}
                  </p>
                </div>

                {/* Status & Customer Info */}
                <div>
                  <select
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status}
                    className="p-2 font-semibold border border-gray-300 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <div className="text-xs mt-2">
                    Customer: {order.user?.name || 'N/A'} ({order.user?.email || 'No Email'})
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
