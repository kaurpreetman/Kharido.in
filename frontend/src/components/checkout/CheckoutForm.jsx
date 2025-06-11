// Updated CheckoutForm.jsx (Redux version)
import React, { useState } from "react";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
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
          <ul className="space-y-3">
            {addresses.map((addr, index) => (
              <li
                key={index}
                className={`p-4 border rounded-lg ${
                  selectedAddress === addr ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="selected-address"
                    checked={JSON.stringify(selectedAddress) === JSON.stringify(addr)
}
                    onChange={() => handleSelectAddress(index)}
                    className="mr-3"
                  />
                  <p>
                    <strong>{addr.street}</strong>, {addr.city}, {addr.state} - {addr.zipCode}, {addr.country}
                  </p>
                </label>
                <div className="mt-2 flex space-x-4">
                  <button onClick={() => handleEditAddress(index)} className="text-blue-600 text-sm">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteAddress(index)} className="text-red-600 text-sm">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={handleAddNewAddress}
        className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
      >
        Add New Address
      </button>

      {showForm && (
        <form onSubmit={handleSaveAddress} className="space-y-6 mt-4">
          <div>
            <label htmlFor="street">Street Address</label>
            <input
              name="street"
              value={address.street}
              onChange={handleChange}
              className="w-full h-11 border rounded px-2"
            />
            {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city">City</label>
              <input
                name="city"
                value={address.city}
                onChange={handleChange}
                className="w-full h-11 border rounded px-2"
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>
            <div>
              <label htmlFor="state">State</label>
              <input
                name="state"
                value={address.state}
                onChange={handleChange}
                className="w-full h-11 border rounded px-2"
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="zipCode">ZIP Code</label>
              <input
                name="zipCode"
                value={address.zipCode}
                onChange={handleChange}
                className="w-full h-11 border rounded px-2"
              />
              {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <input
                name="country"
                value={address.country}
                onChange={handleChange}
                className="w-full h-11 border rounded px-2"
              />
              {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Save Address
          </button>
        </form>
      )}
    </div>
  );
};
