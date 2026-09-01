"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/AppProvider';
import { IconSparkles, IconEye, IconEyeOff, IconCheck, IconAlertCircle } from '../../components/Icons';

export default function LoginPage() {
  const router = useRouter();
  const { isAuth, login } = useApp();
  
  const [email, setEmail] = useState('admin@kolflow.demo');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuth) {
      router.push('/dashboard');
    }
  }, [isAuth, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    if (email === 'admin@kolflow.demo' && password === 'password') {
      login();
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));
    login();
    router.push('/dashboard');
  };

  if (isAuth) return null; // Prevent flicker while redirecting

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Side - Hidden on Mobile */}
      <div className="hidden lg:flex flex-col flex-1 bg-slate-900 text-white p-12 relative overflow-hidden">
        {/* Decorative background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <IconSparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">KOLFlow</span>
          </div>

          <div className="mt-auto mb-20 max-w-lg">
            <h1 className="text-4xl font-bold leading-tight mb-6">
              The modern operating system for influencer marketing.
            </h1>
            <div className="space-y-4">
              {[
                "Drag-and-drop campaign boards",
                "Real-time performance analytics",
                "Smart KOL matching engine"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-slate-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <IconSparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">KOLFlow</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Sign in to your workspace to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 pl-4 pr-11 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                <IconAlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center shadow-sm"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-50 text-slate-500 font-medium">Or skip the form</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full h-11 bg-white text-slate-900 border-2 border-slate-200 rounded-xl font-semibold hover:border-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
          >
            <IconSparkles className="w-4 h-4" />
            Try Demo Instantly
          </button>

          <div className="mt-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm text-indigo-800 text-center">
            <p className="font-medium mb-1">Demo Credentials</p>
            <p className="opacity-80">Email: admin@kolflow.demo</p>
            <p className="opacity-80">Password: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}