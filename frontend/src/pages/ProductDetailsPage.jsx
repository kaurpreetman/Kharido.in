import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { RecommendProduct } from "../components/ui/RecommendProduct";

export function ProductDetailsPage() {
  const { id } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();

  }, [id, products]);

const fetchReviews = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/products/getsingle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: id }),
    });

    const data = await res.json();
    if (res.ok) {
      setProduct(data.product);
      setReviews(data.product.reviews || []);
    } else {
      console.error("Failed to fetch product:", data.message);
    }
  } catch (err) {
    console.error("Failed to fetch product:", err);
  }
};
  const handleSubmitReview = async () => {
  if (!rating || !comment.trim()) {
    alert("Please provide a rating and comment.");
    return;
  }

  try {
    setIsSubmitting(true);
    const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", 
      body: JSON.stringify({ rating, comment })
    });

    const data = await res.json();
    if (res.ok) {
      // Refetch reviews and updated rating after review submission
      await fetchReviews();
      setRating(0);
      setComment('');
    } else {
      alert(data.message || "Failed to submit review.");
    }
  } catch (err) {
    console.error("Review submission failed:", err);
  } finally {
    setIsSubmitting(false);
  }
};

  if (!product) return <div className="p-10">Product not found.</div>;

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="border-t-2 pt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Image Section */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%] w-full">
            {product.image.map((img, index) => (
              <img
                src={img}
                key={index}
                className={`w-[24%] sm:w-full sm:mb-3 cursor-pointer transition-transform hover:scale-105 border ${
                  img === image ? "border-blue-600" : "border-transparent"
                }`}
                alt={product.name}
                onClick={() => setImage(img)}
              />
            ))}
          </div>
          <div className="flex-1">
            <img
              src={image}
              className="w-full max-w-lg mx-auto rounded-lg shadow-md"
              alt={product.name}
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1">
          <h1 className="font-bold text-3xl mt-2">{product.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < (product.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">
              ({(product.averageRating || 0).toFixed(1)} out of 5)
            </span>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {product.price}
          </p>
          <p className="mt-3 text-gray-600 leading-relaxed">{product.description}</p>

          {/* Size Selector */}
          <div className="flex flex-col gap-4 my-8">
            <div className="font-medium text-lg">Select Size</div>
            <div className="flex gap-2">
              {product.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border px-4 py-2 rounded-md transition-colors ${
                    item === size ? "bg-blue-600 text-white" : "hover:bg-blue-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => addToCart(product._id, size)}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <RecommendProduct
        category={product.category}
        subcategory={product.subcategory}
        currentProductId={id}
      />
    
        {/* Review Form */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                onClick={() => setRating(i)}
                className={`cursor-pointer h-6 w-6 ${
                  i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 mb-4"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={handleSubmitReview}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      {/* Reviews */}
      <div className="mt-12">
        <h2 className="font-semibold text-2xl mb-6">Customer Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {visibleReviews.map((review, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{review.name}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
            {reviews.length > 3 && (
              <button
                className="text-blue-600 mt-4 hover:underline"
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? "View Less" : "View All Reviews"}
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        )}

      </div>
    </div>
  );
}
