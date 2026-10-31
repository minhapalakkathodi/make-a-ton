import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, BarChart2, Settings, ArrowRight, Shield, Briefcase } from 'lucide-react';
import { BrightLoopLogo } from '../../components/common/BrightLoopLogo';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginAs, demoUsers } = useAuth();

  const [email, setEmail] = useState('admin@brightloop.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      login(email, password, selectedRole);
      setIsLoading(false);
      if (selectedRole === 'admin') navigate('/admin/dashboard');
      else if (selectedRole === 'staff') navigate('/staff/dashboard');
      else navigate('/portal/dashboard');
    }, 300);
  };

  const handleRoleAutofill = (roleKey) => {
    setSelectedRole(roleKey);
    const demo = demoUsers[roleKey];
    if (demo) {
      setEmail(demo.email);
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Centered Modal / Split Container matching screenshot */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        
        {/* Left Side: Soft blue brand illustration panel */}
        <div className="md:col-span-5 bg-[#eef4ff] p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Logo & Subtitle */}
          <div>
            <BrightLoopLogo />
            <p className="text-xs text-slate-500 font-medium mt-1">
              Your Subscription Management Partner
            </p>
          </div>

          {/* Center Illustration with Floating Badges */}
          <div className="relative my-8 flex items-center justify-center">
            {/* Floating Mini Badges */}
            <div className="absolute top-0 left-4 bg-white p-2.5 rounded-2xl shadow-md border border-blue-50 text-blue-600 animate-pulse">
              <User className="w-5 h-5" />
            </div>

            <div className="absolute top-4 right-6 bg-white p-2.5 rounded-2xl shadow-md border border-blue-50 text-blue-600">
              <BarChart2 className="w-5 h-5" />
            </div>

            <div className="absolute bottom-2 right-4 bg-white p-2 rounded-xl shadow-md border border-blue-50 text-blue-600">
              <Settings className="w-4 h-4" />
            </div>

            {/* Person with Laptop Illustration */}
            <div className="w-44 h-44 bg-blue-600/10 rounded-full flex items-center justify-center relative">
              <svg viewBox="0 0 160 160" className="w-36 h-36">
                {/* Stylized Avatar Illustration */}
                <circle cx="80" cy="50" r="22" fill="#2563eb" />
                <path d="M50 120 C50 85, 110 85, 110 120 Z" fill="#3b82f6" />
                <rect x="58" y="96" width="44" height="26" rx="4" fill="#0f172a" />
                <rect x="68" y="104" width="24" height="12" rx="2" fill="#60a5fa" />
              </svg>
            </div>
          </div>

          {/* Quick Demo Autofill Bar */}
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-blue-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Instant Demo Switcher
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => handleRoleAutofill('admin')}
                className={`py-1 px-2 rounded-lg text-center transition ${
                  selectedRole === 'admin' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleAutofill('staff')}
                className={`py-1 px-2 rounded-lg text-center transition ${
                  selectedRole === 'staff' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => handleRoleAutofill('customer')}
                className={`py-1 px-2 rounded-lg text-center transition ${
                  selectedRole === 'customer' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Customer
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form matching screenshot */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Welcome Back <span className="text-2xl">👋</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Login to your account</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => alert('Demo Mode: Click the quick persona buttons on the left or sign in with any credentials!')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Solid Blue Login Button matching screenshot */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition active:scale-[0.99] disabled:opacity-60"
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">or</span>
              <p className="text-xs text-slate-600 font-medium mt-2">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
