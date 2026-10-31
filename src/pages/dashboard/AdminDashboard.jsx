import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Repeat,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  TrendingUp,
  FileSpreadsheet,
  Plus,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';

export const AdminDashboard = () => {
  const { subscriptions } = useData();
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 6 Months');

  // Chart data exactly matching the screenshot (0k, 2k, 4k, 6k)
  const chartData = [
    { month: 'Jan', revenue: 2200 },
    { month: 'Feb', revenue: 3800 },
    { month: 'Mar', revenue: 3200 },
    { month: 'Apr', revenue: 4600 },
    { month: 'May', revenue: 4100 },
    { month: 'Jun', revenue: 5400 },
  ];

  // Recent subscriptions matching screenshot
  const recentSubs = [
    { customer: 'ABC Ltd', plan: 'Premium', status: 'Active', amount: 5000 },
    { customer: 'XYZ Pvt Ltd', plan: 'Basic', status: 'Active', amount: 1000 },
    { customer: 'PQR Corp', plan: 'Enterprise', status: 'Active', amount: 10000 },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting Banner matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Good Morning, Admin <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Here&apos;s what&apos;s happening with your business today:
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/subscriptions">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-600/30 transition">
              <Plus className="w-3.5 h-3.5" />
              <span>New Subscription</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards Row matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Active Subscriptions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Active Subscriptions</span>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">250</div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <span>↑ 12%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* 2. Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Total Revenue</span>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">₹5.2L</div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <span>↑ 18%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold font-serif">₹</span>
          </div>
        </div>

        {/* 3. Outstanding */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Outstanding</span>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">₹85K</div>
            <div className="text-[11px] font-medium text-slate-400">
              Pending collection
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* 4. Overdue Invoices */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Overdue Invoices</span>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">12</div>
            <div className="text-[11px] font-semibold text-rose-600">
              Action required
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts & Recent Subscriptions Row matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Overview (Area / Line Chart) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-900">Revenue Overview</h3>
            <div className="relative">
              <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100">
                <span>{selectedTimeframe}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="brightloopRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '10px', color: '#fff', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#brightloopRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Subscriptions Card matching screenshot */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-900">Recent Subscriptions</h3>
            <Link
              to="/admin/subscriptions"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentSubs.map((sub, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{sub.customer}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{sub.plan}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    {sub.status}
                  </span>
                  <span className="font-bold text-slate-900 text-xs w-16 text-right">
                    {formatCurrency(sub.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
