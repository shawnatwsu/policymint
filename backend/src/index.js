require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const simpleRoutes = require('./routes/simple');
const simpleStorage = require('./services/simpleStorage');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Apply middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// Register routes
app.use('/api', simpleRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Initialize storage
simpleStorage.initStorage()
  .then((success) => {
    if (success) {
      console.log('Storage initialized successfully');
      
      // Start server after successful initialization
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } else {
      console.error('Failed to initialize storage');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Storage initialization error:', error);
    process.exit(1);
  });

// Handle unhandled errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
}); 