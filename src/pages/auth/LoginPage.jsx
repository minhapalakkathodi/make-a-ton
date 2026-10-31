import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Rocket, ArrowUp } from 'lucide-react';
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
    <div className="min-h-screen bg-[#fffdf5] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Centered Modal / Split Container matching Template 2 */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-[#faefbe] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        
        {/* Left Side: Soft warm yellow panel with bar chart & rocket graphic */}
        <div className="md:col-span-5 bg-[#fef8db] p-8 flex flex-col justify-between relative overflow-hidden border-r border-[#faefbe]">
          <div>
            <BrightLoopLogo />
          </div>

          {/* Graphic matching Template 2 (rising golden bars with rocket and arrow) */}
          <div className="my-6 flex flex-col items-center justify-center">
            <div className="w-56 h-36 bg-[#fef3c7] rounded-2xl border border-[#fde68a] p-4 flex items-end justify-between relative shadow-2xs">
              {/* Arrow */}
              <div className="absolute top-3 left-4 flex items-center gap-1 text-[#b45309] font-bold text-xs">
                <ArrowUp className="w-4 h-4 transform rotate-45" />
              </div>

              {/* Bar columns */}
              <div className="w-7 h-10 bg-[#fde68a] rounded-t-lg" />
              <div className="w-7 h-16 bg-[#fcd34d] rounded-t-lg" />
              <div className="w-7 h-22 bg-[#f5b72e] rounded-t-lg" />
              <div className="w-7 h-28 bg-[#d97706] rounded-t-lg relative">
                {/* Floating Rocket */}
                <div className="absolute -top-6 -right-5 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-amber-200">
                  <Rocket className="w-5 h-5 text-[#d97706] transform -rotate-45" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Headline matching Template 2 */}
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight leading-snug">
              Billing that<br />feels light.
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Your subscription management partner.
            </p>

            {/* Quick Demo Switcher */}
            <div className="mt-4 pt-3 border-t border-[#ebd88d]/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Autofill demo persona:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => handleRoleAutofill('admin')}
                  className={`py-1 px-2 rounded-lg text-center transition ${
                    selectedRole === 'admin' ? 'bg-[#f5b72e] text-slate-950 font-bold shadow-2xs' : 'bg-white/80 text-slate-700 hover:bg-white'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleAutofill('staff')}
                  className={`py-1 px-2 rounded-lg text-center transition ${
                    selectedRole === 'staff' ? 'bg-[#f5b72e] text-slate-950 font-bold shadow-2xs' : 'bg-white/80 text-slate-700 hover:bg-white'
                  }`}
                >
                  Staff
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleAutofill('customer')}
                  className={`py-1 px-2 rounded-lg text-center transition ${
                    selectedRole === 'customer' ? 'bg-[#f5b72e] text-slate-950 font-bold shadow-2xs' : 'bg-white/80 text-slate-700 hover:bg-white'
                  }`}
                >
                  Customer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Welcome back Form matching Template 2 */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-[#fffdf5]">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Log in to your account.</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#faefbe] rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f5b72e]/40 focus:border-[#f5b72e] transition-colors shadow-2xs"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Demo Mode: Click the quick persona buttons on the left or sign in with any credentials!')}
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-900"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 pr-10 py-2.5 bg-white border border-[#faefbe] rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f5b72e]/40 focus:border-[#f5b72e] transition-colors shadow-2xs"
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

              {/* Warm Golden Yellow Log in Button matching Template 2 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#f5b72e] hover:bg-[#eab308] text-slate-950 font-bold text-sm shadow-sm transition active:scale-[0.99] disabled:opacity-60 mt-3"
              >
                {isLoading ? 'Signing in...' : 'Log in'}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-600 font-medium">
                No account?{' '}
                <Link to="/register" className="font-bold text-slate-950 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
