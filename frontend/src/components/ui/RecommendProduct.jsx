import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ProductCard } from './ProductCard';
import { fetchProducts } from '../../context/productSlice'; // Uncomment if you need to fetch products

export const RecommendProduct = ({ category, subcategory, currentProductId }) => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product.products); // Adjust based on your slice structure
    const [related, setRelated] = useState([]);

    useEffect(() => {
      
        if (!products || products.length === 0) {
            dispatch(fetchProducts());
        }

        if (products && products.length > 0) {
            const filteredProducts = products.filter(
                (item) =>
                    item.category === category &&
                    item.subcategory === subcategory &&
                    item._id !== currentProductId
            );

            const shuffledProducts = filteredProducts.sort(() => Math.random() - 0.5);

            setRelated(shuffledProducts.slice(0, 8));
        }
    }, [products, category, subcategory, currentProductId]);

    return (
        <div className="my-8">
            <h2 className="text-xl font-semibold mb-6">Recommended Products</h2>
            {related.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {related.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No related products found.</p>
            )}
        </div>
    );
};
