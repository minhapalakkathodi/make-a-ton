import React from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export const AdminDashboard = () => {
  // Chart data exactly matching the curve in Template 3
  const chartData = [
    { month: '', revenue: 1800 },
    { month: '', revenue: 1600 },
    { month: '', revenue: 3200 },
    { month: '', revenue: 2900 },
    { month: '', revenue: 4200 },
    { month: '', revenue: 5200 },
  ];

  // Recent subscriptions matching Template 3
  const recentSubs = [
    { customer: 'ABC Ltd', plan: 'Premium', amount: 5000 },
    { customer: 'XYZ Pvt Ltd', plan: 'Basic', amount: 1000 },
    { customer: 'PQR Corp', plan: 'Enterprise', amount: 10000 },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting Banner matching Template 3 */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
          Good morning, Admin
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* 4 Stat Cards matching Template 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Active subscriptions */}
        <div className="bg-white rounded-2xl p-5 border border-[#faefbe] shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Active subscriptions</span>
          <div className="text-2xl font-extrabold text-slate-950 mt-1">250</div>
        </div>

        {/* 2. Total revenue (Warm Yellow Highlight Card matching Template 3!) */}
        <div className="bg-[#fef3c7] rounded-2xl p-5 border border-[#fde68a] shadow-2xs">
          <span className="text-xs font-semibold text-amber-900">Total revenue</span>
          <div className="text-2xl font-extrabold text-slate-950 mt-1">₹5.2L</div>
        </div>

        {/* 3. Outstanding */}
        <div className="bg-white rounded-2xl p-5 border border-[#faefbe] shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Outstanding</span>
          <div className="text-2xl font-extrabold text-slate-950 mt-1">₹85K</div>
        </div>

        {/* 4. Overdue invoices */}
        <div className="bg-white rounded-2xl p-5 border border-[#faefbe] shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Overdue invoices</span>
          <div className="text-2xl font-extrabold text-slate-950 mt-1">12</div>
        </div>
      </div>

      {/* Charts & Recent Subscriptions Row matching Template 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue overview - Golden Smooth Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#faefbe] shadow-2xs flex flex-col justify-between">
          <div className="pb-3 border-b border-[#faefbe]/40">
            <h3 className="text-sm font-bold text-slate-900">Revenue overview</h3>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="warmGoldenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5b72e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#fef3c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#fef8db" vertical={false} />
                <XAxis dataKey="month" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '10px', color: '#fff', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f5b72e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#warmGoldenGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Subscriptions Card matching Template 3 */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#faefbe] shadow-2xs flex flex-col justify-between">
          <div className="pb-3 border-b border-[#faefbe]/40">
            <h3 className="text-sm font-bold text-slate-900">Recent subscriptions</h3>
          </div>

          <div className="divide-y divide-[#faefbe]/40">
            {recentSubs.map((sub, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{sub.customer}</span>
                  <span className="text-slate-400 font-medium"> · {sub.plan}</span>
                </div>
                <span className="font-bold text-slate-900 text-xs">
                  {formatCurrency(sub.amount)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#faefbe]/40">
            <Link
              to="/admin/subscriptions"
              className="text-xs font-bold text-slate-700 hover:text-slate-950 transition flex items-center justify-between"
            >
              <span>View all subscriptions</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
