import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector, useDispatch } from 'react-redux';

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
      key: import.meta.env.RAZORPAY_KEY_ID,
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

      // 🚀 Handle payment based on method
      if (paymentMethod === 'razorpay') {
        response = await axios.post('http://localhost:5000/api/orders/razorpay', order, { withCredentials: true });
        initRazorpay(response.data, response.data.order);
        return; // Don't proceed further
      }
      
      if (paymentMethod === 'stripe') {
        response = await axios.post('http://localhost:5000/api/orders/stripe', order, { withCredentials: true });
        const stripe = await loadStripe('pk_test_51QXe1dKyzyrm8ods7sdlcAVHULekjEx3E9yarZTqSAhJ7KLmiA6AR7DUasY4jSVzm5yuAcDl58QBURibaCr9iLYp00Qmmmjtjx');
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
        return;
      }

      // 💸 COD (no gateway)
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
    <div className="container mx-auto py-8 px-4 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🛒 Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">📍 Shipping Address</h2>
            <CheckoutForm loading={loading} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">💳 Payment Method</h2>
            <PaymentSection selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod} />
          </div>

          <div className="mt-8">
            <button
              onClick={handlePlaceOrder}
              className={`w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors ${
                loading || !selectedAddress || !paymentMethod ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading || !selectedAddress || !paymentMethod}
            >
              {loading ? '⏳ Processing...' : '🛍️ Place Order'}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 shadow-md rounded-lg p-6 lg:sticky lg:top-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📦 Order Summary</h2>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};
