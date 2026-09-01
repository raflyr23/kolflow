"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconSparkles, IconArrowLeft } from '../../components/Icons';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to register');
      }

      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 relative">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <IconArrowLeft className="w-4 h-4" />
        Back to homepage
      </Link>
      
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
            <IconSparkles className="w-6 h-6 text-white dark:text-slate-900" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center mb-2">Create an account</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8">Join KOLFlow to manage your campaigns</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Budi Santoso"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 text-slate-900 dark:text-white"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              required
              placeholder="budi@example.com"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 text-slate-900 dark:text-white"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 text-slate-900 dark:text-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-slate-900 dark:text-white hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}


