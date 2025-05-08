const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a privacy policy using OpenAI
 * 
 * @param {Object} policyData - Company and policy data
 * @param {string} policyData.companyName - Company name
 * @param {string} policyData.companyUrl - Company website URL
 * @param {Array<string>} policyData.dataCollected - Types of data collected
 * @param {string} policyData.customClauses - Custom clauses to include
 * @returns {Promise<string>} - Generated privacy policy in markdown format
 */
async function generatePrivacyPolicy(policyData) {
  const { companyName, companyUrl, dataCollected, customClauses } = policyData;
  
  const prompt = `
  Generate a professional and legally compliant privacy policy for a company with the following details:
  
  Company Name: ${companyName}
  Website: ${companyUrl}
  Data Collected: ${dataCollected.join(', ')}
  ${customClauses ? `Custom Clauses: ${customClauses}` : ''}
  
  The privacy policy should:
  - Be formatted in markdown
  - Include all standard sections (introduction, data collection, use of data, cookies, data sharing, data security, user rights, etc.)
  - Be compliant with GDPR and CCPA regulations
  - Use clear, straightforward language
  - Include appropriate disclaimers
  - Have a last updated date of today
  
  Make it comprehensive yet concise, and use a professional tone.
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using 3.5 as it's more accessible than GPT-4
      messages: [
        { role: 'system', content: 'You are a legal expert specialized in drafting privacy policies for websites and applications.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI Privacy Policy Generation Error:', error);
    throw new Error('Failed to generate privacy policy: ' + (error.message || 'Unknown error'));
  }
}

/**
 * Generate terms of service using OpenAI
 * 
 * @param {Object} policyData - Company and policy data
 * @param {string} policyData.companyName - Company name
 * @param {string} policyData.companyUrl - Company website URL
 * @param {string} policyData.customClauses - Custom clauses to include
 * @returns {Promise<string>} - Generated terms of service in markdown format
 */
async function generateTermsOfService(policyData) {
  const { companyName, companyUrl, customClauses } = policyData;
  
  const prompt = `
  Generate a professional and legally compliant terms of service for a company with the following details:
  
  Company Name: ${companyName}
  Website: ${companyUrl}
  ${customClauses ? `Custom Clauses: ${customClauses}` : ''}
  
  The terms of service should:
  - Be formatted in markdown
  - Include all standard sections (acceptance of terms, user accounts, intellectual property, limitation of liability, governing law, etc.)
  - Use clear, straightforward language
  - Include appropriate disclaimers and limitations of liability
  - Have a last updated date of today
  
  Make it comprehensive yet concise, and use a professional tone.
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using 3.5 as it's more accessible than GPT-4
      messages: [
        { role: 'system', content: 'You are a legal expert specialized in drafting terms of service for websites and applications.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI Terms of Service Generation Error:', error);
    throw new Error('Failed to generate terms of service: ' + (error.message || 'Unknown error'));
  }
}

module.exports = {
  generatePrivacyPolicy,
  generateTermsOfService
}; 