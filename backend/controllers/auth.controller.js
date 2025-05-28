import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateAccessToken = (userID) => {
  return jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

const setAccessTokenCookie = (res, accessToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already in use.' });

    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();

    const accessToken = generateAccessToken(savedUser._id);
    setAccessTokenCookie(res, accessToken);

    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).json({ message: 'User registered successfully.', user: userWithoutPassword, token: accessToken });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const accessToken = generateAccessToken(user._id);
    setAccessTokenCookie(res, accessToken);

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
  success: true, 
  message: 'Logged in successfully.',
  user: userWithoutPassword,
  token: accessToken
});

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user); // req.user is set by auth middleware
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

export const googleSignup = async (req, res) => {
  try {
    const { token } = req.body;

    // Get user info from Google
    const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { email, name, sub: googleId } = googleRes.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId });
    }

    const authToken = generateAccessToken(user._id);
    setAccessTokenCookie(res, authToken);

    res.status(200).json({ message: 'Google login successful.', user, token: authToken });
  } catch (err) {
    console.error('Google Sign-In error:', err);
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};