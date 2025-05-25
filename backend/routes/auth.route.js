import express from 'express';
import { signup, login, logout, getProfile, googleSignup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protectRoute, getProfile);
router.post("/google-signup", googleSignup);

export default router;
