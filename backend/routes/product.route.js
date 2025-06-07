import express from 'express';
import {
  createProduct,
  addReview,
  getAllProducts,
  featuredProducts,
  deleteProduct,
  recommended,
  getProductCategory,
  singleProduct,
  allorders,
  updatestatus
} from '../controllers/products.controller.js';

import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.js';
import { multerErrorHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// ✅ SECURE ROUTE: CREATE PRODUCT WITH MULTIPLE IMAGES
router.post(
  '/create',
  protectRoute,
  adminRoute,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  multerErrorHandler,  // 🛡️ Handles multer-specific errors
  createProduct
);

// 📦 PRODUCT MANAGEMENT ROUTES
router.post('/getsingle', singleProduct);
router.post('/list', adminRoute, allorders);
router.post('/status', adminRoute, updatestatus);
router.get('/featured', protectRoute, featuredProducts);
router.get('/recomm', recommended);
router.get('/category/:category', getProductCategory);
router.get('/all', getAllProducts);

// 🗑️ DELETE ROUTE
router.delete('/:id', protectRoute, adminRoute, deleteProduct);

// ⭐ REVIEW ROUTE
router.post('/:id/reviews', protectRoute, addReview);

export default router;
