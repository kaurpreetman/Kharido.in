import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

axios.defaults.withCredentials = true;

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const [bestsellers, setBestsellers] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [total, setTotal] = useState(0);
    const [authLoading, setAuthLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastOrder, setLastOrder] = useState(null);
  const delivery_fee = 10.0;
  const currency = "$";

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("addresses");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedAddress, setSelectedAddress] = useState(() => {
    const saved = localStorage.getItem("selectedAddress");
    return saved ? JSON.parse(saved) : null;
  });

  // 🔄 Auto-fetch current user on initial load
   useEffect(() => {
    let newSubtotal = 0;
    let newTotalCount = 0;
    Object.entries(cartItems).forEach(([productId, sizeMap]) => {
      const product = products.find((p) => p._id === productId);
      if (!product) return;
      Object.entries(sizeMap).forEach(([size, qty]) => {
        newSubtotal += product.price * qty;
        newTotalCount += qty;
      });
    });
    setSubtotal(newSubtotal);
    setTotalCount(newTotalCount);
    setTotal(newSubtotal + delivery_fee);
  }, [cartItems]);
  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      setUser(null); // optional: log out
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(); 

  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/all");
      setProducts(res.data.products);
      await fetchCart();
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("Failed to load products");
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart");
      const items = {};
      res.data.forEach(({ product, size, quantity }) => {
        if (!items[product]) items[product] = {};
        items[product][size] = quantity;
      });

      setCartItems(items);
  
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  };

  const fetchBestsellers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/bestseller");
      if (res.data.success) {
        setBestsellers(res.data.data);
      } else {
        toast.error("Failed to load bestsellers");
      }
    } catch (err) {
      console.error("Error fetching bestsellers:", err);
      toast.error("Error loading bestsellers");
    }
  };

 

  // ✅ Set user on login (do NOT store in localStorage)
  const login =(userData) => {
    setUser(userData);
      
 
  };

  // ✅ Logout by clearing server cookie + client state
  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      setUser(null);
      setCartItems({});
      toast.info("Logged out!");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const addToCart = async (productId, size) => {
    try {
      await axios.post("http://localhost:5000/api/cart/add", { productId, size });
      fetchCart();
      toast.success("Item added to cart");
    } catch (err) {
      console.error("Error adding to cart", err);
      toast.error("Failed to add item");
    }
  };

  const updateQuantity = async (productId, size, newQty) => {
    try {
      await axios.put("http://localhost:5000/api/cart/update", {
        productId,
        size,
        quantity: newQty,
      });
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity", err);
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (productId, size) => {
    try {
      await axios.delete("http://localhost:5000/api/cart/remove", {
        data: { productId, size },
      });
      fetchCart();
      toast.success("Item removed");
    } catch (err) {
      console.error("Error removing item", err);
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:5000/api/cart/clear");
      setCartItems({});
      toast.info("Cart cleared");
    } catch (err) {
      console.error("Error clearing cart", err);
      toast.error("Failed to clear cart");
    }
  };

  const getSingleProduct = async (productId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/products/getsingle", {
        productId,
      });
      return res.data.product;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  const getUserOrders = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/user/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || error.message || "Failed to fetch orders"
      );
    }
  };

  const addAddress = (newAddress) => {
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  const updateAddress = (index, updatedAddress) => {
    const updated = [...addresses];
    updated[index] = updatedAddress;
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  const deleteAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  const selectAddress = (addr) => {
    setSelectedAddress(addr);
    localStorage.setItem("selectedAddress", JSON.stringify(addr));
  };

  return (
    <ShopContext.Provider
      value={{
        fetchProducts,
        products,
        cartItems,
        fetchCart,
        getSingleProduct,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        user,
        login,
        logout,
        addresses,
        setAddresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        selectAddress,
        subtotal,
        totalCount,
        total,
        authLoading,
        delivery_fee,
        currency,
        search,
        setSearch,
        lastOrder,
        setLastOrder,
        getUserOrders,
        bestsellers,
        fetchBestsellers,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;