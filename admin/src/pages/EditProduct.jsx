import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';

const EditProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const initialData = location.state;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [images, setImages] = useState([false, false, false, false]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPrice(initialData.price);
      setCategory(initialData.category);
      setSubCategory(initialData.subCategory);
      setBestseller(initialData.bestseller);
      setSizes(initialData.sizes);
    }
  }, [initialData]);

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("_id", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller.toString());
      formData.append("sizes", JSON.stringify(sizes));

      images.forEach((img, idx) => {
        if (img) formData.append(`image${idx + 1}`, img);
      });

      const response = await axios.post(`${backendUrl}/api/product/update`, formData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success("Product updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form onSubmit={updateProduct} className="...">
      <p className="text-xl font-bold mb-4">Edit Product</p>
      {/* ...repeat Add form with pre-filled values and submit as Update */}
      {/* Upload image section */}
      <div>
        <p>Upload Image</p>
        <div className='flex gap-2'>
          {images.map((img, idx) => (
            <label key={idx} htmlFor={`image${idx}`}>
              <img className="w-20" src={!img ? initialData.image?.[idx] || assets.upload_area : URL.createObjectURL(img)} alt="img" />
              <input
                type="file"
                id={`image${idx}`}
                hidden
                onChange={(e) => {
                  const updated = [...images];
                  updated[idx] = e.target.files[0];
                  setImages(updated);
                }}
              />
            </label>
          ))}
        </div>
      </div>
      {/* ...input fields for name, desc, price, etc. (reuse from Add.jsx) */}
      <button type="submit" className="bg-black text-white px-4 py-2 mt-4">Update</button>
    </form>
  );
};

export default EditProduct;
