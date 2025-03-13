import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';

export const RecommendProduct = ({ category, subcategory, currentProductId }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            // Filter products by category and subcategory, excluding the current product
            const filteredProducts = products.filter(
                (item) =>
                    item.category === category &&
                    item.subcategory === subcategory &&
                    item._id !== currentProductId
            );

            // Shuffle the filtered products
            const shuffledProducts = filteredProducts.sort(() => Math.random() - 0.5);

            // Select the first 8 random products
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
