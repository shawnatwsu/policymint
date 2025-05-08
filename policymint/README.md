# PolicyMint

PolicyMint is an AI-driven web application that generates professional Privacy Policies and Terms of Service documents based on user input.

## Features

- User authentication with JWT
- AI-powered policy generation using OpenAI
- Stripe subscription integration ($20/month)
- Download policies in Markdown and HTML formats
- Copy policies to clipboard
- Modern UI with Tailwind CSS

## Tech Stack

### Backend
- Node.js with Express
- MongoDB for database
- OpenAI API for policy generation
- Stripe for payment processing
- JWT for authentication

### Frontend
- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form with Zod validation
- Axios for API requests

## Prerequisites

- Node.js 16+ 
- MongoDB database
- OpenAI API key
- Stripe account with API keys

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/policymint.git
cd policymint
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

Edit the `.env` file with your configuration:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Database
MONGODB_URI=mongodb://localhost:27017/policymint

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
STRIPE_PRICE_ID=your_stripe_subscription_price_id_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

Start the backend server:

```bash
# Start in development mode with hot reloading
npm run dev

# Or start in production mode
npm start
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
touch .env.local
```

Edit the `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Obtain your API keys from the Stripe Dashboard
3. Create a subscription product and price
4. Update your backend `.env` file with the Stripe keys and price ID
5. To test webhooks locally, use the Stripe CLI to forward events to your local server

```bash
stripe listen --forward-to http://localhost:5000/api/webhooks/stripe
```

## Deployment

### Backend Deployment (Heroku or Render)

1. Create a new app on Heroku or Render
2. Connect your GitHub repository
3. Set the environment variables in the dashboard
4. Deploy the backend directory

### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the build command to `cd frontend && npm run build`
4. Set the environment variables in the Vercel dashboard
5. Deploy the frontend directory

## License

MIT 