import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext.jsx';
import { ProductCard } from '../components/ui/ProductCard.jsx';

export const ProductsPage = () => {
  const { products, search } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [sortOrder, setSortOrder] = useState('relevant');

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (product) =>
          product.category === selectedCategory &&
          (!selectedSubcategory || product.subcategory === selectedSubcategory)
      );
    }

    if (sortOrder === 'low-high') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    if (search.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedSubcategory, sortOrder, search]);

  const categoriesWithSubcategories = {
    All: [],
    Electronics: [
      '📱 Mobiles',
      '💻 Laptops',
      '🔌 Accessories',
      '📟 Tablets',
      '📷 Cameras',
      '🎧 Audio & Headphones',
      '⌚ Wearable Tech',
    ],
    Fashion: [
      '👔 Men',
      '👗 Women',
      '🧒 Kids',
      '👟 Footwear',
      '⌚ Watches',
      '💍 Jewelry',
      '👜 Handbags & Wallets',
      '🎎 Ethnic Wear',
    ],
    'Home & Living': [
      '🛋️ Furniture',
      '🖼️ Decor',
      '🍳 Kitchen',
      '🛏️ Bedding',
      '💡 Lighting',
      '🧻 Bathroom Essentials',
      '📦 Storage & Organization',
      '🌱 Gardening',
    ],
    Sports: [
      '🏋️ Gym Equipment',
      '🥾 Outdoor Gear',
      '👕 Sportswear',
      '🚴 Cycling',
      '👟 Footwear',
      '🎽 Accessories',
    ],
    Beauty: [
      '🧴 Skincare',
      '💇‍♀️ Haircare',
      '💄 Makeup',
      '🌸 Fragrances',
      '🧼 Personal Care',
      '🖌️ Tools & Brushes',
    ],
    Books: [
      '📖 Fiction',
      '📚 Non-Fiction',
      '🦸 Comics',
      '👶 Children’s Books',
      '🎓 Educational',
      '📱 E-Books',
    ],
  };

  return (
    <div className="container py-8">
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="w-64 space-y-6">
          {/* Categories Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3">📂 Categories</h3>
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

          {/* Price Range Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3">💰 Sort by Price</h3>
            <div className="space-y-2">
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="relevant">✨ Sort by: Relevant</option>
                <option value="low-high">⬇️ Price: Low to High</option>
                <option value="high-low">⬆️ Price: High to Low</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
