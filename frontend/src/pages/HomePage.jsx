import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, Award, Users, ShoppingBag, Smartphone, Shirt, Home, Gamepad2, Palette, Book } from 'lucide-react';
import { ProductCard } from '../components/ui/ProductCard';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeroBanner from '../components/ui/HeroBanner';
import OurPolicy from '../components/OurPolicy';
import { fetchBestsellers } from '../context/productSlice';

export const HomePage = () => {
  const dispatch = useDispatch();
  const bestsellers = useSelector((state) => state.product.bestsellers);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchBestsellers());
  }, [dispatch]);

  useEffect(() => {
    setFeaturedProducts(bestsellers.slice(0, 4));
  }, [bestsellers]);

  const categories = [
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      icon: Smartphone,
      gradient: 'from-blue-500 via-blue-600 to-purple-600',
      description: 'Latest gadgets and tech'
    },
    {
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=600&auto=format&fit=crop&q=80',
      icon: Shirt,
      gradient: 'from-pink-500 via-rose-600 to-red-600',
      description: 'Trendy clothing and accessories'
    },
    {
      name: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80',
      icon: Home,
      gradient: 'from-green-500 via-emerald-600 to-teal-600',
      description: 'Beautiful home essentials'
    },
    {
      name: 'Gaming',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
      icon: Gamepad2,
      gradient: 'from-purple-500 via-violet-600 to-indigo-600',
      description: 'Gaming gear and accessories'
    },
    {
      name: 'Beauty',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
      icon: Palette,
      gradient: 'from-amber-500 via-orange-600 to-red-600',
      description: 'Beauty and skincare products'
    },
    {
      name: 'Books',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80',
      icon: Book,
      gradient: 'from-cyan-500 via-blue-600 to-indigo-600',
      description: 'Books and educational content'
    }
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers', color: 'from-blue-500 to-blue-600' },
    { icon: ShoppingBag, value: '100K+', label: 'Products Sold', color: 'from-green-500 to-green-600' },
    { icon: Award, value: '4.9', label: 'Average Rating', color: 'from-amber-500 to-amber-600' },
    { icon: TrendingUp, value: '99%', label: 'Satisfaction Rate', color: 'from-purple-500 to-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 theme-transition">
      <div className="space-y-24 py-8">
        {/* Hero Section */}
        <HeroBanner />

        {/* Stats Section
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label, color }, index) => (
              <div 
                key={index}
                className="text-center p-8 rounded-3xl bg-white dark:bg-dark-800 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-dark-700 group"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">{value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </section> */}

        {/* Featured Products */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Star className="h-10 w-10 text-amber-500 fill-current animate-bounce-subtle" />
              <h2 className="text-5xl font-display font-bold gradient-text">
                Bestsellers This Week
              </h2>
              <Star className="h-10 w-10 text-amber-500 fill-current animate-bounce-subtle" />
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Discover our most popular products loved by thousands of customers worldwide. These handpicked favorites represent the perfect blend of quality, style, and value.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/bestseller"
              className="btn-primary gap-3 text-lg px-10 py-4"
            >
              View All Bestsellers
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-display font-bold text-gray-800 dark:text-gray-200 mb-6">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Explore our diverse range of premium products across different categories. Find exactly what you're looking for with our carefully curated collections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(({ name, image, icon: Icon, gradient, description }, index) => (
              <Link 
                key={index}
                to={`/products?category=${encodeURIComponent(name)}`} 
                className="group relative h-96 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
              >
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <div className="mb-6 p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 transform group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-center transform group-hover:translate-y-1 transition-transform duration-300">
                    {name}
                  </h3>
                  <p className="text-lg text-center text-white/90 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {description}
                  </p>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                    <span className="text-sm font-medium">Explore Collection</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }}></div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-dark-800 dark:via-dark-700 dark:to-dark-800 py-0 rounded-3xl mx-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-30"></div>
          <div className="relative z-10">
            <OurPolicy />
          </div>
        </section>

        {/* Newsletter Section */}
        {/* <section className="container mx-auto px-4">
          <div className="relative bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 rounded-3xl p-16 text-center text-white overflow-hidden">
            {/* Background Pattern */}
            {/* <div className="absolute inset-0 bg-pattern opacity-10"></div> */}
            
            {/* Floating Elements */}
            {/* <div className="absolute top-8 left-8 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-display font-bold mb-6">
                Stay in the Loop
              </h2>
              <p className="text-xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
                Subscribe to our newsletter and be the first to know about new arrivals, exclusive deals, and special offers. Join our community of savvy shoppers!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300 shadow-lg"
                />
                <button className="px-8 py-4 bg-white text-primary-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>  */}
      </div>
    </div>
  );
};