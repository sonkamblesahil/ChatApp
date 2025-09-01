import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

  const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Handle browser back button
    useEffect(() => {
      const handlePopState = (event) => {
        event.preventDefault();
        const shouldLeave = window.confirm(
          "Are you sure you want to leave? You'll be redirected to the homepage."
        );
        if (shouldLeave) {
          navigate("/");
        } else {
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

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const res = await fetch("http://localhost:3001/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        localStorage.setItem("username", username);
        navigate("/chatPage");
      } else {
        alert("Invalid credentials");
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">username</label>
              <input 
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password:</label>
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Sign In
            </button>
            <div className="text-center mt-4">
              <span className="text-gray-600">Don't have an account? </span>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
   


export default Signin
