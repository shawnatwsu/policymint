const jwt = require('jsonwebtoken');
const User = require('../models/User');
const stripeService = require('../services/stripe');

/**
 * Generate JWT token for user
 * 
 * @param {string} userId - User ID
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * Register a new user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response object
 */
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create a new user
    const user = await User.create({
      email,
      password
    });

    // Create Stripe customer
    const stripeCustomerId = await stripeService.createCustomer(user);
    user.stripeCustomerId = stripeCustomerId;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus
      }
    });
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
 * Login user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response object
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message
    });
  }
};

/**
 * Get current user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response object
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus
      }
    });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error.message
    });
  }
};

/**
 * Create stripe checkout session
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response object
 */
exports.createCheckoutSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // If user doesn't have a Stripe customer ID, create one
    if (!user.stripeCustomerId) {
      const stripeCustomerId = await stripeService.createCustomer(user);
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }
    
    // Create checkout session
    const session = await stripeService.createCheckoutSession({
      customerId: user.stripeCustomerId,
      priceId: process.env.STRIPE_PRICE_ID,
      successUrl: `${process.env.FRONTEND_URL}/subscription/success`,
      cancelUrl: `${process.env.FRONTEND_URL}/subscription/cancel`
    });
    
    res.status(200).json({
      success: true,
      sessionUrl: session.url
    });
  } catch (error) {
    console.error('Create Checkout Session Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: error.message
    });
  }
};

/**
 * Create stripe portal session
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response object
 */
exports.createPortalSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        message: 'User does not have a Stripe customer ID'
      });
    }
    
    // Create portal session
    const session = await stripeService.createPortalSession({
      customerId: user.stripeCustomerId,
      returnUrl: `${process.env.FRONTEND_URL}/dashboard`
    });
    
    res.status(200).json({
      success: true,
      url: session.url
    });
  } catch (error) {
    console.error('Create Portal Session Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create portal session',
      error: error.message
    });
  }
}; 