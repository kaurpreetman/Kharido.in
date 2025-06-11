import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star } from "lucide-react";

export const ProductCard = ({ product }) => {
  const currency = 'Rs.';

  const truncate = (text, maxLength = 80) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Product Image */}
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image?.[0]}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <Link
          to={`/products/${product._id}`}
          className="text-lg font-semibold text-gray-800 hover:text-blue-600"
        >
          {truncate(product.name, 80)}
        </Link>

        {/* Rating & Price */}
        <div className="mt-2 flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">
              {product.averageRating.toFixed(2)}
            </span>
          </div>

          {/* Price */}
          <span className="text-lg font-bold text-gray-900">
            {currency} {product.price?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
