const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripeService = require('../services/stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook endpoint for Stripe
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  try {
    // Handle the event
    await stripeService.handleWebhookEvent(event);
    
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook Processing Error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router; 