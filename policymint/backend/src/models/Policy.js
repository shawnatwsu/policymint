const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  companyUrl: {
    type: String,
    required: true,
    trim: true
  },
  dataCollected: {
    type: [String],
    required: true
  },
  customClauses: {
    type: String,
    default: '',
    trim: true
  },
  privacyPolicy: {
    type: String,
    default: null
  },
  termsOfService: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy; 