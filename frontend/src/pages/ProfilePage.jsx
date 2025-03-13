import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext.jsx';
import { toast } from 'react-toastify';

export const ProfilePage = () => {
  const { user, getUserOrders, getSingleProduct } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersWithProducts = async () => {
      try {
        const rawOrders = await getUserOrders(user._id);

        const enrichedOrders = await Promise.all(
          rawOrders.map(async (order) => {
            const enrichedProducts = await Promise.all(
              order.products.map(async (item) => {
                const productDetails = await getSingleProduct(item.product);
                return {
                  ...item,
                  productDetails,
                };
              })
            );

            return {
              ...order,
              products: enrichedProducts,
            };
          })
        );

        setOrders(enrichedOrders);
      } catch (error) {
        toast.error('❌ Failed to load orders');
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user?._id) {
      fetchOrdersWithProducts();
    }
  }, [getUserOrders, getSingleProduct, user]);

  const getPaymentLabel = (method) => {
    switch (method) {
      case 'cash_on_delivery':
        return '💵 Cash on Delivery';
      case 'stripe':
        return '💳 Stripe';
      case 'razorpay':
        return '🏦 Razorpay';
      default:
        return '💰 Unknown';
    }
  };
console.log("orders getting"+orders);
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-12">
      <h1 className="text-4xl font-bold text-center text-blue-700">👤 My Profile</h1>

      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow space-y-2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">👥 User Info</h2>
        <p><span className="font-medium text-gray-700">Full Name:</span> {user?.name}</p>
        <p><span className="font-medium text-gray-700">Email:</span> {user?.email}</p>
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
            {orders.flatMap((order) =>
              order.products.map((item, index) => {
                const product = item.productDetails;
                if (!product) return null;
          
                return (
                  <div
                    key={`${order._id}-${index}`}
                    className="p-6 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-start gap-6"
                  >
                    {/* Left Side: Image + Product Info */}
                    <div className="flex gap-4">
                      {/* Product Image */}
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-28 h-28 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-28 h-28 bg-gray-100 flex items-center justify-center rounded-md text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
          
                      {/* Product Info */}
                      <div className="space-y-1 text-gray-700 text-sm">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        <p><span className="font-medium">Price:</span> ₹{item.price.toFixed(2)}</p>
                        <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                        {item.size && <p><span className="font-medium">Size:</span> {item.size}</p>}
                      </div>
                    </div>
          
                    {/* Right Side: Order Info */}
                    <div className="text-sm text-gray-700 space-y-1 text-right md:min-w-[200px]">
                      <p><span className="font-medium">Payment:</span> {getPaymentLabel(order.paymentMethod)} <span className="text-xs text-gray-500">({order.paymentStatus})</span></p>
                      <p><span className="font-medium">Status:</span> {order.status}</p>
                      <p><span className="font-medium">Ordered on:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
        )}
      </div>
    </div>
  );
};
