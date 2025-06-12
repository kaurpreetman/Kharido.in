import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearCartOnServer } from '../context/cartSlice';
import { toast } from 'react-toastify';
import { CheckCircle, Package, CreditCard, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';

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
        return 'Credit/Debit Card (Stripe)';
      case 'razorpay':
        return 'Razorpay';
      case 'cash_on_delivery':
        return 'Cash on Delivery';
      default:
        return method;
    }
  };
console.log(order);
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center theme-transition">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center theme-transition">
        <div className="card p-12 text-center max-w-md">
          <Package className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/products" className="btn-primary gap-2">
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 theme-transition">
      <div className="container mx-auto py-8 px-4">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold gradient-text mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Thank you for your purchase! Your order has been confirmed and will be processed shortly.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Info */}
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Order Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                    <p className="font-mono text-lg text-gray-900 dark:text-gray-100">#{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="text-2xl font-bold gradient-text">₹{order.totalAmount}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Status</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Payment Method</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{getPaymentLabel(order.paymentMethod)}</p>
            </div>

            {/* Delivery Address */}
            {order.address && (
              <div className="card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Delivery Address</h3>
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  <p className="font-medium">{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state}</p>
                  <p>{order.address.zipCode}, {order.address.country}</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="card p-8 h-fit">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Order Items</h3>
            <div className="space-y-4">
              {order.products.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                  {item.product?.image.length ? (
                    <img
                      className="w-16 h-16 object-cover rounded-lg"
                      src={item.product.image[0]}
                      alt={item.product.name || "Product"}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-dark-600 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {item.product?.name || "Unnamed Product"}
                    </h4>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <p>Price: ₹{item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                      {item.size!="null" && <p>Size: {item.size}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/profile" className="btn-secondary gap-2">
            <Package className="w-5 h-5" />
            View Order History
          </Link>
          <Link to="/products" className="btn-primary gap-2">
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};