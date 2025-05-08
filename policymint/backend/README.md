# PolicyMint - Privacy Policy Generator

PolicyMint is a web application that generates professional Privacy Policy and Terms of Service documents using AI. This simplified version uses file-based storage and offers a free tier (first 100 users) followed by a subscription model.

## Features

- Generate Privacy Policy and Terms of Service documents
- No database required - uses file-based storage
- First 100 users are free, then $29.99/month subscription
- Download policies in Markdown or HTML format
- Clean, professional UI

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   FREE_USERS_LIMIT=100
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5000`

## Project Structure

- `src/index.js` - Main server file
- `src/services/simpleAi.js` - Service for generating policies using OpenAI
- `src/services/simpleStorage.js` - File-based storage service
- `src/controllers/simpleController.js` - Controllers for handling API requests
- `src/routes/simple.js` - API routes
- `public/index.html` - Frontend application

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/policy` - Generate a new policy
- `GET /api/policies` - Get all policies for a user
- `GET /api/stats` - Get usage statistics

## Business Model

- First 100 users: Free
- After free tier: $29.99/month subscription

## License

MIT 