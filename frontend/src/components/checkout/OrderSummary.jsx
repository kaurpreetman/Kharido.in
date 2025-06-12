import { useSelector } from 'react-redux';

export function OrderSummary() {
  const { cartItems, subtotal, total, delivery_fee } = useSelector((state) => state.cart);
  const products = useSelector((state) => state.product.products);
  const currency = 'Rs.';

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
        price: product.price
      });
    });
  });

  return (
    <div className="space-y-4">
      {flattenedCartItems.length > 0 ? (
        flattenedCartItems.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex justify-between text-sm text-gray-700"
          >
            <span>
              {item.name} ({item.size}){' '}
              <span className="text-gray-500">× {item.quantity}</span>
            </span>
            <span className="font-medium">
              {currency}
              {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">Your cart is empty or still loading.</p>
      )}

      {flattenedCartItems.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between text-sm text-gray-700">
            <span>Subtotal</span>
            <span>{currency}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700 mt-2">
            <span>Shipping</span>
            <span className="text-green-600">{currency}{delivery_fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-800 mt-4">
            <span>Total</span>
            <span>{currency}{total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
