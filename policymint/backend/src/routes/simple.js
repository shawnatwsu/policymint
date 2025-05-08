const express = require('express');
const simpleController = require('../controllers/simpleController');

const router = express.Router();

// Register a new user
router.post('/register', simpleController.registerUser);

// Generate policy
router.post('/policy', simpleController.generatePolicy);

// Get user policies
router.get('/policies', simpleController.getUserPolicies);

// Get usage stats
router.get('/stats', simpleController.getUsageStats);

module.exports = router; 