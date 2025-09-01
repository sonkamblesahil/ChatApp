import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      navigate("/chatPage");
    }
  }, [navigate]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      const shouldLeave = window.confirm(
        "Are you sure you want to leave the homepage?"
      );
      if (!shouldLeave) {
        // Push the current state back to prevent navigation
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    // Push initial state
    window.history.pushState(null, "", window.location.pathname);
    
    // Add event listener
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ChatApp</h1>
          </div>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/signin')}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with Friends
            <span className="block text-blue-600">Instantly</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A simple, fast, and secure messaging platform. Chat with friends, share moments, and stay connected wherever you are.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/signup')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/signin')}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-lg transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Messaging</h3>
            <p className="text-gray-600">Send and receive messages instantly with our fast messaging system.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your conversations are encrypted and private. We respect your privacy.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Friends</h3>
            <p className="text-gray-600">Easily search and connect with friends using our user search feature.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to start chatting?</h3>
          <p className="text-gray-600 mb-6">Join thousands of users who are already connected on ChatApp.</p>
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors"
          >
            Create Your Account
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold">ChatApp</span>
          </div>
          <p className="text-gray-400">© 2025 SahilSonkamble. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
