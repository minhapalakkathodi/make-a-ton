import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Package,
  Repeat,
  Receipt,
  CreditCard,
  BarChart3,
  Calendar,
  CheckCircle2,
  Check,
  Shield,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { BrightLoopLogo } from '../../components/common/BrightLoopLogo';
import { Button } from '../../components/common/Button';
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
    <div className="min-h-screen bg-[#f8faff] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Demo Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="font-semibold text-white">Hackathon Demo Switcher:</span>
            <span>Switch portals instantly:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] transition shadow-xs"
            >
              Admin Dashboard
            </button>
            <button
              onClick={() => handleQuickDemo('staff')}
              className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-[11px] transition"
            >
              Staff Portal
            </button>
            <button
              onClick={() => handleQuickDemo('customer')}
              className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-[11px] transition"
            >
              Customer Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BrightLoopLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#about" className="hover:text-blue-600 transition">About</a>
            <Link to="/login" className="hover:text-blue-600 transition">Login</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/register">
              <button className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition active:scale-95">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Manage Your Subscriptions.{' '}
                <span className="text-blue-600 block mt-1">Simplify Your Billing.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed font-normal">
                One platform to manage plans, subscriptions, invoices, payments and revenue.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link to="/register">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/30 transition active:scale-95">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>

                <a href="#features">
                  <button className="px-5 py-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition">
                    View Features
                  </button>
                </a>
              </div>
            </div>

            {/* Right Visual Graphic (Matching laptop mockup with chart, calendar, checkmark badge) */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Soft light blue cloud backdrop */}
              <div className="absolute w-[420px] h-[420px] bg-gradient-to-tr from-blue-100/70 via-blue-50 to-indigo-100/60 rounded-full blur-2xl -z-10" />

              <div className="relative w-full max-w-lg">
                {/* Floating Calendar Widget */}
                <div className="absolute -top-4 -right-2 z-20 bg-white rounded-2xl p-3 shadow-xl border border-blue-50 flex items-center gap-2.5 animate-bounce duration-1000">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Next Renewal</span>
                    <span className="text-xs font-bold text-slate-800">01 May 2026</span>
                  </div>
                </div>

                {/* Floating Checkmark Badge */}
                <div className="absolute -bottom-4 -right-4 z-20 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 border-2 border-white">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>

                {/* Laptop Display Mockup */}
                <div className="bg-slate-900 rounded-2xl p-2.5 shadow-2xl border-4 border-slate-800 max-w-md mx-auto">
                  <div className="bg-[#f8faff] rounded-xl overflow-hidden border border-slate-200">
                    {/* Mockup Topbar */}
                    <div className="bg-white px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">BrightLoop Dashboard</span>
                      <div className="w-4" />
                    </div>

                    {/* Mockup Dashboard Preview */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 font-medium">Active Subscriptions</span>
                          <div className="text-lg font-bold text-slate-900 mt-0.5">250</div>
                          <span className="text-[10px] text-emerald-600 font-bold">↑ 12%</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 font-medium">Total Revenue</span>
                          <div className="text-lg font-bold text-slate-900 mt-0.5">₹5.2L</div>
                          <span className="text-[10px] text-emerald-600 font-bold">↑ 18%</span>
                        </div>
                      </div>

                      {/* Mock Chart SVG */}
                      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-bold text-slate-800">Revenue Overview</span>
                          <span className="text-[9px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                            Last 6 Months
                          </span>
                        </div>
                        <svg viewBox="0 0 300 80" className="w-full h-16">
                          <defs>
                            <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0 65 Q 40 50, 70 55 T 140 30 T 210 40 T 300 15 L 300 80 L 0 80 Z"
                            fill="url(#heroGradient)"
                          />
                          <path
                            d="M0 65 Q 40 50, 70 55 T 140 30 T 210 40 T 300 15"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <circle cx="300" cy="15" r="4" fill="#2563eb" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Bottom Feature Highlights matching screenshot */}
          <div id="features" className="mt-16 sm:mt-24 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { title: 'Product & Plans', icon: Package },
                { title: 'Subscription Management', icon: Repeat },
                { title: 'Automated Billing', icon: Receipt },
                { title: 'Payment Tracking', icon: CreditCard },
                { title: 'Revenue Analytics', icon: BarChart3 },
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col items-center text-center gap-3 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
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
      <footer id="about" className="mt-auto bg-white border-t border-slate-100 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrightLoopLogo className="w-6 h-6" textClassName="text-base font-bold" />
          <p>© {new Date().getFullYear()} BrightLoop Subscription Management System. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link to="/register" className="hover:text-blue-600">Sign Up</Link>
            <button onClick={() => handleQuickDemo('admin')} className="hover:text-blue-600">Admin</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
