import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Rocket, ArrowRight } from 'lucide-react';
import { BrightLoopLogo } from '../../components/common/BrightLoopLogo';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerCustomer } = useAuth();
  const { addCustomer } = useData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please provide your name and email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // 1. Add to customer store
      const newCust = addCustomer({
        name: formData.name,
        company: `${formData.name}'s Organization`,
        contactPerson: formData.name,
        email: formData.email,
        phone: '+91 98765 00000',
        address: '123 Business Boulevard',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: '400001',
      });

      // 2. Authenticate
      registerCustomer({
        id: newCust.id,
        name: formData.name,
        email: formData.email,
        company: newCust.company,
      });

      setIsLoading(false);
      navigate('/portal/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f8faff] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Centered Modal / Split Container matching screenshot */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* Left Side: Soft blue panel with Rocket illustration matching screenshot */}
        <div className="md:col-span-5 bg-[#eef4ff] p-8 flex flex-col justify-between relative overflow-hidden">
          <BrightLoopLogo />

          {/* Rocket Graphic matching screenshot */}
          <div className="my-8 flex flex-col items-center justify-center text-center">
            <div className="w-36 h-36 bg-white/70 rounded-full flex items-center justify-center shadow-lg border border-blue-100 relative mb-6">
              <Rocket className="w-20 h-20 text-blue-600 transform -rotate-45" />
              {/* Flame flare */}
              <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-amber-400/80 blur-xs" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Grow Your Business with{' '}
              <span className="text-blue-600 block">BrightLoop</span>
            </h3>
          </div>

          <div className="text-center text-xs text-slate-400 font-medium">
            Next-gen subscription & billing infrastructure
          </div>
        </div>

        {/* Right Side: Create Account Form matching screenshot */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Create Account
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Join BrightLoop today</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Solid Blue Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition active:scale-[0.99] disabled:opacity-60 mt-2"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center pt-1">
              <p className="text-xs text-slate-600 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
