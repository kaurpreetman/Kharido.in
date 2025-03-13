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

    useEffect(() => {
        if (products) {
            const foundProduct = products.find((item) => item._id == id);
            if (foundProduct) {
                setProduct(foundProduct);
                setImage(foundProduct.image[0]);
                setSize('');
                // Mock reviews
                setReviews([
                    { name: "Alice", rating: 4, comment: "Great quality, worth the price!" },
                    { name: "Bob", rating: 5, comment: "Absolutely love it!" },
                    { name: "Chris", rating: 3, comment: "Good, but could be better." },
                    { name: "Diana", rating: 5, comment: "Perfect fit and amazing style." },
                    { name: "Eve", rating: 2, comment: "Not what I expected." },
                ]);
            }
        }
    }, [id, products]);

    if (!product) return <div>Product not found</div>;

    const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

    return (
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
                        {product.image.map((item, index) => (
                            <img
                                src={item}
                                key={index}
                                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer transition-transform hover:scale-105 border ${
                                    item === image ? "border-blue-600" : "border-transparent"
                                }`}
                                alt={product.name}
                                onClick={() => setImage(item)}
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

                <div className="flex-1">
                    <h1 className="font-bold text-3xl mt-2">{product.name}</h1>
                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${
                                    i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                            />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">
                            ({product.rating} out of 5)
                        </span>
                    </div>
                    <p className="mt-5 text-3xl font-medium">
                        {currency}
                        {product.price}
                    </p>
                    <p className="mt-3 text-gray-600 leading-relaxed">{product.description}</p>
                    <div className="flex flex-col gap-4 my-8">
                        <div className="font-medium text-lg">Select Size</div>
                        <div className="flex gap-2">
                            {product.sizes.map((item, index) => (
                                <button
                                    onClick={() => setSize(item)}
                                    className={`border border-gray-400 px-4 py-2 rounded-md transition-colors ${
                                        item === size ? "bg-blue-600 text-white" : "hover:bg-blue-50"
                                    }`}
                                    key={index}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
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
            <RecommendProduct category={product.category} subcategory={product.subcategory} currentProductId={id} />
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
