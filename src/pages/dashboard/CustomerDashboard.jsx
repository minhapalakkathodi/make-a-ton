import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Receipt, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/formatters';

export const CustomerDashboard = () => {
  const { currentUser } = useAuth();
  const { subscriptions } = useData();

  // Find customer's subscription
  const activeSub = subscriptions.find(
    (s) => s.status === 'Active' && (s.customerName === 'ABC Ltd' || s.customerId === currentUser?.id)
  ) || subscriptions[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner matching screenshot with laptop user illustration */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {currentUser?.name || 'John Doe'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage your subscriptions and payments easily.
          </p>
        </div>

        {/* Friendly User Illustration */}
        <div className="w-32 h-28 sm:w-40 sm:h-32 bg-blue-50/70 rounded-2xl flex items-center justify-center shrink-0 relative">
          <svg viewBox="0 0 120 100" className="w-28 h-28">
            <circle cx="60" cy="35" r="16" fill="#2563eb" />
            <path d="M35 85 C35 60, 85 60, 85 85 Z" fill="#3b82f6" />
            <rect x="42" y="68" width="36" height="20" rx="3" fill="#0f172a" />
            <rect x="50" y="74" width="20" height="9" rx="1.5" fill="#60a5fa" />
          </svg>
        </div>
      </div>

      {/* "Your Active Subscription" Card matching screenshot */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          Your Active Subscription
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50/40 border border-amber-100/70">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 fill-current" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900">
                  {activeSub?.planName || 'Premium Plan'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Renews on: {formatDate(activeSub?.nextRenewalDate || '2026-05-01')}
              </p>
            </div>
          </div>

          <Link to="/portal/subscriptions">
            <button className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs transition active:scale-95 shadow-2xs">
              Manage Plan
            </button>
          </Link>
        </div>
      </div>

      {/* "Quick Links" Cards matching screenshot */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Quick Links
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* View Invoices */}
          <Link to="/portal/invoices">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                  View Invoices
                </h4>
                <p className="text-[11px] text-slate-400">Download statements</p>
              </div>
            </div>
          </Link>

          {/* Payment History */}
          <Link to="/portal/payments">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                  Payment History
                </h4>
                <p className="text-[11px] text-slate-400">View past receipts</p>
              </div>
            </div>
          </Link>

          {/* Browse Plans */}
          <Link to="/portal/plans">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                  Browse Plans
                </h4>
                <p className="text-[11px] text-slate-400">Upgrade or add seats</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
