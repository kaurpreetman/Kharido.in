import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

export const ProfilePage = () => {
  const { user, getUserOrders } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [processingOrderId, setProcessingOrderId] = useState(null);

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
      const rawOrders = await getUserOrders(user._id);
      
      setOrders(rawOrders);
   
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("❌ Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrdersWithProducts();
    } else {
      setOrders([]);
      setOrdersLoading(false);
    }
  }, [user]);

  const handleCancelOrReturn = async (orderId) => {
    try {
      setProcessingOrderId(orderId);
      await axios.post("http://localhost:5000/api/orders/cancel", { orderId });
      toast.success("✅ Order updated");
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
        Please login to view your orders.
      </div>
    );
  }
console.log(orders);
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8 bg-gray-100 p-6 rounded shadow">
  <h2 className="text-xl font-semibold text-gray-800 mb-2">👤 User Info</h2>
  <p><strong>Name:</strong> {user.name || "N/A"}</p>
  <p><strong>Email:</strong> {user.email || "N/A"}</p>
  <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString() || "N/A"}</p>
</div>

      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">📦 My Orders</h1>

      {ordersLoading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders yet 🫤</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded p-4">
              <div className="mb-2 flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  Order ID: {order._id}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "shipped"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-sm mb-2">
                <strong>Total:</strong> ${order.totalAmount.toFixed(2)} |{" "}
                <strong>Payment:</strong> {getPaymentLabel(order.paymentMethod)}
              </div>

              <div className="space-y-2 text-sm">
                {order.products.map((item, idx) => {
  const product = item.product;

  return (
    <div key={idx} className="flex justify-between">
      <span>{product?.name || "Unknown Product"} (x{item.quantity})</span>
      <span>${product?.price ? product.price.toFixed(2) : "0.00"}</span>
    </div>
  );
})}

              </div>

              <div className="mt-4 flex gap-3">
                {/* Return button logic */}
                {order.status === "delivered" &&
                  order.deliveredDate &&
                  daysBetween(new Date(), new Date(order.deliveredDate)) <= 14 && (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                      onClick={() => handleCancelOrReturn(order._id)}
                      disabled={processingOrderId === order._id}
                    >
                      {processingOrderId === order._id ? "Processing..." : "Return"}
                    </button>
                  )}

                {/* Cancel logic */}
                {(order.status === "pending" || order.status === "shipped") && (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                    onClick={() => handleCancelOrReturn(order._id)}
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
