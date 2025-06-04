import { Link } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { Star, ShoppingCart } from "lucide-react";
import { useContext } from "react";

export const ProductCard = ({ product }) => {
  // Extracting currency from context
  const { currency } = useContext(ShopContext);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Link to Product Details */}
      <Link to={`/products/${product._id}`}>
        <img
  src={product.image?.[0]} 
  alt={product.name}
  className="w-full h-48 object-cover"
/>
      </Link>
      <div className="p-4">
        {/* Product Name */}
        <Link
          to={`/products/${product._id}`}
          className="text-lg font-semibold text-gray-800 hover:text-primary-600"
        >
          {product.name}
        </Link>
        {/* Product Rating */}
        <div className="mt-2 flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600">{product.
averageRating
 || "N/A"}</span>
        </div>
        {/* Product Price and Add to Cart Button */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {currency} {product.price.toFixed(2)}
          </span>
          {/* <button
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            onClick=
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button> */}
        </div>
      </div>
    </div>
  );
};
