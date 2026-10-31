import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, ArrowUp, Eye, EyeOff } from 'lucide-react';
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
    <div className="min-h-screen bg-[#fffdf5] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Centered Modal / Split Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-[#faefbe] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* Left Side: Soft warm yellow panel with Rocket graphic */}
        <div className="md:col-span-5 bg-[#fef8db] p-8 flex flex-col justify-between relative overflow-hidden border-r border-[#faefbe]">
          <BrightLoopLogo />

          <div className="my-8 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 bg-[#fef3c7] rounded-full flex items-center justify-center border border-[#fde68a] shadow-xs mb-6 relative">
              <Rocket className="w-16 h-16 text-[#d97706] transform -rotate-45" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight leading-snug">
              Grow your business<br />
              <span className="text-slate-900">with BrightLoop.</span>
            </h3>
          </div>

          <div className="text-center text-xs text-slate-500 font-medium">
            Subscription billing, simplified.
          </div>
        </div>

        {/* Right Side: Create Account Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-[#fffdf5]">
          <div className="max-w-md w-full mx-auto space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                Create account
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Join BrightLoop today.</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2 bg-white border border-[#faefbe] rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f5b72e]/40 focus:border-[#f5b72e] transition-colors shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@company.com"
                  className="w-full px-3.5 py-2 bg-white border border-[#faefbe] rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f5b72e]/40 focus:border-[#f5b72e] transition-colors shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 pr-10 py-2 bg-white border border-[#faefbe] rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f5b72e]/40 focus:border-[#f5b72e] transition-colors shadow-2xs"
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

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 pr-10 py-2 bg-white border border-[#faefbe] rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f5b72e]/40 focus:border-[#f5b72e] transition-colors shadow-2xs"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#f5b72e] hover:bg-[#eab308] text-slate-950 font-bold text-sm shadow-sm transition active:scale-[0.99] disabled:opacity-60 mt-2"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="text-center pt-1">
              <p className="text-xs text-slate-600 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-slate-950 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
