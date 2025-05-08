'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { createCheckoutSession } from '../../services/api';

export default function Subscribe() {
  const router = useRouter();
  const { user, isSubscribed, loading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Redirect if already subscribed
    if (!loading && user && isSubscribed()) {
      router.push('/dashboard');
    }
  }, [user, loading, isSubscribed, router]);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const sessionUrl = await createCheckoutSession();
      // Redirect to Stripe checkout
      window.location.href = sessionUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session. Please try again.');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-10 text-center">
        <Link href="/" className="text-3xl font-bold text-emerald-600">PolicyMint</Link>
      </header>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Subscribe to PolicyMint</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Unlock full access to our AI-powered policy generation tools and create unlimited legal documents.
        </p>
      </div>

      {error && (
        <div className="p-4 mb-8 text-red-500 bg-red-50 border border-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-emerald-100 mb-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Professional Plan</h2>
          <div className="mb-4">
            <span className="text-4xl font-bold">$20</span>
            <span className="text-gray-600">/month</span>
          </div>
        </div>

        <div className="my-8 space-y-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span>Unlimited policy generations</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span>Privacy Policies & Terms of Service</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span>HTML & Markdown formats</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span>GDPR & CCPA Compliant</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span>Custom clauses</span>
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="block w-full py-3 bg-emerald-600 text-white font-medium text-center rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isProcessing ? 'Processing...' : 'Subscribe Now - $20/month'}
        </button>
      </div>

      <div className="text-center mb-10">
        <p className="text-gray-600">
          Secure payment processing with Stripe
        </p>
        <div className="mt-4">
          <svg className="h-6 mx-auto" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 10.4c0-4-3.7-8-9.4-8H0V18h50.6c5.7 0 9.4-3.5 9.4-7.6z" fill="#32325d"/>
            <path d="M19.8 11.5c0-1.2-.9-2.1-2.1-2.1a2.1 2.1 0 00-2.1 2.1c0 1.2.9 2.1 2.1 2.1 1.2 0 2.1-.9 2.1-2.1zm3.4 0c0-1.2-.9-2.1-2.1-2.1a2.1 2.1 0 00-2.1 2.1c0 1.2.9 2.1 2.1 2.1 1.2 0 2.1-.9 2.1-2.1zm3.4 0c0-1.2-.9-2.1-2.1-2.1a2.1 2.1 0 00-2.1 2.1c0 1.2.9 2.1 2.1 2.1 1.2 0 2.1-.9 2.1-2.1z" fill="#fff"/>
          </svg>
        </div>
      </div>

      <div className="text-center">
        <Link 
          href="/dashboard" 
          className="text-emerald-600 hover:text-emerald-700"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
} 