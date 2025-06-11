import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { fetchUserOrders } from "../context/orderSlice";

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, authLoading } = useSelector((state) => state.user);
  const { orders, loading: ordersLoading } = useSelector((state) => state.order);

  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("all");

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

  useEffect(() => {
    if (user) dispatch(fetchUserOrders(user._id));
  }, [user, dispatch]);

  const handleCancelOrReturn = async (orderId, actionType) => {
    try {
      setProcessingOrderId(orderId);
      const endpoint =
        actionType === "cancel"
          ? "http://localhost:5000/api/orders/cancel"
          : "http://localhost:5000/api/orders/return";

      await axios.post(endpoint, { orderId }, { withCredentials: true });

      toast.success(`✅ Order ${actionType === "cancel" ? "cancelled" : "returned"} successfully`);
      dispatch(fetchUserOrders(user._id));
    } catch (err) {
      toast.error(`❌ ${err.response?.data?.message || err.message}`);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const filteredOrders =
    selectedTab === "all"
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === selectedTab);

  const statusTabs = ["all", "pending", "processing", "shipped", "delivered", "cancelled", "returned"];

  if (!user && !authLoading) {
    return (
      <div className="text-center mt-20 text-lg text-gray-600">
        Please login to view your orders.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8 bg-gray-100 p-6 rounded shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">👤 User Info</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Joined:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
      </div>

      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">📦 My Orders</h1>

      {/* Tabs for filtering */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              selectedTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {ordersLoading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found in this category 🫤</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded p-4">
              <div className="mb-2 flex justify-between items-center">
                <span className="font-semibold text-gray-700">Order ID: {order._id}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "shipped"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-600"
                      : order.status === "returned"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-sm mb-2">
                <strong>Total:</strong> ₹{order.totalAmount.toFixed(2)} |{" "}
                <strong>Payment:</strong> {getPaymentLabel(order.paymentMethod)}
              </div>

              <div className="space-y-2 text-sm">
                {order.products.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {item?.product?.name || "Unknown Product"} (x{item.quantity})
                    </span>
                    <span>₹{item?.price?.toFixed(2) || "0.00"}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-3 flex-wrap">
                {/* Return option */}
                {order.status === "delivered" &&
                  order.deliveredAt &&
                  !order.isReturned &&
                  daysBetween(new Date(), new Date(order.deliveredAt)) <= 7 && (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                      onClick={() => handleCancelOrReturn(order._id, "return")}
                      disabled={processingOrderId === order._id}
                    >
                      {processingOrderId === order._id ? "Processing..." : "Return"}
                    </button>
                  )}

                {/* Cancel option */}
                {["pending", "shipped"].includes(order.status) && !order.isCancelled && (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                    onClick={() => handleCancelOrReturn(order._id, "cancel")}
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
  );
};
