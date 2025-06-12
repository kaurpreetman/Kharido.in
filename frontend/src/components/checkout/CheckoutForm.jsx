import React, { useState } from "react";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Edit, Trash2, Plus } from "lucide-react";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  selectAddress,
} from "../../context/addressSlice";

const addressSchema = z.object({
  street: z.string().min(1, "Street Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().regex(/^\d{5}$/, "ZIP Code must be a 5-digit number"),
  country: z.string().min(1, "Country is required"),
});

export const CheckoutForm = ({ loading }) => {
  const dispatch = useDispatch();
  const { addresses, selectedAddress } = useSelector((state) => state.address);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    const validation = addressSchema.safeParse(address);
    if (!validation.success) {
      const newErrors = {};
      validation.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
    } else {
      setErrors({});
      if (editingIndex !== null) {
        dispatch(updateAddress({ index: editingIndex, updatedAddress: validation.data }));
        setEditingIndex(null);
      } else {
        dispatch(addAddress(validation.data));
      }
      setAddress({ street: "", city: "", state: "", zipCode: "", country: "" });
      setShowForm(false);
    }
  };

  const handleEditAddress = (index) => {
    setEditingIndex(index);
    setAddress(addresses[index]);
    setShowForm(true);
  };

  const handleAddNewAddress = () => {
    setEditingIndex(null);
    setAddress({ street: "", city: "", state: "", zipCode: "", country: "" });
    setShowForm(true);
  };

  const handleSelectAddress = (index) => {
    dispatch(selectAddress(addresses[index]));
  };

  const handleDeleteAddress = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (confirmDelete) {
      if (addresses[index] === selectedAddress) {
        dispatch(selectAddress(null));
      }
      dispatch(deleteAddress(index));
    }
  };

  return (
    <div className="space-y-6">
      {addresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Saved Addresses</h3>
          <div className="space-y-3">
            {addresses.map((addr, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  selectedAddress === addr 
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg" 
                    : "border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 hover:border-primary-300 dark:hover:border-primary-600"
                }`}
                onClick={() => handleSelectAddress(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="selected-address"
                      checked={JSON.stringify(selectedAddress) === JSON.stringify(addr)}
                      onChange={() => handleSelectAddress(index)}
                      className="mt-1 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Delivery Address</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>{addr.street}</strong><br />
                        {addr.city}, {addr.state} - {addr.zipCode}<br />
                        {addr.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(index);
                      }} 
                      className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded-xl transition-colors duration-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(index);
                      }} 
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleAddNewAddress}
        className="w-full btn-secondary gap-3 py-4"
      >
        <Plus className="w-5 h-5" />
        Add New Address
      </button>

      {showForm && (
        <div className="card p-6 border-2 border-primary-200 dark:border-primary-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {editingIndex !== null ? 'Edit Address' : 'Add New Address'}
          </h3>
          <form onSubmit={handleSaveAddress} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Street Address
              </label>
              <input
                name="street"
                value={address.street}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your street address"
              />
              {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter city"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State
                </label>
                <input
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter state"
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ZIP Code
                </label>
                <input
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter ZIP code"
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <input
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter country"
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 btn-primary"
              >
                {editingIndex !== null ? 'Update Address' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingIndex(null);
                  setAddress({ street: "", city: "", state: "", zipCode: "", country: "" });
                  setErrors({});
                }}
                className="flex-1 btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};