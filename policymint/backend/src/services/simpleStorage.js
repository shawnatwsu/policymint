const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Path to our "database" files
const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const POLICIES_FILE = path.join(DATA_DIR, 'policies.json');
const USAGE_FILE = path.join(DATA_DIR, 'usage.json');

// Free users limit (can be configured via env)
const FREE_USERS_LIMIT = process.env.FREE_USERS_LIMIT || 100;

// Ensure our data directory and files exist
async function initStorage() {
  try {
    // Create data directory if it doesn't exist
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize files if they don't exist
    const files = [USERS_FILE, POLICIES_FILE, USAGE_FILE];
    
    for (const file of files) {
      try {
        await fs.access(file);
      } catch (err) {
        // File doesn't exist, create it with empty array/object
        if (file === USAGE_FILE) {
          await fs.writeFile(file, JSON.stringify({ totalUsers: 0, freeSlots: parseInt(FREE_USERS_LIMIT) }));
        } else {
          await fs.writeFile(file, JSON.stringify([]));
        }
      }
    }
    
    return true;
  } catch (err) {
    console.error('Failed to initialize storage:', err);
    return false;
  }
}

// Read data from a file
async function readData(file) {
  await initStorage();
  const data = await fs.readFile(file, 'utf8');
  return JSON.parse(data);
}

// Write data to a file
async function writeData(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// Check if email is already registered
async function isEmailRegistered(email) {
  const users = await readData(USERS_FILE);
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Register a new user
async function registerUser(email) {
  if (await isEmailRegistered(email)) {
    return { success: false, message: 'Email already registered' };
  }
  
  // Get current usage stats
  const usage = await readData(USAGE_FILE);
  
  // Check if we still have free slots
  const isFreeUser = usage.freeSlots > 0;
  
  // Create a new user
  const userId = crypto.randomUUID();
  const newUser = {
    id: userId,
    email,
    createdAt: new Date().toISOString(),
    isFreeUser,
    generationCount: 0,
    subscriptionActive: isFreeUser // Free users start with "subscription" active
  };
  
  // Update users file
  const users = await readData(USERS_FILE);
  users.push(newUser);
  await writeData(USERS_FILE, users);
  
  // Update usage stats
  usage.totalUsers++;
  if (isFreeUser) {
    usage.freeSlots--;
  }
  await writeData(USAGE_FILE, usage);
  
  return { 
    success: true, 
    user: newUser,
    isFreeUser,
    freeSlots: usage.freeSlots
  };
}

// Get user by email
async function getUserByEmail(email) {
  const users = await readData(USERS_FILE);
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

// Update user generation count
async function incrementUserGenerationCount(userId) {
  const users = await readData(USERS_FILE);
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }
  
  users[userIndex].generationCount++;
  await writeData(USERS_FILE, users);
  
  return { success: true, count: users[userIndex].generationCount };
}

// Save a generated policy
async function savePolicy(userId, policyData) {
  const policies = await readData(POLICIES_FILE);
  
  const policy = {
    id: crypto.randomUUID(),
    userId,
    ...policyData,
    createdAt: new Date().toISOString()
  };
  
  policies.push(policy);
  await writeData(POLICIES_FILE, policies);
  
  // Increment user's generation count
  await incrementUserGenerationCount(userId);
  
  return policy;
}

// Get policies for a user
async function getUserPolicies(userId) {
  const policies = await readData(POLICIES_FILE);
  return policies.filter(policy => policy.userId === userId);
}

// Update subscription status
async function updateSubscription(userId, isActive) {
  const users = await readData(USERS_FILE);
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }
  
  users[userIndex].subscriptionActive = isActive;
  await writeData(USERS_FILE, users);
  
  return { success: true };
}

// Get usage stats
async function getUsageStats() {
  return readData(USAGE_FILE);
}

module.exports = {
  initStorage,
  registerUser,
  getUserByEmail,
  incrementUserGenerationCount,
  savePolicy,
  getUserPolicies,
  updateSubscription,
  getUsageStats
}; 