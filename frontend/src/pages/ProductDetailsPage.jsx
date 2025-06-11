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

  const currency = '$';
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

  if (loading) return <div className="p-10">Loading...</div>;
  if (!product) return <div className="p-10">Product not found.</div>;

  const reviews = product.reviews || [];
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="border-t-2 pt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Image Gallery */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%] w-full">
            {product.image.map((img, index) => (
              <img
                src={img}
                key={index}
                loading="lazy"
                className={`w-[24%] sm:w-full sm:mb-3 cursor-pointer transition-transform hover:scale-105 border ${img === image ? "border-blue-600" : "border-transparent"}`}
                alt={product.name}
                onClick={() => setImage(img)}
              />
            ))}
          </div>
          <div className="flex-1">
            <img
              src={image || "/placeholder.png"}
              className="w-full max-w-lg mx-auto rounded-lg shadow-md"
              alt={product.name}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="font-bold text-3xl mt-2">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={product.averageRating || 0} />
            <span className="text-sm text-gray-500">({(product.averageRating || 0).toFixed(1)} out of 5)</span>
          </div>
          <p className="mt-5 text-3xl font-medium">{currency}{product.price}</p>
          <p className="mt-3 text-gray-600">{product.description}</p>

          {/* Size Selector */}
          {product.sizes?.length > 0 && (
            <div className="my-8">
              <div className="font-medium text-lg mb-2">Select Size</div>
              <div className="flex gap-2">
                {product.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`border px-4 py-2 rounded-md ${item === size ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex gap-4 mt-8">
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              onClick={() => {
                if (product.sizes?.length > 0 && !size) {
                  alert("Please select a size.");
                  return;
                }
                dispatch(addToCart({ productId: product._id, size }));
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <RecommendProduct
        category={product.category}
        subcategory={product.subcategory}
        currentProductId={id}
      />

      {/* Review Form */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
        <StarRating rating={rating} onRate={setRating} interactive />
        <textarea
          className="w-full border rounded-md p-2 mt-4"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-700"
          onClick={handleSubmitReview}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {visibleReviews.map((review, index) => (
              <div key={index} className="border p-4 rounded-md shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{review.name}</span>
                  <StarRating rating={review.rating} />
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
