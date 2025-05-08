const Stripe = require('stripe');
const User = require('../models/User');

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe customer
 * 
 * @param {Object} userData - User data
 * @param {string} userData.email - User's email
 * @returns {Promise<string>} - Stripe customer ID
 */
async function createCustomer(userData) {
  try {
    const customer = await stripe.customers.create({
      email: userData.email,
      metadata: {
        userId: userData._id.toString()
      }
    });
    
    return customer.id;
  } catch (error) {
    console.error('Stripe Customer Creation Error:', error);
    throw new Error('Failed to create customer: ' + (error.message || 'Unknown error'));
  }
}

/**
 * Create a checkout session for subscription
 * 
 * @param {Object} sessionData - Session data
 * @param {string} sessionData.customerId - Stripe customer ID
 * @param {string} sessionData.priceId - Stripe price ID
 * @param {string} sessionData.successUrl - URL to redirect on success
 * @param {string} sessionData.cancelUrl - URL to redirect on cancel
 * @returns {Promise<Object>} - Checkout session
 */
async function createCheckoutSession(sessionData) {
  const { customerId, priceId, successUrl, cancelUrl } = sessionData;
  
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        customerId: customerId
      }
    });
    
    return session;
  } catch (error) {
    console.error('Stripe Checkout Session Error:', error);
    throw new Error('Failed to create checkout session: ' + (error.message || 'Unknown error'));
  }
}

/**
 * Create a billing portal session
 * 
 * @param {Object} sessionData - Session data
 * @param {string} sessionData.customerId - Stripe customer ID
 * @param {string} sessionData.returnUrl - URL to return to after portal session
 * @returns {Promise<Object>} - Portal session
 */
async function createPortalSession(sessionData) {
  const { customerId, returnUrl } = sessionData;
  
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    
    return session;
  } catch (error) {
    console.error('Stripe Portal Session Error:', error);
    throw new Error('Failed to create portal session: ' + (error.message || 'Unknown error'));
  }
}

/**
 * Handle webhook events
 * 
 * @param {Object} event - Stripe event object
 * @returns {Promise<void>}
 */
async function handleWebhookEvent(event) {
  const { type, data } = event;
  
  switch (type) {
    case 'checkout.session.completed': {
      const session = data.object;
      
      if (session.mode === 'subscription') {
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        
        // Update user subscription status
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.subscriptionId = subscriptionId;
          user.subscriptionStatus = 'active';
          await user.save();
        }
      }
      break;
    }
    
    case 'customer.subscription.updated': {
      const subscription = data.object;
      const customerId = subscription.customer;
      
      // Update user subscription status
      const user = await User.findOne({ stripeCustomerId: customerId });
      if (user) {
        user.subscriptionStatus = subscription.status;
        user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
        await user.save();
      }
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = data.object;
      const customerId = subscription.customer;
      
      // Update user subscription status
      const user = await User.findOne({ stripeCustomerId: customerId });
      if (user) {
        user.subscriptionStatus = 'canceled';
        await user.save();
      }
      break;
    }
  }
}

module.exports = {
  createCustomer,
  createCheckoutSession,
  createPortalSession,
  handleWebhookEvent
}; 