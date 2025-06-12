import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Edit, Trash2, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/all',{withCredentials:true});
      console.log(res);
      setProducts(res.data.products);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/remove/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      toast.success('Product removed successfully');
    } catch (error) {
      toast.error('Failed to remove product');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products List</h1>
        <span className="text-gray-400">{products.length} products found</span>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-700/50 px-6 py-4">
          <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-300">
            <span>Image</span>
            <span className="col-span-2">Product Details</span>
            <span>Category</span>
            <span>Price</span>
            <span className="text-center">Actions</span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-700">
          {products.map((product) => (
            <div key={product._id} className="px-6 py-4 hover:bg-gray-700/30 transition-colors">
              <div className="grid grid-cols-6 gap-4 items-center">
                {/* Image */}
                <div className="relative">
                  <img
                    src={product.image?.[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  {product.bestseller && (
                    <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="col-span-2">
                  <h3 className="text-white font-medium mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
                </div>

                {/* Category */}
                <div>
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
                    {product.category}
                  </span>
                  <div className="text-gray-400 text-xs mt-1">{product.subCategory}</div>
                </div>

                {/* Price */}
                <div className="text-white font-semibold">₹{product.price.toFixed(2)}</div>

                {/* Actions */}
                <div className="flex items-center justify-center space-x-2">
                  
                  <Link
                    to={`/edit/${product._id}`}
                    className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => removeProduct(product._id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No products found</div>
          <Link
            to="/add"
            className="inline-block mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
};

export default List;