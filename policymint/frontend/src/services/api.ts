import axios from 'axios';

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Set auth token for requests if available
const setAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Policy Types
export type PolicyFormData = {
  companyName: string;
  companyUrl: string;
  dataCollected: string[];
  customClauses?: string;
};

export type Policy = {
  id: string;
  companyName: string;
  companyUrl: string;
  dataCollected: string[];
  customClauses: string;
  privacyPolicy: string;
  termsOfService: string;
  createdAt: string;
};

// Generate Policy
export const generatePolicy = async (policyData: PolicyFormData): Promise<Policy> => {
  setAuthToken();
  
  try {
    const response = await axios.post('/policies', policyData);
    return response.data.policy;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to generate policy');
  }
};

// Get all policies
export const getPolicies = async (): Promise<Policy[]> => {
  setAuthToken();
  
  try {
    const response = await axios.get('/policies');
    return response.data.policies;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch policies');
  }
};

// Get a single policy
export const getPolicy = async (id: string): Promise<Policy> => {
  setAuthToken();
  
  try {
    const response = await axios.get(`/policies/${id}`);
    return response.data.policy;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch policy');
  }
};

// Delete a policy
export const deletePolicy = async (id: string): Promise<void> => {
  setAuthToken();
  
  try {
    await axios.delete(`/policies/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete policy');
  }
};

// Create Checkout Session
export const createCheckoutSession = async (): Promise<string> => {
  setAuthToken();
  
  try {
    const response = await axios.post('/auth/checkout');
    return response.data.sessionUrl;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create checkout session');
  }
};

// Create Portal Session
export const createPortalSession = async (): Promise<string> => {
  setAuthToken();
  
  try {
    const response = await axios.post('/auth/portal');
    return response.data.url;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create portal session');
  }
}; 