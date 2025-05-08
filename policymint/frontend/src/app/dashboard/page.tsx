'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { getPolicies, createPortalSession } from '../../services/api';
import type { Policy } from '../../services/api';

export default function Dashboard() {
  const router = useRouter();
  const { user, isSubscribed, loading, logout } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Fetch policies if user is authenticated
    if (user) {
      fetchPolicies();
    }
  }, [user, loading, router]);

  const fetchPolicies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getPolicies();
      setPolicies(data);
    } catch (err: any) {
      setError('Failed to fetch policies. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const url = await createPortalSession();
      window.location.href = url;
    } catch (err: any) {
      setError('Failed to create billing portal session. Please try again.');
      console.error(err);
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
    <div>
      <header className="mb-10 flex justify-between items-center">
        <div>
          <Link href="/" className="text-3xl font-bold text-emerald-600">PolicyMint</Link>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-gray-600">
            {user?.email}
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              isSubscribed() ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isSubscribed() ? 'Active Subscription' : 'No Subscription'}
            </span>
          </p>
          <button 
            onClick={handleManageSubscription}
            className="text-sm text-gray-600 hover:text-emerald-600"
          >
            Manage Subscription
          </button>
          <button 
            onClick={logout}
            className="text-sm text-gray-600 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Policies</h1>
        <Link 
          href="/create-policy" 
          className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
        >
          Create New Policy
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-500 bg-red-50 border border-red-100 rounded-lg">
          {error}
        </div>
      )}

      {!isSubscribed() && (
        <div className="p-4 mb-6 bg-amber-50 border border-amber-100 rounded-lg">
          <h2 className="text-lg font-medium text-amber-800 mb-2">Subscription Required</h2>
          <p className="text-amber-700 mb-3">
            You need an active subscription to generate new policies. Subscribe to unlock all features.
          </p>
          <Link 
            href="/subscribe" 
            className="px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition inline-block"
          >
            Subscribe Now
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : policies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => (
            <div 
              key={policy.id}
              className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">{policy.companyName}</h3>
              <p className="text-gray-500 mb-1">{policy.companyUrl}</p>
              <p className="text-gray-500 mb-4 text-sm">
                Created on {new Date(policy.createdAt).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {policy.dataCollected.map((data, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {data}
                  </span>
                ))}
              </div>
              <Link 
                href={`/policies/${policy.id}`}
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                View Policy &rarr;
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-xl font-semibold mb-2">No policies yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first policy document by clicking the button below.
          </p>
          <Link 
            href="/create-policy" 
            className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
          >
            Create New Policy
          </Link>
        </div>
      )}
    </div>
  );
} 