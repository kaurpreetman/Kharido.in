import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function OrderConfirmationPage() {
  const { lastOrder, setLastOrder, token, clearCart } = useContext(ShopContext);
  const { orderId: paramOrderId } = useParams();
  const [loading, setLoading] = useState(!lastOrder);
  const orderId = paramOrderId || localStorage.getItem("lastOrderId");

  useEffect(() => {
    if (!lastOrder && orderId) {
      const fetchOrder = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/orders/${orderId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setLastOrder(response.data.order);
          clearCart();
          localStorage.removeItem("lastOrderId");
        } catch (error) {
          console.error("Failed to fetch last order:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [lastOrder, orderId, token, setLastOrder]);

  if (loading) {
    return <div className="text-center py-20">⏳ Loading order details...</div>;
  }


  if (!lastOrder) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">No order to display.</h2>
        <Link to="/products" className="text-blue-600 hover:underline">
          🛍️ Continue Shopping
        </Link>
      </div>
    );
  }

  const getPaymentLabel = (method) => {
    switch (method) {
      case "stripe":
        return "Stripe";
      case "razorpay":
        return "Razorpay";
      case "cash_on_delivery":
        return "Cash on Delivery";
      default:
        return method;
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">🎉 Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-8">
          Your order has been confirmed and will be shipped soon 🚚
        </p>
      </div>
      <div className="space-y-6">
        {lastOrder.products.map((item, index) => (
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
                  {item.product.name || "Unnamed Product"}
                </h2>
                <div className="mt-2 text-gray-600 text-sm space-y-1">
                  <p>
                    💰 <span className="font-medium">${item.price}</span>
                  </p>
                  <p>🔢 Quantity: {item.quantity}</p>
                  {item.size && <p>📏 Size: {item.size}</p>}
                  <p>💳 Payment: {getPaymentLabel(lastOrder.paymentMethod)}</p>
                </div>
                {lastOrder.createdAt && (
                  <p className="mt-4 text-gray-400 text-sm">
                    🗓️ Date:{" "}
                    <span className="text-gray-500">
                      {new Date(lastOrder.createdAt).toDateString()}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:ml-auto mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <p className="text-sm text-gray-600">✅ Ready to ship</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                📦 Track Order
              </button>
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
}
