'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { generatePolicy } from '../../services/api';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Policy form schema
const policySchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  companyUrl: z.string().url('Please enter a valid URL'),
  dataCollected: z.array(z.string()).min(1, 'Select at least one type of data'),
  customClauses: z.string().optional()
});

type PolicyFormData = z.infer<typeof policySchema>;

// Data collection options
const dataCollectionOptions = [
  { id: 'personal', label: 'Personal Information' },
  { id: 'contact', label: 'Contact Information' },
  { id: 'device', label: 'Device Information' },
  { id: 'location', label: 'Location Data' },
  { id: 'cookies', label: 'Cookies & Tracking' },
  { id: 'usage', label: 'Usage Data' },
  { id: 'marketing', label: 'Marketing Preferences' },
  { id: 'payment', label: 'Payment Information' },
  { id: 'social', label: 'Social Media Data' }
];

export default function CreatePolicy() {
  const router = useRouter();
  const { user, isSubscribed, loading } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      companyName: '',
      companyUrl: '',
      dataCollected: [],
      customClauses: ''
    }
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Redirect if not subscribed
    if (!loading && user && !isSubscribed()) {
      router.push('/subscribe');
    }
  }, [user, loading, isSubscribed, router]);

  const onSubmit = async (data: PolicyFormData) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const policy = await generatePolicy(data);
      router.push(`/policies/${policy.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate policy. Please try again.');
      setIsGenerating(false);
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
    <div className="max-w-4xl mx-auto">
      <header className="mb-10 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-emerald-600">PolicyMint</Link>
        <Link 
          href="/dashboard" 
          className="text-emerald-600 hover:text-emerald-700"
        >
          &larr; Back to Dashboard
        </Link>
      </header>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Policy</h1>
        <p className="text-gray-600">
          Enter your company details to generate a customized privacy policy and terms of service.
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-500 bg-red-50 border border-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <div className="mb-6">
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            {...register('companyName')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Your Company, Inc."
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-500">{errors.companyName.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="companyUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Company Website URL
          </label>
          <input
            id="companyUrl"
            type="url"
            {...register('companyUrl')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="https://example.com"
          />
          {errors.companyUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.companyUrl.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Collected (select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Controller
              name="dataCollected"
              control={control}
              render={({ field }) => (
                <>
                  {dataCollectionOptions.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={option.id}
                        type="checkbox"
                        value={option.label}
                        checked={field.value.includes(option.label)}
                        onChange={(e) => {
                          const value = option.label;
                          const newValues = e.target.checked
                            ? [...field.value, value]
                            : field.value.filter((val) => val !== value);
                          field.onChange(newValues);
                        }}
                        className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor={option.id} className="ml-2 text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </>
              )}
            />
          </div>
          {errors.dataCollected && (
            <p className="mt-1 text-sm text-red-500">{errors.dataCollected.message}</p>
          )}
        </div>

        <div className="mb-8">
          <label htmlFor="customClauses" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Clauses (optional)
          </label>
          <textarea
            id="customClauses"
            {...register('customClauses')}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Add any specific clauses or requirements you'd like to include in your policy."
          ></textarea>
          {errors.customClauses && (
            <p className="mt-1 text-sm text-red-500">{errors.customClauses.message}</p>
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Policy...
              </span>
            ) : (
              'Generate Policy'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 