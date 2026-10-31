import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Receipt,
  CreditCard,
  BarChart3,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { BrightLoopLogo } from '../../components/common/BrightLoopLogo';
import { useAuth } from '../../context/AuthContext';

export const LandingPage = () => {
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = (role) => {
    loginAs(role);
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'staff') navigate('/staff/dashboard');
    else navigate('/portal/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fffdf5] text-slate-900 flex flex-col font-sans selection:bg-[#f5b72e] selection:text-slate-900">
      {/* Top Demo Bar */}
      <div className="bg-[#18181b] text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#f5b72e] animate-pulse"></span>
            <span className="font-semibold text-white">Hackathon Demo Switcher:</span>
            <span>Switch portals instantly:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-0.5 rounded-full bg-[#f5b72e] text-slate-900 font-bold text-[11px] transition shadow-2xs hover:bg-[#eab308]"
            >
              Admin Dashboard
            </button>
            <button
              onClick={() => handleQuickDemo('staff')}
              className="px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-[11px] transition"
            >
              Staff Portal
            </button>
            <button
              onClick={() => handleQuickDemo('customer')}
              className="px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-[11px] transition"
            >
              Customer Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar matching template */}
      <header className="sticky top-0 z-40 bg-[#fffdf5]/95 backdrop-blur-md border-b border-[#faefbe]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BrightLoopLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition">Features</a>
            <a href="#features" className="hover:text-slate-900 transition">Pricing</a>
            <Link to="/login" className="hover:text-slate-900 transition">Login</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/register">
              <button className="px-5 py-2 rounded-full bg-[#f5b72e] hover:bg-[#eab308] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition active:scale-95">
                Get started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section matching Template 1 */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              {/* Pill Tag */}
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#fef3c7] text-[#92400e] text-xs font-semibold border border-[#fde68a]">
                Subscription billing, simplified.
              </div>

              {/* Big Bold Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
                Manage<br />
                subscriptions.<br />
                <span className="text-slate-950">Bill with calm.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed font-normal">
                Plans, invoices, payments and revenue in one quiet, tidy workspace.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link to="/register">
                  <button className="px-6 py-2.5 rounded-full bg-[#18181b] hover:bg-black text-white font-bold text-sm shadow-sm transition active:scale-95">
                    Get started
                  </button>
                </Link>

                <a href="#features">
                  <button className="px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold text-sm transition shadow-2xs">
                    View features
                  </button>
                </a>
              </div>
            </div>

            {/* Right Visual Graphic (Matching the exact card mockup in template) */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl border-2 border-[#fde68a] p-4 shadow-xl shadow-amber-500/5 space-y-4">
                {/* Illustration Banner */}
                <div className="bg-[#fef3c7] rounded-2xl p-6 flex items-center justify-between relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    {/* Person Avatar */}
                    <div className="w-14 h-14 rounded-full bg-[#fde68a] border-2 border-amber-300 flex items-center justify-center overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-[#18181b] mt-4" />
                    </div>

                    {/* Mini Laptop */}
                    <div className="w-20 h-14 bg-[#18181b] rounded-md p-1.5 flex flex-col justify-between">
                      <div className="flex items-end gap-1 h-8 px-1">
                        <div className="w-2 h-4 bg-[#f5b72e] rounded-xs" />
                        <div className="w-2 h-6 bg-[#f5b72e] rounded-xs" />
                        <div className="w-2 h-7 bg-[#eab308] rounded-xs" />
                      </div>
                      <div className="w-full h-1 bg-slate-700 rounded-full" />
                    </div>
                  </div>

                  {/* Potted Plant & Floating Card */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-10 bg-emerald-600 rounded-t-full relative">
                      <div className="w-7 h-4 bg-[#d97706] rounded-b-md absolute bottom-0" />
                    </div>
                    <div className="w-10 h-6 bg-white rounded border border-amber-200 shadow-2xs flex items-center justify-center text-[10px] font-bold text-amber-600">
                      ₹
                    </div>
                  </div>
                </div>

                {/* Total Revenue Box with Golden Sparkline */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Total revenue</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-0.5">₹5.2L</div>
                  </div>

                  {/* Golden Sparkline SVG */}
                  <div className="w-28 h-10">
                    <svg viewBox="0 0 100 35" className="w-full h-full">
                      <path
                        d="M0 25 Q 25 28, 45 18 T 75 14 T 100 4"
                        fill="none"
                        stroke="#f5b72e"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Bottom 2 metric boxes */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
                    <span className="text-[11px] text-slate-400 font-medium">Active</span>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">250</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
                    <span className="text-[11px] text-slate-400 font-medium">Overdue</span>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">12</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Bottom Feature Cards matching Template 1 */}
          <div id="features" className="mt-16 sm:mt-24 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Products & Plans', icon: Package },
                { title: 'Automated Billing', icon: Receipt },
                { title: 'Payment Tracking', icon: CreditCard },
                { title: 'Revenue Analytics', icon: BarChart3 },
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#fde68a] transition-all duration-200 flex flex-col items-center text-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#fef8db] text-[#b45309] flex items-center justify-center group-hover:bg-[#f5b72e] group-hover:text-slate-950 transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {feat.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-[#faefbe] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrightLoopLogo className="w-5 h-5" textClassName="text-base font-bold" />
          <p>© {new Date().getFullYear()} BrightLoop Subscription Management System. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <Link to="/login" className="hover:text-slate-900">Login</Link>
            <Link to="/register" className="hover:text-slate-900">Sign Up</Link>
            <button onClick={() => handleQuickDemo('admin')} className="hover:text-slate-900">Admin</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
