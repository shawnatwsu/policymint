import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <header className="w-full py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-3xl font-bold text-emerald-600">PolicyMint</div>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="px-5 py-2 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition"
          >
            Log In
          </Link>
          <Link 
            href="/register" 
            className="px-5 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto py-16 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Generate Professional Legal Policies <span className="text-emerald-600">in Seconds</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl">
          PolicyMint uses advanced AI to create customized Privacy Policies and Terms of Service 
          for your business, ensuring compliance with global regulations.
        </p>
        <Link 
          href="/register" 
          className="px-8 py-3 bg-emerald-600 text-white font-medium text-lg rounded-xl hover:bg-emerald-700 transition shadow-lg hover:shadow-xl"
        >
          Get Started Today
        </Link>
      </section>

      <section className="w-full py-16 bg-white rounded-2xl shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How PolicyMint Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Enter Your Details</h3>
              <p className="text-gray-600">Provide your company information, website URL, and the types of data you collect.</p>
            </div>
            
            <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">AI Generation</h3>
              <p className="text-gray-600">Our advanced AI creates customized, legally-compliant policies tailored to your business needs.</p>
            </div>
            
            <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Download & Use</h3>
              <p className="text-gray-600">Preview, download, or copy your policies in Markdown or HTML format for immediate use.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Simple Pricing</h2>
          <p className="text-xl text-gray-600 text-center mb-12">No hidden fees, just straightforward value</p>
          
          <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-emerald-100">
            <h3 className="text-2xl font-bold text-center mb-2">Professional Plan</h3>
            <div className="text-center mb-4">
              <span className="text-4xl font-bold">$20</span>
              <span className="text-gray-600">/month</span>
            </div>
            <div className="my-6 space-y-4">
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
            <Link 
              href="/register" 
              className="block w-full py-3 bg-emerald-600 text-white font-medium text-center rounded-lg hover:bg-emerald-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 