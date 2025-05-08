const simpleStorage = require('../services/simpleStorage');
const simpleAi = require('../services/simpleAi');

/**
 * Register a new user
 */
exports.registerUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const result = await simpleStorage.registerUser(email);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
};

/**
 * Generate policy for a user
 */
exports.generatePolicy = async (req, res) => {
  try {
    const { email, companyName, companyUrl, dataCollected, customClauses } = req.body;
    
    // Validate input
    if (!email || !companyName || !companyUrl || !dataCollected || !Array.isArray(dataCollected)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, companyName, companyUrl, and dataCollected array'
      });
    }
    
    // Get user by email
    const user = await simpleStorage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }
    
    // Check if user has an active subscription
    if (!user.subscriptionActive) {
      return res.status(403).json({
        success: false,
        message: 'Your subscription is not active. Please subscribe to generate policies.'
      });
    }
    
    // Generate privacy policy and terms of service
    const [privacyPolicy, termsOfService] = await Promise.all([
      simpleAi.generatePrivacyPolicy({ companyName, companyUrl, dataCollected, customClauses }),
      simpleAi.generateTermsOfService({ companyName, companyUrl, customClauses })
    ]);
    
    // Save policy
    const policy = await simpleStorage.savePolicy(user.id, {
      companyName,
      companyUrl,
      dataCollected,
      customClauses: customClauses || '',
      privacyPolicy,
      termsOfService
    });
    
    res.status(201).json({
      success: true,
      policy
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
 * Get all policies for a user
 */
exports.getUserPolicies = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Get user by email
    const user = await simpleStorage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get policies for user
    const policies = await simpleStorage.getUserPolicies(user.id);
    
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
 * Get usage statistics
 */
exports.getUsageStats = async (req, res) => {
  try {
    const stats = await simpleStorage.getUsageStats();
    
    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get Usage Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch usage statistics',
      error: error.message
    });
  }
}; 