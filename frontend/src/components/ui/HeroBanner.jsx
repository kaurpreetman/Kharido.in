import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, ShoppingBag, Zap, Heart, Crown } from 'lucide-react';

const bannerImages = [
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80',
  'https://plus.unsplash.com/premium_photo-1661726457110-c43a88d74567?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=1200&auto=format&fit=crop&q=80',
];

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[620px] overflow-hidden  mx-4  shadow-2xl">
      {/* Background Images with Enhanced Parallax */}
      <div className="absolute inset-0 z-0">
        {bannerImages.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              currentIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={src}
              alt={`Banner ${index}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-transparent to-secondary-900/30" />
          </div>
        ))}
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 right-20 animate-float">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20">
          <Star className="w-10 h-10 text-white animate-bounce-subtle" />
        </div>
      </div>
      
      <div className="absolute bottom-32 right-32 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-accent-500 to-amber-500 flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20">
          <Sparkles className="w-8 h-8 text-white animate-bounce-subtle" />
        </div>
      </div>

      <div className="absolute top-1/2 right-10 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20">
          <Heart className="w-7 h-7 text-white animate-bounce-subtle" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center container mx-auto px-6">
        <div className="max-w-4xl text-white animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-md border border-white/20 shadow-xl">
              <span className="text-sm font-medium flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Premium Collection
              </span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-primary-200 to-secondary-200 bg-clip-text text-transparent text-shadow">
              Discover
            </span>
            <br />
            <span className="text-white text-shadow flex items-center gap-4">
              Premium 
              <Zap className="w-16 h-16 text-amber-400 animate-bounce-subtle" />
            </span>
            <span className="gradient-text text-shadow">Products</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 text-gray-200 leading-relaxed max-w-3xl text-shadow">
            Experience luxury shopping with our curated collection of premium products at unbeatable prices. Quality meets style in every purchase, crafted for those who demand excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              to="/products"
              className="group inline-flex items-center gap-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-7 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl"
            >
              <ShoppingBag className="h-6 w-6 group-hover:animate-bounce-subtle" />
              Shop Now
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
            
            <Link
              to="/bestseller"
              className="group inline-flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 text-white px-7 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <Star className="h-6 w-6 group-hover:animate-bounce-subtle" />
              View Bestsellers
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>

          
        </div>
      </div>

      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index 
                ? 'w-12 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 pointer-events-none"></div>
    </section>
  );
};

export default HeroBanner;