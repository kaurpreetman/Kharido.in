import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Upload, Save, X, Plus } from 'lucide-react';
import axios from 'axios';

const Add = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Topwear');
  const [bestseller, setBestseller] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [loading, setLoading] = useState(false);
   const [sizeInput, setSizeInput] = useState('');
 const [sizes, setSizes] = useState([]);
  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };
  const handleAddSize = () => {
    const trimmed = sizeInput.trim();
    if (trimmed && !sizes.includes(trimmed)) {
      setSizes([...sizes, trimmed]);
      setSizeInput('');
    }
  };
  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const addCustomSize = () => {
    const trimmed = customSizeInput.trim();
    if (trimmed && !selectedSizes.includes(trimmed)) {
      setSelectedSizes(prev => [...prev, trimmed]);
      setCustomSizeInput('');
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name || !price) {
      return toast.error("Name and price are required");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      selectedSizes.forEach(size => formData.append('sizes[]', size));

      images.forEach((img, index) => {
        if (img) {
          formData.append(`image${index + 1}`, img);
        }
      });

      const res = await axios.post(
        'http://localhost:5000/api/products/create',
        formData,
        { withCredentials: true }
      );

      toast.success('Product added successfully!');
      setName('');
      setDescription('');
      setImages([null, null, null, null]);
      setPrice('');
      setCategory('Men');
      setSubCategory('Topwear');
      setBestseller(false);
      setSelectedSizes([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6">Add New Product</h1>
        <form onSubmit={onSubmitHandler} className="space-y-6">
          {/* Images */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 block">Product Images</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors">
                  {img ? (
                    <div className="relative h-full">
                      <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-400">Upload</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(idx, e.target.files[0])} className="hidden" />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Name, Description */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Product Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" required className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-3" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter product description" rows={4} required className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-3 resize-none" />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-3">
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2">Sub Category</label>
              <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-3">
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2">Price</label>
              <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-3" />
            </div>
          </div>

          {/* Sizes */}
          {/* Sizes */}
        <div>
          <label className="block text-sm font-medium mb-2">Available Sizes</label>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder="Enter size (e.g., M, 42 EU)"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSize();
                }
              }}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
            <button
              type="button"
              onClick={handleAddSize}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <div key={index} className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full">
                <span>{size}</span>
                <button
                  type="button"
                  onClick={() => setSizes((prev) => prev.filter((_, i) => i !== index))}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

          {/* Bestseller */}
          <div className="flex items-center space-x-3">
            <input type="checkbox" id="bestseller" checked={bestseller} onChange={(e) => setBestseller(e.target.checked)} className="w-5 h-5 bg-gray-700 border-gray-600 rounded" />
            <label htmlFor="bestseller" className="text-gray-300 font-medium">Mark as Bestseller</label>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-6">
            <button type="submit" disabled={loading} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Add Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;