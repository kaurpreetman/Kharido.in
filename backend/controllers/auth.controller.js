import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// Generate only Access Token
const generateAccessToken = (userID) => {
  return jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
};

// Optionally set token in cookies (you can also just send it in response)
const setAccessTokenCookie = (res, accessToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1 hour
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use.' });
    }

    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();

    const accessToken = generateAccessToken(savedUser._id);
    setAccessTokenCookie(res, accessToken);

    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    res.status(201).json({
      message: 'User registered successfully.',
      user: userWithoutPassword,
      accessToken, // Include if frontend stores it in localStorage
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const accessToken = generateAccessToken(user._id);
    setAccessTokenCookie(res, accessToken);

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: 'Logged in successfully.',
      user: userWithoutPassword,
      accessToken, // Send token for frontend use
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const accessToken = generateAccessToken('admin');
      setAccessTokenCookie(res, accessToken);

      return res.status(200).json({
        message: 'Admin logged in successfully.',
        accessToken,
      });
    }

    return res.status(401).json({ message: 'Invalid email or password.' });
  } catch (error) {
    console.error('Error during admin login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user); // You must have auth middleware that sets req.user
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
