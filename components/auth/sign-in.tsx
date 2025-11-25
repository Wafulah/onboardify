"use state"

import { serverSignIn } from "@/actions/auth";
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';


export default function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const searchParams = useSearchParams();
  const authError = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setStatus('loading'); 

    try {
     
      const result = await serverSignIn('credentials', {
        email,
        password,
        redirect: false,
      });

      
      if (result?.error) {
        setError('Invalid email or password. Please check your credentials.');
      } else {
        
        const callbackUrl = searchParams.get('callbackUrl') || '/';
        window.location.href = callbackUrl;
        
      }
    } catch (err) {
      console.error("Credentials sign in error:", err);
      
      setError("Login failed due to a server error. Please try again.");
    } finally {
      setStatus('idle'); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-bg font-sans">
      <div className="p-10 sm:p-12 rounded-xl bg-white shadow-3xl max-w-md w-full text-slate-text">
        <div className="text-center mb-8">
          <div className="text-cyan-primary text-4xl mb-2">
            <span role="img" aria-label="key">🔑</span>
          </div>
          <h2 className="text-3xl font-extrabold m-0">Secure Dashboard Access</h2>
          <p className="text-gray-500 mt-1">Enter your credentials to continue your session.</p>
        </div>

        {(authError || error) && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-center font-medium">
            <p className="m-0">{error || 'An authentication error occurred. Please log in again.'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-primary focus:border-cyan-primary transition duration-150"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-primary focus:border-cyan-primary transition duration-150"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 text-blue-800 text-slate-text font-bold text-lg uppercase tracking-wider rounded-lg shadow-md hover:bg-teal-400 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-primary focus:ring-opacity-50 transition duration-200"
          >
            Log In
          </button>
        </form>

        
      </div>
    </div>
  );
}
