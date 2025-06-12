import { Link } from "react-router-dom";
import { Star, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../context/cartSlice";

export const ProductCard = ({ product }) => {
  const currency = '₹';
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  const truncate = (text, maxLength = 60) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const handleAddToCart = () => {
    if (product.sizes?.length > 0) {
      alert("Please select a size first before adding to cart.");
      return;
    }
    dispatch(addToCart({ productId: product._id, size: null, quantity: 1 }));
  };

  return (
    <div 
      className="
        group relative bg-white dark:bg-dark-800 rounded-3xl shadow-lg hover:shadow-2xl 
        transition-all duration-500 transform hover:-translate-y-3 overflow-hidden 
        border border-gray-100 dark:border-dark-700 card-hover 
        w-full xs:w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-t-3xl">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.image?.[0]}
            alt={product.name}
            className="w-full h-40 sm:h-48 md:h-56 object-cover transition-transform duration-700"
          />
        </Link>

        {product.bestseller && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-xl shadow-lg animate-bounce-subtle flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Bestseller
          </div>
        )}

        {product.originalPrice && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-xl shadow-lg">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 md:p-5">
        <div className="flex items-center gap-1 mb-2">
          <span className="px-2 py-[2px] bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-300 text-[10px] font-medium rounded-full">
            {product.category}
          </span>
          {product.subCategory && (
            <span className="px-2 py-[2px] bg-gradient-to-r from-secondary-100 to-secondary-200 dark:from-secondary-900/30 dark:to-secondary-800/30 text-secondary-700 dark:text-secondary-300 text-[10px] font-medium rounded-full">
              {product.subCategory}
            </span>
          )}
        </div>

        <Link
          to={`/products/${product._id}`}
          className="block text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 mb-2 leading-tight"
        >
          {truncate(product.name, 50)}
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.averageRating || 0)
                    ? "text-amber-400 fill-current"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
            ({(product.averageRating || 0).toFixed(1)})
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-500">
            {product.reviewCount || 0} reviews
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-base sm:text-lg font-bold gradient-text">
              {currency}{product.price?.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                {currency}{product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white p-2 rounded-xl shadow-lg hover:shadow-xl"
          >
            <ShoppingCart className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/5 to-secondary-500/5 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className={`absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-primary-500/20 to-secondary-500/20 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`} style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />
    </div>
  );
};
