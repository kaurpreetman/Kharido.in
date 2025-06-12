import { Link } from 'react-router-dom';
import { ArrowRight , Star } from 'lucide-react';
import { ProductCard } from '../components/ui/ProductCard';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import HeroBanner  from '../components/ui/HeroBanner';
import OurPolicy from '../components/OurPolicy';
import { fetchBestsellers } from '../context/productSlice'
export const HomePage = () => {
  const dispatch = useDispatch();
  const bestsellers = useSelector((state) => state.product.bestsellers);
  const [featuredProducts, setFeaturedProducts] = useState([]);

useEffect(() => {
  console.log("dispatching bestsellers");
  dispatch(fetchBestsellers());
}, [dispatch]);

  useEffect(() => {
    setFeaturedProducts(bestsellers.slice(0, 4));
  }, [bestsellers]);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      {/* <section className="relative h-[500px] bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              🛍️ Discover Amazing Products at Great Prices
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              ✨ Shop the latest trends and get exclusive deals on a wide range of categories!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors"
            >
              Shop Now <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section> */}
      <HeroBanner />

      {/* Featured Products */}
     <section className="container mx-auto px-4">
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-2">
      <Star className="h-6 w-6 text-yellow-500" />
      <h2 className="text-2xl font-semibold text-gray-800">Bestsellers This Week</h2>
    </div>
    <Link
      to="/bestseller"
      className="text-sm text-blue-600 hover:underline transition"
    >
      View All
    </Link>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {featuredProducts.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
</section>
      {/* Shop by Category */}
      <section className="container">
        <h2 className="text-3xl font-bold mb-8">🧭 Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/products?category=Electronics" className="relative h-64 rounded-lg overflow-hidden group shadow-md">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
              alt="Electronics"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">📱 Electronics</h3>
            </div>
          </Link>

          <Link to="/products?category=Fashion" className="relative h-64 rounded-lg overflow-hidden group shadow-md">
            <img
              src="https://images.unsplash.com/photo-1521334884684-d80222895322"
              alt="Fashion"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">👗 Fashion</h3>
            </div>
          </Link>

          <Link to={`/products?category=${encodeURIComponent('Home & Living')}`} className="relative h-64 rounded-lg overflow-hidden group shadow-md">
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
              alt="Home & Living"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">🏡 Home & Living</h3>
            </div>
          </Link>
        </div>
        <OurPolicy />
      </section>
    </div>
  );
};
