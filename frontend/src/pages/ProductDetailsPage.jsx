import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RecommendProduct } from "../components/ui/RecommendProduct";
import { StarRating } from "../components/ui/StarRating";
import { fetchSingleProduct } from "../context/productSlice.js";
import { addToCart } from "../context/cartSlice";

export function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const currency = '₹';
  const product = useSelector((state) => state.product.singleProduct);
  const loading = useSelector((state) => state.product.loadingSingle);

  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleProduct(id)).then((res) => {
      if (res.payload?.image?.length > 0) {
        setImage(res.payload.image[0]);
      }
    });
  }, [dispatch, id]);

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      alert("Please provide a rating and comment.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(fetchSingleProduct(id));
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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center theme-transition">
      <div className="text-center">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center theme-transition">
      <div className="text-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Product not found.</p>
      </div>
    </div>
  );

  const reviews = product.reviews || [];
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 theme-transition">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Gallery */}
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%] w-full">
              {product.image.map((img, index) => (
                <img
                  src={img}
                  key={index}
                  loading="lazy"
                  className={`w-[24%] sm:w-full sm:mb-3 cursor-pointer transition-all duration-300 hover:scale-105 rounded-xl border-2 ${
                    img === image 
                      ? "border-primary-500 shadow-lg" 
                      : "border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-600"
                  }`}
                  alt={product.name}
                  onClick={() => setImage(img)}
                />
              ))}
            </div>
            <div className="flex-1">
              <img
                src={image || "/placeholder.png"}
                className="w-full max-w-lg mx-auto rounded-2xl shadow-xl"
                alt={product.name}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 bg-white dark:bg-dark-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-dark-700">
            <h1 className="font-bold text-4xl mb-4 text-gray-900 dark:text-gray-100">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.averageRating || 0} />
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                ({(product.averageRating || 0).toFixed(1)} out of 5)
              </span>
            </div>
            <p className="text-4xl font-bold gradient-text mb-6">{currency}{product.price}</p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{product.description}</p>

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <div className="font-semibold text-xl mb-4 text-gray-900 dark:text-gray-100">Select Size</div>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSize(item)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                        item === size 
                          ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg" 
                          : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 border border-gray-300 dark:border-dark-600"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-4">
              <button
                className="flex-1 btn-primary gap-3 py-4 text-lg"
                onClick={() => {
                  if (product.sizes?.length > 0 && !size) {
                    alert("Please select a size.");
                    return;
                  }
                  dispatch(addToCart({ productId: product._id, size }));
                }}
              >
                <ShoppingCart className="h-6 w-6" />
                Add to Cart
              </button>
              {/* <button className="p-4 border-2 border-gray-300 dark:border-dark-600 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-300 transform hover:scale-105">
                <Heart className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button> */}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <RecommendProduct
            category={product.category}
            subcategory={product.subcategory}
            currentProductId={id}
          />
        </div>

        {/* Review Form */}
        <div className="mt-16 card p-8">
          <h3 className="text-2xl font-bold mb-6 gradient-text">Leave a Review</h3>
          <div className="mb-4">
            <StarRating rating={rating} onRate={setRating} interactive />
          </div>
          <textarea
            className="input-field mb-4"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
          />
          <button
            className="btn-primary"
            onClick={handleSubmitReview}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 gradient-text">Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {visibleReviews.map((review, index) => (
                <div key={index} className="card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{review.name}</span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                </div>
              ))}
              {reviews.length > 3 && (
                <button
                  className="btn-secondary"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                >
                  {showAllReviews ? "View Less" : "View All Reviews"}
                </button>
              )}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}