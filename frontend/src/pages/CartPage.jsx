import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export function CartPage() {
  const {
    cartItems,
    currency,
    products,
    updateQuantity,
    clearCart,
    removeItem,
    subtotal,
    total,
    delivery_fee,
  } = useContext(ShopContext);

  const isCartEmpty = !Object.keys(cartItems).length;

  if (isCartEmpty) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">🛒 Your cart is empty</h2>
        <p className="text-gray-600 mb-8">
          😢 Looks like you haven't added any items yet.
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          🛍️ Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8">🛒 Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {Object.entries(cartItems).map(([productId, sizeMap]) => {
            const product = products.find((p) => p._id === productId);
            if (!product) return null;

            return Object.entries(sizeMap).map(([size, quantity]) => (
              <div
                key={`${productId}-${size}`}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
              >
                {/* Product Image */}
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-md"
                />

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">📏 Size: {size}</p>
                  <p className="text-primary-600 font-medium">
                    💸 {currency}
                    {product.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(productId, size, Math.max(1, quantity - 1))
                    }
                    className="p-1 rounded-md hover:bg-gray-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(productId, size, quantity + 1)
                    }
                    className="p-1 rounded-md hover:bg-gray-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Remove Item */}
                <button
                  onClick={() => removeItem(productId, size)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ));
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">📦 Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>🧾 Subtotal</span>
              <span>
                {currency}
                {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>🚚 Shipping Fee</span>
              <span>
                {currency}
                {delivery_fee.toFixed(2)}
              </span>
            </div>
            <div className="border-t pt-4 flex justify-between font-semibold">
              <span>💰 Total</span>
              <span>
                {currency}
                {total.toFixed(2)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              ✅ Proceed to Checkout
            </Link>

            <button
              onClick={clearCart}
              className="block w-full text-gray-600 text-center px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              🗑️ Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
