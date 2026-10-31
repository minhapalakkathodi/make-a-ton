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
      {/* Welcome Banner with warm tones */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#faefbe] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Welcome, {currentUser?.name || 'John Doe'}!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            Manage your subscriptions and payments easily.
          </p>
        </div>

        {/* Friendly User Illustration */}
        <div className="w-32 h-28 sm:w-40 sm:h-32 bg-[#fef8db] rounded-2xl flex items-center justify-center shrink-0 relative border border-[#faefbe]">
          <svg viewBox="0 0 120 100" className="w-28 h-28">
            <circle cx="60" cy="35" r="16" fill="#f5b72e" />
            <path d="M35 85 C35 60, 85 60, 85 85 Z" fill="#eab308" />
            <rect x="42" y="68" width="36" height="20" rx="3" fill="#18181b" />
            <rect x="50" y="74" width="20" height="9" rx="1.5" fill="#fef08a" />
          </svg>
        </div>
      </div>

      {/* "Your Active Subscription" Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#faefbe] shadow-xs">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Your Active Subscription
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#fffdf5] border border-[#faefbe]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] text-[#b45309] flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 fill-current" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-zinc-900">
                  {activeSub?.planName || 'Premium Plan'}
                </span>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#dcfce7] text-[#15803d]">
                  Active
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-normal">
                Renews on: {formatDate(activeSub?.nextRenewalDate || '2026-05-01')}
              </p>
            </div>
          </div>

          <Link to="/portal/subscriptions">
            <button className="px-5 py-2.5 rounded-full bg-[#f5b72e] hover:bg-[#eab308] text-zinc-900 font-medium text-xs transition active:scale-95 shadow-xs">
              Manage Plan
            </button>
          </Link>
        </div>
      </div>

      {/* "Quick Links" Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Quick Links
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* View Invoices */}
          <Link to="/portal/invoices">
            <div className="bg-white rounded-2xl p-5 border border-[#faefbe] shadow-xs hover:border-[#f5b72e] hover:bg-[#fef8db]/20 transition flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#fef8db] text-[#b45309] flex items-center justify-center group-hover:bg-[#f5b72e] group-hover:text-zinc-900 transition-colors">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-zinc-900 transition">
                  View Invoices
                </h4>
                <p className="text-[11px] text-zinc-400">Download statements</p>
              </div>
            </div>
          </Link>

          {/* Payment History */}
          <Link to="/portal/payments">
            <div className="bg-white rounded-2xl p-5 border border-[#faefbe] shadow-xs hover:border-[#f5b72e] hover:bg-[#fef8db]/20 transition flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#fef8db] text-[#b45309] flex items-center justify-center group-hover:bg-[#f5b72e] group-hover:text-zinc-900 transition-colors">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-zinc-900 transition">
                  Payment History
                </h4>
                <p className="text-[11px] text-zinc-400">View past receipts</p>
              </div>
            </div>
          </Link>

          {/* Browse Plans */}
          <Link to="/portal/plans">
            <div className="bg-white rounded-2xl p-5 border border-[#faefbe] shadow-xs hover:border-[#f5b72e] hover:bg-[#fef8db]/20 transition flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#fef8db] text-[#b45309] flex items-center justify-center group-hover:bg-[#f5b72e] group-hover:text-zinc-900 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-zinc-900 transition">
                  Browse Plans
                </h4>
                <p className="text-[11px] text-zinc-400">Upgrade or add seats</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
