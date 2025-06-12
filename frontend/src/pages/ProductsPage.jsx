import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ProductCard } from '../components/ui/ProductCard';
import { fetchProducts } from '../context/productSlice';

import { useLocation } from 'react-router-dom';

export const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const search = useSelector((state) => state.ui.search);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [sortOrder, setSortOrder] = useState('relevant');

  const categoriesWithSubcategories = {
    All: [],
    Electronics: ['Mobiles', 'Laptops', 'Accessories'],
    Fashion: ['Men', 'Women', 'Footwear'],
    'Home & Living': ['Furniture', 'Kitchen', 'Lighting'],
    Sports: ['Gym Equipment', 'Sportswear', 'Footwear'],
    Beauty: ['Skincare', 'Makeup', 'Fragrances'],
    Books: ['Fiction', 'Non-Fiction', 'Children’s Books'],
  };

  // 👉 Get category from query string on first render
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  useEffect(() => {
    const categoryFromURL = query.get('category');
    if (categoryFromURL && categoriesWithSubcategories[categoryFromURL]) {
      setSelectedCategory(categoryFromURL);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (product) =>
          product.category === selectedCategory &&
          (!selectedSubcategory || product.subcategory === selectedSubcategory)
      );
    }

    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(lower) ||
        product.description?.toLowerCase().includes(lower) ||
        product.subcategory?.toLowerCase().includes(lower)
      );
    }

    if (sortOrder === 'low-high') {
      filtered = [...filtered].sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
    } else if (sortOrder === 'high-low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedSubcategory, sortOrder, search]);


  return (
    <div className="container py-8">
      <div className="flex gap-8">
        <aside className="w-64 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {Object.keys(categoriesWithSubcategories).map((category) => (
                <div key={category}>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={() => {
                        setSelectedCategory(category);
                        setSelectedSubcategory(null);
                      }}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 font-medium">{category}</span>
                  </label>
                  {selectedCategory === category &&
                    categoriesWithSubcategories[category].length > 0 && (
                      <div className="ml-6 mt-2 space-y-1">
                        {categoriesWithSubcategories[category].map((subcategory) => (
                          <label key={subcategory} className="flex items-center">
                            <input
                              type="radio"
                              name="subcategory"
                              value={subcategory}
                              checked={selectedSubcategory === subcategory}
                              onChange={() => setSelectedSubcategory(subcategory)}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2">{subcategory}</span>
                          </label>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Sort by Price</h3>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : filteredProducts.length ? (
              filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
