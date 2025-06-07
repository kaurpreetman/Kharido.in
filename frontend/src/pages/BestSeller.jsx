import BestSeller from '../components/BestSeller';
import NewsletterBox from '../components/NewsletterBox';
import OurPolicy from '../components/OurPolicy';
import { ProductCard } from '../components/ui/ProductCard';
import { ShopContext } from '../context/ShopContext';
import React, { useContext, useEffect, useState } from 'react';

export function BestSellers() {
  const { fetchBestsellers, bestsellers } = useContext(ShopContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchBestsellers();
  }, []);

  useEffect(() => {
    setFeaturedProducts(bestsellers.slice(0, 4));
  }, [bestsellers]);

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner or Hero */}
      <BestSeller />

      {/* Featured Products Section */}
      <section className="container mx-auto px-4">
        {/* <h2 className="text-3xl font-bold mb-6 text-center">🔥 Featured Bestsellers</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Policy Information */}
      <OurPolicy />

    
    </div>
  );
}

export default BestSellers;
