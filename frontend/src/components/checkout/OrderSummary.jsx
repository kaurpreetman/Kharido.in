import { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

export function OrderSummary({ products }) {
  const { cartItems, total, delivery_fee, subtotal, currency } = useContext(ShopContext);

  // Convert nested cartItems into a flat list for rendering
  const flattenedCartItems = Object.entries(cartItems).flatMap(([itemId, sizes]) =>
    Object.entries(sizes).map(([size, quantity]) => {
      // Find the product details by itemId
      const product = products.find((product) => product._id === itemId);

      return {
        itemId,
        size,
        quantity,
        name: product?.name ,
        price: product?.price,
      };
    })
  );

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
      <div className="space-y-4">
        {flattenedCartItems.length > 0 ? (
          flattenedCartItems.map((item) => (
            <div key={`${item.itemId}-${item.size}`} className="flex justify-between text-sm text-gray-700">
              <span>
                {item.name} ({item.size}) <span className="text-gray-500">x {item.quantity}</span>
              </span>
              <span className="font-medium">
                {currency}{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        )}
      </div>
      {flattenedCartItems.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between text-sm text-gray-700">
            <span>Subtotal</span>
            <span>{currency}{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700 mt-2">
            <span>Shipping</span>
            <span className="text-green-500">{currency}{delivery_fee}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-800 mt-4">
            <span>Total</span>
            <span>{currency}{total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
