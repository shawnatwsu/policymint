const express = require('express');
const router = express.Router();
const policiesController = require('../controllers/policies');
const authMiddleware = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware.protect);

// Routes
router.post('/', policiesController.generatePolicy);
router.get('/', policiesController.getPolicies);
router.get('/:id', policiesController.getPolicy);
router.delete('/:id', policiesController.deletePolicy);

module.exports = router; 