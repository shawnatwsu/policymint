const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware.protect, authController.getMe);
router.post('/checkout', authMiddleware.protect, authController.createCheckoutSession);
router.post('/portal', authMiddleware.protect, authController.createPortalSession);

module.exports = router; 