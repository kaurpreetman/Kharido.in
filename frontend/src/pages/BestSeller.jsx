import React, { useEffect } from 'react';
import BestSeller from '../components/BestSeller';
import NewsletterBox from '../components/NewsletterBox';
import OurPolicy from '../components/OurPolicy';
import { ProductCard } from '../components/ui/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBestsellers } from '../context/productSlice';
import { Star, TrendingUp, Award } from 'lucide-react';

export function BestSellers() {
  const dispatch = useDispatch();
  const bestsellers = useSelector((state) => state.product.bestsellers);
  const loading = useSelector((state) => state.product.loading);

  useEffect(() => {
    dispatch(fetchBestsellers());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 theme-transition">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="w-10 h-10 text-amber-500 fill-current animate-bounce-subtle" />
            <h1 className="text-5xl font-display font-bold gradient-text">
              Best Sellers
            </h1>
            <TrendingUp className="w-10 h-10 text-primary-600 dark:text-primary-400 animate-bounce-subtle" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover our top-selling products, loved by customers for their quality, value, and style. 
            Handpicked favorites that you don't want to miss!
          </p>
        </div>

        {/* Stats Section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Star, value: '4.9★', label: 'Average Rating', color: 'from-amber-500 to-amber-600' },
            { icon: TrendingUp, value: '50K+', label: 'Happy Customers', color: 'from-green-500 to-green-600' },
            { icon: Award, value: '100+', label: 'Bestselling Items', color: 'from-purple-500 to-purple-600' }
          ].map(({ icon: Icon, value, label, color }, index) => (
            <div key={index} className="card p-8 text-center group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold gradient-text mb-2">{value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</div>
            </div>
          ))}
        </div> */}

        {/* Products Section */}
        <section className="mb-16">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="spinner mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading bestsellers...</p>
              </div>
            </div>
          ) : bestsellers.length === 0 ? (
            <div className="card p-12 text-center">
              <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 dark:text-gray-400">No bestsellers found at the moment.</p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">Check back soon for our top products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {bestsellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
         <div className="relative z-10">
            <OurPolicy />
          </div>
        {/* Newsletter Section */}
        {/* <section className="card p-12 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white text-center border-0">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-4">
              Stay Updated with Our Bestsellers
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Be the first to know when new products join our bestseller list!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300"
              />
              <button className="px-8 py-4 bg-white text-primary-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
}

export default BestSellers;