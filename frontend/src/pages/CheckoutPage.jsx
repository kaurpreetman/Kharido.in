import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PaymentSection } from '../components/checkout/PaymentSection';
import { ShopContext } from '../context/ShopContext';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const {
    user,
    token,
    cartItems,
    clearCart,
    products,
    addresses,
    selectedAddress,
    subtotal,
    delivery_fee,
    total,
    currency,
    setLastOrder
  } = useContext(ShopContext);

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
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
      const product = products.find((p) => p._id === productId);
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
      user: user?._id,
      products: orderProducts,
      totalAmount: total,
      address: formattedAddress,
      paymentMethod,
    };

    try {
      setLoading(true);
      let response;
    
      switch (paymentMethod) {
        case 'razorpay':
          response = await axios.post('http://localhost:5000/api/orders/razorpay', order, authHeader);
          break;
        case 'stripe':
          response = await axios.post('http://localhost:5000/api/orders/stripe', order, authHeader);
          const stripe = await loadStripe('pk_test_51QXe1dKyzyrm8ods7sdlcAVHULekjEx3E9yarZTqSAhJ7KLmiA6AR7DUasY4jSVzm5yuAcDl58QBURibaCr9iLYp00Qmmmjtjx'); // ← replace with your Stripe publishable key
          setLastOrder(response.data.order);
          await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
          return; // stop further code
        case 'cash_on_delivery':
          response = await axios.post('http://localhost:5000/api/orders/cod', order, authHeader);
          break;
        default:
          toast.error('⚠️ Unsupported payment method selected.');
          return;
      }
    
      toast.success('🎉 Order placed successfully!');
      clearCart();
      setLastOrder(response.data.order);
      navigate('/order-success');
    } catch (error) {
      console.error('Order Error:', error);
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
            <PaymentSection
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />
          </div>

          <div className="mt-8">
            <button
              onClick={handlePlaceOrder}
              className={`w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors ${
                loading || !selectedAddress || !paymentMethod
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              disabled={loading || !selectedAddress || !paymentMethod}
            >
              {loading ? '⏳ Processing...' : '🛍️ Place Order'}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 shadow-md rounded-lg p-6 lg:sticky lg:top-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📦 Order Summary</h2>
          <OrderSummary products={Object.values(cartItems)} />
        </div>
      </div>
    </div>
  );
};
