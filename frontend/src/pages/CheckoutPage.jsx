import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, CreditCard, MapPin } from 'lucide-react';

import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PaymentSection } from '../components/checkout/PaymentSection';

import { fetchCart, clearCart, calculateTotals } from '../context/cartSlice';
import { fetchProducts } from '../context/productSlice';
import { setLastOrder } from '../context/uiSlice';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const { cartItems, subtotal, delivery_fee, total } = useSelector(state => state.cart);
  const { addresses, selectedAddress } = useSelector(state => state.address);
  const { user, authLoading } = useSelector(state => state.user);
  const products = useSelector(state => state.product.products);

  useEffect(() => {
    if (!authLoading && user) dispatch(fetchCart());
  }, [authLoading, user, dispatch]);

  useEffect(() => {
    if (!products || products.length === 0) dispatch(fetchProducts());
  }, [products, dispatch]);

  useEffect(() => {
    if (Object.keys(cartItems).length > 0 && products.length > 0) {
      dispatch(calculateTotals(products));
    }
  }, [cartItems, products, dispatch]);

  const initRazorpay = (orderRes, orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderRes.totalAmount * 100,
      currency: 'INR',
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: orderRes.orderId,
      handler: async (response) => {
        try {
          await axios.post(
            'http://localhost:5000/api/orders/verifyRazorpay',
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData._id,
              userId: user._id
            },
            { withCredentials: true }
          );

          toast.success('🎉 Payment successful and verified!');
          dispatch(setLastOrder(orderData));
          navigate(`/order-success?${user._id}/${orderData._id}`);
        } catch (error) {
          toast.error('❌ Razorpay verification failed.');
        }
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
      },
      theme: { color: '#3399cc' },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('📍 Please select a shipping address.');
      return;
    }

    if (!paymentMethod) {
      toast.error('💳 Please select a payment method.');
      return;
    }

    const orderProducts = [];

    Object.entries(cartItems).forEach(([productId, sizeMap]) => {
      const product = products.find(p => p._id === productId);
      if (!product) return;
      Object.entries(sizeMap).forEach(([size, quantity]) => {
        orderProducts.push({
          product: productId,
          quantity,
          price: product.price,
          size,
        });
      });
    });

    const formattedAddress = {
      street: selectedAddress.street,
      city: selectedAddress.city,
      zipCode: selectedAddress.zipCode,
      country: selectedAddress.country,
      state: selectedAddress.state,
    };

    const order = {
      products: orderProducts,
      totalAmount: total,
      address: formattedAddress,
      paymentMethod,
    };

    try {
      setLoading(true);

      let response;

      if (paymentMethod === 'razorpay') {
        response = await axios.post('http://localhost:5000/api/orders/razorpay', order, { withCredentials: true });
        initRazorpay(response.data, response.data.order);
        return;
      }
      
      if (paymentMethod === 'stripe') {
        response = await axios.post('http://localhost:5000/api/orders/stripe', order, { withCredentials: true });
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
        return;
      }

      if (paymentMethod === 'cash_on_delivery') {
        response = await axios.post('http://localhost:5000/api/orders/cod', order, { withCredentials: true });
        toast.success('🎉 Order placed successfully!');
        navigate(`/order-success/${user._id}/${response.data.order._id}`);
        return;
      }

      toast.error('⚠️ Unknown payment method');
    } catch (error) {
      console.error("Checkout Error:", error.response?.data || error.message);
      toast.error('❌ Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 theme-transition">
      <div className="container mx-auto py-8 px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            <h1 className="text-4xl font-display font-bold gradient-text">Checkout</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Complete your order and get ready for delivery</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Shipping Address</h2>
              </div>
              <CheckoutForm loading={loading} />
            </div>

            {/* Payment Method */}
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Payment Method</h2>
              </div>
              <PaymentSection selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod} />
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              className={`w-full py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                loading || !selectedAddress || !paymentMethod 
                  ? 'bg-gray-300 dark:bg-dark-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                  : 'btn-primary shadow-xl hover:shadow-2xl'
              }`}
              disabled={loading || !selectedAddress || !paymentMethod}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="spinner w-6 h-6"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <ShoppingBag className="w-6 h-6" />
                  Place Order
                </div>
              )}
            </button>
          </div>

          {/* Order Summary */}
          <div className="card p-8 h-fit sticky top-8">
            <h2 className="text-2xl font-semibold mb-6 gradient-text">Order Summary</h2>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};