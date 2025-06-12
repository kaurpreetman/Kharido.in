import { useSelector } from 'react-redux';
import { Package, Truck, CreditCard } from 'lucide-react';

export function OrderSummary() {
  const { cartItems, subtotal, total, delivery_fee } = useSelector((state) => state.cart);
  const products = useSelector((state) => state.product.products);
  const currency = '₹';

  const flattenedCartItems = [];

  Object.entries(cartItems).forEach(([productId, sizeMap]) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    Object.entries(sizeMap).forEach(([size, quantity]) => {
      flattenedCartItems.push({
        productId,
        size,
        quantity,
        name: product.name,
        price: product.price,
        image: product.image?.[0]
      });
    });
  });

  return (
    <div className="space-y-6">
      {/* Items List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Order Items</h3>
        </div>
        
        {flattenedCartItems.length > 0 ? (
          flattenedCartItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl"
            >
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Size: {item.size} • Qty: {item.quantity}
                </p>
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {currency}{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            Your cart is empty or still loading.
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      {flattenedCartItems.length > 0 && (
        <div className="border-t border-gray-200 dark:border-dark-600 pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Subtotal</span>
              <span className="font-medium">{currency}{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Shipping</span>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">
                {currency}{delivery_fee.toFixed(2)}
              </span>
            </div>
            
            <div className="border-t border-gray-200 dark:border-dark-600 pt-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span className="font-bold text-lg text-gray-900 dark:text-gray-100">Total</span>
                </div>
                <span className="font-bold text-xl gradient-text">
                  {currency}{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}