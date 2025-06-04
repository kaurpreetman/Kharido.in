import express from 'express';
import { createProduct,addReview, getAllProducts,featuredProducts ,deleteProduct,recommended,getProductCategory,singleProduct,allorders,updatestatus} from '../controllers/products.controller.js';
import { adminRoute ,protectRoute} from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.js';
const router = express.Router();


router.post('/create', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
]), createProduct);


router.post('/getsingle', singleProduct);
//router.get('/all', getAllProducts);
router.post('/list', adminRoute,allorders); // 👈 Add this
router.post('/status',adminRoute,updatestatus)

router.get('/featured',protectRoute, featuredProducts);
router.get('/recomm',recommended);
router.get('/category/:category',getProductCategory);
router.delete("/:id",protectRoute,adminRoute,deleteProduct);
router.post('/:id/reviews',protectRoute, addReview);

export default router;
