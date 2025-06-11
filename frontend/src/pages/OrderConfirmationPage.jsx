import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearCartOnServer } from '../context/cartSlice';
import { toast } from 'react-toastify';
import { CheckCircle } from 'lucide-react';

export const OrderConfirmationPage = () => {
  const { userId, orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyStripePayment = async () => {
      try {
        const res = await axios.post(
          'http://localhost:5000/api/orders/verifyStripe',
          { orderId, success: 'true' },
          { withCredentials: true }
        );
     

        if (res.data.success) {
          toast.success('✅ Stripe payment verified!');
          dispatch(clearCartOnServer());
        } else {
          toast.error('⚠️ Stripe verification failed.');
        }
      } catch (err) {
        console.error('Stripe verification error:', err);
        toast.error('❌ Stripe verification failed.');
      }
    };

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${userId}/${orderId}`, {
          withCredentials: true,
        });

        const orderData = res.data.order;
        setOrder(orderData);

        if (orderData.paymentMethod === 'stripe' && orderData.paymentStatus === 'pending') {
          await verifyStripePayment();
        } else if (
          orderData.paymentMethod === 'cash_on_delivery' &&
          orderData.paymentStatus === 'pending'
        ) {
          dispatch(clearCartOnServer());
        } else if (orderData.paymentMethod === 'razorpay') {
          if (orderData.paymentStatus === 'paid') {
            dispatch(clearCartOnServer());
          } else {
            toast.warning('⏳ Razorpay payment not verified yet.');
          }
        }
      } catch (err) {
        console.error('Order fetch error:', err);
        toast.error('❌ Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (userId && orderId) {
      fetchOrder();
    }
  }, [userId, orderId, dispatch]);

  const getPaymentLabel = (method) => {
    switch (method) {
      case 'stripe':
        return 'Stripe';
      case 'razorpay':
        return 'Razorpay';
      case 'cash_on_delivery':
        return 'Cash on Delivery';
      default:
        return method;
    }
  };

  if (loading) {
    return <div className="text-center py-20">⏳ Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">❌ Order failed or not found.</h2>
        <Link to="/products" className="text-blue-600 hover:underline">
          🛍️ Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">🎉 Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-8">
          Your order has been confirmed and will be shipped soon 🚚
        </p>
      </div>

      {/* Order Info Section */}
      <div className="bg-gray-100 p-6 rounded-md shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">🧾 Order Summary</h2>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment Method:</strong> {getPaymentLabel(order.paymentMethod)}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        {order.deliveredAt && (
          <p><strong>Delivered At:</strong> {new Date(order.deliveredAt).toDateString()}</p>
        )}
        {order.address && (
          <>
            <h3 className="mt-4 font-semibold">📍 Delivery Address</h3>
            <p>{order.address.street}, {order.address.city}</p>
            <p>{order.address.state}, {order.address.zipCode}, {order.address.country}</p>
          </>
        )}
      </div>

      {/* Products Section */}
      <div className="space-y-6">
        {order.products.map((item, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-sm rounded-lg flex flex-col md:flex-row items-center border border-gray-200"
          >
            <div className="flex items-start gap-6">
              {item.product?.image ? (
                <img
                  className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                  src={item.product.image}
                  alt={item.product.name || "Product"}
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="text-left">
                <h2 className="text-lg font-semibold">
                  {item.product?.name || "Unnamed Product"}
                </h2>
                <div className="mt-2 text-gray-600 text-sm space-y-1">
                  <p>💰 Price: ₹{item.price}</p>
                  <p>🔢 Quantity: {item.quantity}</p>
                  {item.size && <p>📏 Size: {item.size}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-6">
        <Link to="/profile" className="text-blue-600 hover:text-blue-700 font-medium">
          🧾 View Order History
        </Link>
        <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium">
          🛍️ Continue Shopping
        </Link>
      </div>
    </div>
  );
};
