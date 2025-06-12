import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCart,
  clearCart,
  calculateTotals,
  updateCartQuantity,
  removeFromCart,
} from '../context/cartSlice';
import { fetchProducts } from '../context/productSlice';

export function CartPage() {
  const dispatch = useDispatch();

  const {
    cartItems,
    subtotal,
    delivery_fee,
    total
  } = useSelector((state) => state.cart);

  const products = useSelector((state) => state.product.products);
  const currency = '₹';

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      dispatch(calculateTotals(products));
    }
  }, [cartItems, products, dispatch]);

  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity <= 0) return;
    dispatch(updateCartQuantity({ productId, size, quantity: newQuantity }));
  };

  const removeItem = (productId, size) => {
    dispatch(removeFromCart({ productId, size }));
  };

  const isCartEmpty = !Object.keys(cartItems).length;

  if (isCartEmpty) {
    return (
      <div className="container py-20 text-center bg-gray-50 dark:bg-dark-900 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Looks like you haven't added any items yet. Start shopping to fill your cart!
          </p>
          <Link
            to="/products"
            className="btn-primary gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 bg-gray-50 dark:bg-dark-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(cartItems).map(([productId, sizeMap]) => {
              const product = products.find((p) => p._id === productId);
              if (!product) return null;

              return Object.entries(sizeMap).map(([size, quantity]) => (
                <div
                  key={`${productId}-${size}`}
                  className="card p-6 flex items-center gap-6 hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={product.image?.[0]}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Size: {size}</p>
                    <p className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                      {currency}{product.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(productId, size, quantity - 1)}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-300"
                    >
                      <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-800 dark:text-gray-200">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(productId, size, quantity + 1)}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-300"
                    >
                      <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(productId, size)}
                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ));
            })}
          </div>

          {/* Order Summary */}
          <div className="card p-8 h-fit sticky top-8">
            <h2 className="text-2xl font-semibold mb-6 gradient-text">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Subtotal</span>
                <span className="font-semibold">{currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Shipping Fee</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{currency}{delivery_fee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-dark-600 pt-4 flex justify-between font-bold text-xl">
                <span className="text-gray-800 dark:text-gray-200">Total</span>
                <span className="gradient-text">{currency}{total.toFixed(2)}</span>
              </div>

              <Link
                to={total < 43 ? '#' : '/checkout'}
                className={`block w-full text-center mt-6 transition-all duration-300 ${
                  total < 43
                    ? 'btn-ghost cursor-not-allowed opacity-50'
                    : 'btn-primary'
                }`}
                onClick={e => total < 43 && e.preventDefault()}
              >
                {total < 43 ? 'Minimum order not met' : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Link>

              <button
                onClick={() => dispatch(clearCart())}
                className="btn-ghost w-full mt-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;