import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
    const user = await User.findById(decoded.userID).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token validation error:', error.message);
    return res.status(401).json({ message: 'Unauthorized - Invalid or expired token' });
  }
};
// export const isAdmin = (req, res, next) => {
//   if (req.user?.role !== 'admin') {
//     return res.status(403).json({ message: "Access denied: Admins only" });
//   }
//   next();
// };

