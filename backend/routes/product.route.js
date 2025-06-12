import express from 'express';
import {
  createProduct,
  addReview,
  getAllProducts,
  getBestsellerProducts,
  deleteProduct,
  
  getProductCategory,
  singleProduct,
} from '../controllers/products.controller.js';

import { protectRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.js';
import { multerErrorHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// ✅ SECURE ROUTE: CREATE PRODUCT WITH MULTIPLE IMAGES
router.post(
  '/create',
  protectRoute,

  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  multerErrorHandler,  
  createProduct
);

// 📦 PRODUCT MANAGEMENT ROUTES
router.post('/getsingle', singleProduct);


router.get('/bestseller',  getBestsellerProducts );
router.get('/category/:category', getProductCategory);
router.get('/all',protectRoute, getAllProducts);
// 🗑️ DELETE ROUTE
router.delete('/remove/:id', protectRoute,deleteProduct);

// ⭐ REVIEW ROUTE
router.post('/:id/reviews', protectRoute, addReview);

export default router;
