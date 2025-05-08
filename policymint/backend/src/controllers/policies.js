const Policy = require('../models/Policy');
const User = require('../models/User');
const aiService = require('../services/ai');

/**
 * Generate a new policy
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response object
 */
exports.generatePolicy = async (req, res) => {
  try {
    const { companyName, companyUrl, dataCollected, customClauses } = req.body;
    
    // Validate input
    if (!companyName || !companyUrl || !dataCollected || !Array.isArray(dataCollected)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide companyName, companyUrl, and dataCollected array'
      });
    }
    
    // Check if user has an active subscription
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.hasActiveSubscription()) {
      return res.status(403).json({
        success: false,
        message: 'Active subscription required to generate policies'
      });
    }
    
    // Generate privacy policy and terms of service
    const [privacyPolicy, termsOfService] = await Promise.all([
      aiService.generatePrivacyPolicy({ companyName, companyUrl, dataCollected, customClauses }),
      aiService.generateTermsOfService({ companyName, companyUrl, customClauses })
    ]);
    
    // Create a new policy in the database
    const policy = await Policy.create({
      user: req.user.id,
      companyName,
      companyUrl,
      dataCollected,
      customClauses: customClauses || '',
      privacyPolicy,
      termsOfService
    });
    
    res.status(201).json({
      success: true,
      policy: {
        id: policy._id,
        companyName: policy.companyName,
        companyUrl: policy.companyUrl,
        dataCollected: policy.dataCollected,
        customClauses: policy.customClauses,
        privacyPolicy: policy.privacyPolicy,
        termsOfService: policy.termsOfService,
        createdAt: policy.createdAt
      }
    });
  } catch (error) {
    console.error('Policy Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate policy',
      error: error.message
    });
  }
};

/**
 * Get all policies for the current user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response object
 */
exports.getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('companyName companyUrl dataCollected createdAt');
    
    res.status(200).json({
      success: true,
      count: policies.length,
      policies
    });
  } catch (error) {
    console.error('Get Policies Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch policies',
      error: error.message
    });
  }
};

/**
 * Get a single policy by ID
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response object
 */
exports.getPolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }
    
    // Check if the policy belongs to the current user
    if (policy.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this policy'
      });
    }
    
    res.status(200).json({
      success: true,
      policy
    });
  } catch (error) {
    console.error('Get Policy Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch policy',
      error: error.message
    });
  }
};

/**
 * Delete a policy
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response object
 */
exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }
    
    // Check if the policy belongs to the current user
    if (policy.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this policy'
      });
    }
    
    await policy.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Policy deleted successfully'
    });
  } catch (error) {
    console.error('Delete Policy Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete policy',
      error: error.message
    });
  }
}; 