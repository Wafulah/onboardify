'use client';

import { signIn } from "@/auth"; 
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const authError = searchParams.get('error'); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password. Please check your credentials.');
    } else {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      // Use router.push or window.location for client-side redirect after successful sign-in
      window.location.href = callbackUrl; 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-bg font-sans">
      <div className="p-10 sm:p-12 rounded-xl bg-white shadow-3xl max-w-md w-full text-slate-text">
        
        {/* Header with Visual Flair */}
        <div className="text-center mb-8">
          <div className="text-cyan-primary text-4xl mb-2">
            <span role="img" aria-label="key">🔑</span> 
          </div>
          <h2 className="text-3xl font-extrabold m-0">
            Secure Dashboard Access
          </h2>
          <p className="text-gray-500 mt-1">
            Enter your credentials to continue your session.
          </p>
        </div>
        
        {/* Error Handling */}
        {(authError || error) && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-center font-medium">
            <p className="m-0">
              {error || "An authentication error occurred. Please log in again."}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6">
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Email Address
            </label>
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
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1">
              Password
            </label>
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
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-3 bg-cyan-600 text-slate-text font-bold text-lg uppercase tracking-wider rounded-lg shadow-md hover:bg-teal-400 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-primary focus:ring-opacity-50 transition duration-200"
          >
            Log In
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          New user? 
          <Link href="/signup" className="text-teal-accent font-semibold ml-1 hover:underline transition duration-150">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}