import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, Save, X, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const subCategoriesMap = {
  Electronics: ['Mobiles', 'Laptops', 'Accessories'],
  Fashion: ['Men', 'Women', 'Footwear'],
  'Home & Living': ['Furniture', 'Kitchen', 'Lighting'],
  Sports: ['Gym Equipment', 'Sportswear', 'Footwear'],
  Beauty: ['Skincare', 'Makeup', 'Fragrances'],
  Books: ['Fiction', 'Non-Fiction', 'Children’s Books'],
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(Object.keys(subCategoriesMap)[0]);
  const [subCategory, setSubCategory] = useState(subCategoriesMap[Object.keys(subCategoriesMap)[0]][0]);
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
const [sizeInput, setSizeInput] = useState('');
const handleAddSize = () => {
  if (sizeInput.trim() !== '') {
    if (sizes.includes(sizeInput.trim())) {
      toast.warn("Size already added.");
    } else {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput('');
    }
  }
};

  const fetchProduct = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/products/getsingle',{ productId: id },  
    { withCredentials: true } 
  );

        const data=res.data.product;
        console.log(data);
      setName(data.name);
      setDescription(data.description);
      setPrice(data.price.toString());
      setCategory(data.category);
      setSubCategory(data.subCategory);
      setBestseller(data.bestseller);
      setSizes(data.sizes);
      setImages([
        data.image[0] || null,
        data.image[1] || null,
        data.image[2] || null,
        data.image[3] || null
      ]);
    } catch (error) {
      toast.error('Failed to fetch product');
      navigate('/list');
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      sizes.forEach(size => formData.append('sizes[]', size));

      images.forEach((img, index) => {
        if (img instanceof File) {
          formData.append(`image${index + 1}`, img);
        } else if (typeof img === 'string') {
          formData.append(`existingImage${index + 1}`, img);
        }
      });

      await axios.put(
        `https://kharido-in-mpzi.onrender.com/api/products/product/${id}`,
        formData,
        { withCredentials: true }
      );

      toast.success('Product updated successfully!');
      navigate('/list');
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/list')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Edit Product</h1>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Product Images</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 hover:border-gray-500">
                    {image ? (
                      <div className="relative h-full">
                        <img
                          src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-400">Upload Image</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(index, e.target.files[0])} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(subCategoriesMap[e.target.value][0]); }} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                {Object.keys(subCategoriesMap).map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sub Category</label>
              <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                {subCategoriesMap[category].map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
              <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required />
            </div>
          </div>

          <div>
  <label className="block text-sm font-medium mb-2 text-white">Available Sizes</label>
  <div className="flex gap-3 mb-3">
    <input
      type="text"
      placeholder="Enter size (e.g., M, 42 EU)"
      value={sizeInput}
      onChange={(e) => setSizeInput(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSize(); } }}
      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
    />
    <button type="button" onClick={handleAddSize} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
  </div>

  <div className="flex flex-wrap gap-2">
    {sizes.map((size, index) => (
      <div key={index} className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full">
        <span>{size}</span>
        <button type="button" onClick={() => setSizes(sizes.filter((_, i) => i !== index))} className="ml-2 text-white hover:text-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
</div>

          <div className="flex items-center space-x-3">
            <input type="checkbox" id="bestseller" checked={bestseller} onChange={(e) => setBestseller(e.target.checked)} className="w-5 h-5 bg-gray-700 border-gray-600 rounded" />
            <label htmlFor="bestseller" className="text-gray-300">Mark as Bestseller</label>
          </div>

          <div className="flex justify-end pt-6">
            <button type="submit" disabled={loading} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Update Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
