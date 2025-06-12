import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { fetchUserOrders } from "../context/orderSlice";
import { User, Package, Calendar, Mail, Phone, MapPin, CreditCard, Truck, CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react";

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
        return { label: "Cash on Delivery", icon: Package, color: "text-green-600 dark:text-green-400" };
      case "stripe":
        return { label: "Stripe", icon: CreditCard, color: "text-blue-600 dark:text-blue-400" };
      case "razorpay":
        return { label: "Razorpay", icon: CreditCard, color: "text-purple-600 dark:text-purple-400" };
      default:
        return { label: "Unknown", icon: CreditCard, color: "text-gray-600 dark:text-gray-400" };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "delivered":
        return { 
          color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800", 
          icon: CheckCircle 
        };
      case "shipped":
        return { 
          color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800", 
          icon: Truck 
        };
      case "cancelled":
        return { 
          color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800", 
          icon: XCircle 
        };
      case "returned":
        return { 
          color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800", 
          icon: RotateCcw 
        };
      default:
        return { 
          color: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600", 
          icon: Clock 
        };
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

  const statusTabs = [
    { id: "all", label: "All Orders", icon: Package },
    { id: "pending", label: "Pending", icon: Clock },
    { id: "processing", label: "Processing", icon: Clock },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "delivered", label: "Delivered", icon: CheckCircle },
    { id: "cancelled", label: "Cancelled", icon: XCircle },
    { id: "returned", label: "Returned", icon: RotateCcw }
  ];

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center theme-transition">
        <div className="card p-12 text-center max-w-md">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Restricted</h2>
          <p className="text-gray-600 dark:text-gray-400">Please login to view your profile and orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 theme-transition">
      <div className="container mx-auto py-8 px-4">
        {/* User Info Card */}
        <div className="card p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your orders and account settings</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
              <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
              <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
              <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <h2 className="text-3xl font-bold gradient-text">My Orders</h2>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {statusTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedTab === tab.id
                      ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600"
                  }`}
                  onClick={() => setSelectedTab(tab.id)}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Orders List */}
          {ordersLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="spinner mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedTab === "all" ? "You haven't placed any orders yet." : `No ${selectedTab} orders found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const paymentConfig = getPaymentLabel(order.paymentMethod);
                const StatusIcon = statusConfig.icon;
                const PaymentIcon = paymentConfig.icon;

                return (
                  <div key={order._id} className="card p-6 hover:shadow-xl transition-all duration-300">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <StatusIcon className="w-4 h-4" />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount:</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            ₹{order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PaymentIcon className={`w-4 h-4 ${paymentConfig.color}`} />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Payment:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {paymentConfig.label}
                          </span>
                        </div>
                      </div>
                      
                      {order.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                          <div className="text-sm">
                            <p className="text-gray-600 dark:text-gray-400 mb-1">Delivery Address:</p>
                            <p className="text-gray-900 dark:text-gray-100">
                              {order.address.street}, {order.address.city}<br />
                              {order.address.state}, {order.address.zipCode}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-6">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Order Items:</h4>
                      {order.products.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                          <div className="flex items-center gap-3">
                            {item?.product?.image && (
                              <img 
                                src={item.product.image[0]} 
                                alt={item?.product?.name || "Product"}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {item?.product?.name || "Unknown Product"}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Quantity: {item.quantity} {item.size!="null" && `• Size: ${item.size}`}
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            ₹{item?.price?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap">
                      {/* Return option */}
                      {order.status === "delivered" &&
                        order.deliveredAt &&
                        !order.isReturned &&
                        daysBetween(new Date(), new Date(order.deliveredAt)) <= 7 && (
                          <button
                            className="btn-secondary gap-2"
                            onClick={() => handleCancelOrReturn(order._id, "return")}
                            disabled={processingOrderId === order._id}
                          >
                            <RotateCcw className="w-4 h-4" />
                            {processingOrderId === order._id ? "Processing..." : "Return Order"}
                          </button>
                        )}

                      {/* Cancel option */}
                      {["pending", "shipped"].includes(order.status) && !order.isCancelled && (
                        <button
                          className="btn-danger gap-2"
                          onClick={() => handleCancelOrReturn(order._id, "cancel")}
                          disabled={processingOrderId === order._id}
                        >
                          <XCircle className="w-4 h-4" />
                          {processingOrderId === order._id ? "Processing..." : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};