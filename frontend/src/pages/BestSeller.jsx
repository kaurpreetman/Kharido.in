import React, { useEffect } from 'react';
import BestSeller from '../components/BestSeller';
import NewsletterBox from '../components/NewsletterBox';
import OurPolicy from '../components/OurPolicy';
import { ProductCard } from '../components/ui/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBestsellers } from '../context/productSlice';

export function BestSellers() {
  const dispatch = useDispatch();
  const bestsellers = useSelector((state) => state.product.bestsellers);

  useEffect(() => {
    dispatch(fetchBestsellers());
  }, [dispatch]);

  return (
    <div className="space-y-8 py-4">
      <BestSeller />

      <section className="container mx-auto px-4">
        {bestsellers.length === 0 ? (
          <p>Loading bestsellers...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <OurPolicy />
    </div>
  );
}

export default BestSellers;
