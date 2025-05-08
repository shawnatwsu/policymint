'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { getPolicy } from '../../../services/api';
import type { Policy } from '../../../services/api';
import ReactMarkdown from 'react-markdown';

export default function PolicyDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Fetch policy if user is authenticated
    if (user && params.id) {
      fetchPolicy(params.id);
    }
  }, [user, loading, params.id, router]);

  const fetchPolicy = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getPolicy(id);
      setPolicy(data);
    } catch (err: any) {
      setError('Failed to fetch policy. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (content: string, type: 'privacy' | 'terms') => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopySuccess(`${type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} copied to clipboard!`);
        setTimeout(() => setCopySuccess(null), 3000);
      })
      .catch(() => {
        setError('Failed to copy to clipboard. Please try again.');
      });
  };

  const handleDownload = (content: string, type: 'privacy' | 'terms', format: 'md' | 'html') => {
    const filename = `${policy?.companyName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${type === 'privacy' ? 'privacy-policy' : 'terms-of-service'}.${format}`;
    
    let downloadContent = content;
    if (format === 'html') {
      // Convert markdown to HTML
      const parser = new DOMParser();
      const tempEl = document.createElement('div');
      
      // Use ReactMarkdown to convert markdown to HTML
      // This is a bit hacky, but works for downloads
      const markdownDiv = document.createElement('div');
      document.body.appendChild(markdownDiv);
      
      // Manually convert simple markdown to HTML
      // For a real app, you'd use a proper markdown->HTML converter
      downloadContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${policy?.companyName} - ${type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.2em; }
    p { margin-bottom: 1em; }
    ul, ol { margin-bottom: 1em; padding-left: 2em; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  ${content.replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gm, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gm, '<em>$1</em>')
    .replace(/\n\n/gm, '</p><p>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/<\/li>\n<li>/gm, '</li><li>')
    .replace(/<li>(.*?)(<\/p>)/gm, '<li>$1</li>')
    .replace(/<p><li>/gm, '<ul><li>')
    .replace(/<\/li><\/p>/gm, '</li></ul>')
    .replace(/\n/gm, '<br>')}
</body>
</html>`;
    }
    
    const blob = new Blob([downloadContent], { type: format === 'md' ? 'text/markdown' : 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !policy) {
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
        
        <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-700 mb-6">{error || 'Failed to load policy. Please try again.'}</p>
          <Link 
            href="/dashboard" 
            className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-emerald-600">PolicyMint</Link>
        <Link 
          href="/dashboard" 
          className="text-emerald-600 hover:text-emerald-700"
        >
          &larr; Back to Dashboard
        </Link>
      </header>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{policy.companyName}</h1>
        <p className="text-gray-600 mb-1">{policy.companyUrl}</p>
        <p className="text-gray-500 text-sm">
          Created on {new Date(policy.createdAt).toLocaleDateString()}
        </p>
      </div>

      {copySuccess && (
        <div className="p-4 mb-6 text-green-700 bg-green-50 border border-green-100 rounded-lg">
          {copySuccess}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-3">
          <div className="sticky top-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Download</h3>
              <div className="space-y-3">
                <div>
                  <button 
                    onClick={() => handleDownload(
                      activeTab === 'privacy' ? policy.privacyPolicy : policy.termsOfService,
                      activeTab,
                      'md'
                    )}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-800 text-sm rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                    Download as Markdown
                  </button>
                </div>
                <div>
                  <button 
                    onClick={() => handleDownload(
                      activeTab === 'privacy' ? policy.privacyPolicy : policy.termsOfService,
                      activeTab,
                      'html'
                    )}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-800 text-sm rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                    Download as HTML
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Copy to Clipboard</h3>
              <button 
                onClick={() => handleCopyToClipboard(
                  activeTab === 'privacy' ? policy.privacyPolicy : policy.termsOfService,
                  activeTab
                )}
                className="w-full px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                </svg>
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-9">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'privacy' 
                    ? 'bg-white text-emerald-600 border-b-2 border-emerald-600' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('privacy')}
              >
                Privacy Policy
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'terms' 
                    ? 'bg-white text-emerald-600 border-b-2 border-emerald-600' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('terms')}
              >
                Terms of Service
              </button>
            </div>
            
            <div className="p-8 prose prose-emerald max-w-none">
              <ReactMarkdown>
                {activeTab === 'privacy' ? policy.privacyPolicy : policy.termsOfService}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 