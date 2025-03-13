// controllers/cart.controller.js
import Product from '../models/Product.model.js';

export const addToCart = async (req, res) => {
  try {
    const user = req.user;
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ message: "Product ID and size are required" });
    }

    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: productId, size, quantity: 1 });
    }

    await user.save();
    res.json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    console.error("Error in addToCart:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const cartItems = await Promise.all(
      req.user.cartItems.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          product: product._id.toString(),
          name: product.name,
          price: product.price,
          size: item.size,
          quantity: item.quantity,
        };
      })
    );

    res.json(cartItems);
  } catch (error) {
    console.error("Error in getCartProducts:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const user = req.user;
    const { productId, size, quantity } = req.body;

    const item = user.cartItems.find(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity === 0) {
      user.cartItems = user.cartItems.filter(
        (item) => !(item.product.toString() === productId && item.size === size)
      );
    } else {
      item.quantity = quantity;
    }

    await user.save();
    res.json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    console.error("Error in updateQuantity:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const removeone = async (req, res) => {
    try {
      const user = req.user;
      const { productId, size } = req.body;
        console.log(req.body);
      if (!productId || !size) {
        return res.status(400).json({ message: "Product ID and size are required" });
      }
  
      // Filter out the item that matches productId AND size
      const filteredCart = user.cartItems.filter(
        (item) => !(item.product.toString() === productId && item.size === size)
      );
  
      user.cartItems = filteredCart;
    //   console.log("updated"+filteredCart);
      await user.save();
  
      res.json({ success: true, cartItems: user.cartItems });
    } catch (error) {
      console.error("Error in removeOne:", error.message);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  export const clearCart = async (req, res) => {
    try {
      const user = req.user;
  
      user.cartItems = []; // 🔥 Empty the cart
      await user.save();   // 💾 Save updated user
  
      res.json({ success: true, cartItems: [] });
    } catch (error) {
      console.error("Error in clearCart:", error.message);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  