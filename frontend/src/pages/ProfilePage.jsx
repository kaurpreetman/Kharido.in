import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import { toast } from "react-toastify";
import axios from "axios"
export const ProfilePage = () => {
  const { user, getUserOrders, getSingleProduct } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [processingOrderId, setProcessingOrderId] = useState(null);

  // Utility to calculate day difference
  const daysBetween = (d1, d2) =>
    Math.floor((new Date(d1) - new Date(d2)) / (1000 * 60 * 60 * 24));

  const getPaymentLabel = (method) => {
    switch (method) {
      case "cash_on_delivery":
        return "💵 Cash on Delivery";
      case "stripe":
        return "💳 Stripe";
      case "razorpay":
        return "🏦 Razorpay";
      default:
        return "💰 Unknown";
    }
  };

  const fetchOrdersWithProducts = async () => {
    try {
      const rawOrders = await getUserOrders();
      console.log("rawOrders:", rawOrders);
      // No need to refetch product here if productDetails is populated by backend
      const enrichedOrders = rawOrders.map((order) => ({
        ...order,
        products: order.products.map((item) => ({
          ...item,
          productDetails: item.product, // Already populated by backend/Mongoose
        })),
      }));
      setOrders(enrichedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("❌ Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchOrdersWithProducts();
    } else {
      setOrders([]);
      setOrdersLoading(false);
    }
  }, [user]);

  const handleReturn = async (orderId) => {
    try {
      setProcessingOrderId(orderId);
      await axios.post('http://localhost/5000/api/orders/cancel', { orderId });

      toast.success("✅ Order returned successfully");
      fetchOrdersWithProducts();
    } catch (err) {
      toast.error(`❌ ${err.response?.data?.message || err.message}`);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      setProcessingOrderId(orderId);
      await axios.post('http://localhost:5000/api/orders/cancel', { orderId });

      toast.success("🛑 Order cancelled");
      fetchOrdersWithProducts();
    } catch (err) {
      toast.error(`❌ ${err.response?.data?.message || err.message}`);
    } finally {
      setProcessingOrderId(null);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-20 text-lg text-gray-600">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-12">
      <h1 className="text-4xl font-bold text-center text-blue-700">👤 My Profile</h1>

      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow space-y-2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">👥 User Info</h2>
        <p>
          <span className="font-medium text-gray-700">Full Name:</span> {user.name}
        </p>
        <p>
          <span className="font-medium text-gray-700">Email:</span> {user.email}
        </p>
      </div>

      {/* Order History */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">📦 Order History</h2>

        {ordersLoading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found 🫤</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border rounded p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">
                  Order ID: {order._id} | Status:{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded ${
                      order.status === "delivered"
                        ? "bg-green-200 text-green-800"
                        : order.status === "shipped"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </h3>

                <p className="mb-2">
                  Payment Method: {getPaymentLabel(order.paymentMethod)}
                </p>
                <p className="mb-2">
                  Total Price: ${order.totalPrice}
                </p>

                {/* Products */}
                <div className="mb-2 space-y-1">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <img
                        src={item.productDetails.image}
                        alt={item.productDetails.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold">{item.productDetails.title}</p>
                        <p>Size: {item.size}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.productDetails.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-3 space-x-3">
                  {/* Return eligible if delivered and within 14 days */}
                 
                  {order.status === "delivered"  &&
                    order.deliveredDate &&
                    daysBetween(new Date(), new Date(order.deliveredDate)) <= 14 ? (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        onClick={() => handleReturn(order._id)}
                        disabled={processingOrderId === order._id}
                      >
                        {processingOrderId === order._id ? "Processing..." : "Return"}
                      </button>
                    ) : null}


                  {/* Cancel eligible if pending or shipped */}
                  {(order.status === "pending" || order.status === "shipped") && (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                      onClick={() => handleCancel(order._id)}
                      disabled={processingOrderId === order._id}
                    >
                      {processingOrderId === order._id ? "Processing..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
