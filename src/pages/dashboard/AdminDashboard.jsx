import React, { useState } from 'react';
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
import { useData } from '../../context/DataContext';

export const AdminDashboard = () => {
  const { subscriptions } = useData();

  // Highlighted card state (defaults to 'revenue' matching Template 3)
  const [selectedCard, setSelectedCard] = useState('revenue');
  // Toggle to show all subscriptions in Recent Subscriptions card
  const [showAllSubs, setShowAllSubs] = useState(false);

  // 4 Stat Cards
  const statCards = [
    {
      id: 'active',
      title: 'Active subscriptions',
      value: '250',
    },
    {
      id: 'revenue',
      title: 'Total revenue',
      value: '₹5.2L',
    },
    {
      id: 'outstanding',
      title: 'Outstanding',
      value: '₹85K',
    },
    {
      id: 'overdue',
      title: 'Overdue invoices',
      value: '12',
    },
  ];

  // Chart data configs responsive to the clicked card
  const chartConfigs = {
    revenue: {
      title: 'Revenue overview',
      data: [
        { month: '', value: 1800 },
        { month: '', value: 1600 },
        { month: '', value: 3200 },
        { month: '', value: 2900 },
        { month: '', value: 4200 },
        { month: '', value: 5200 },
      ],
      dataKey: 'value',
      formatter: (val) => [formatCurrency(val), 'Revenue'],
    },
    active: {
      title: 'Active subscriptions overview',
      data: [
        { month: '', value: 110 },
        { month: '', value: 145 },
        { month: '', value: 180 },
        { month: '', value: 205 },
        { month: '', value: 230 },
        { month: '', value: 250 },
      ],
      dataKey: 'value',
      formatter: (val) => [`${val} accounts`, 'Active Subscriptions'],
    },
    outstanding: {
      title: 'Outstanding payments overview',
      data: [
        { month: '', value: 25000 },
        { month: '', value: 42000 },
        { month: '', value: 38000 },
        { month: '', value: 65000 },
        { month: '', value: 72000 },
        { month: '', value: 85000 },
      ],
      dataKey: 'value',
      formatter: (val) => [formatCurrency(val), 'Outstanding'],
    },
    overdue: {
      title: 'Overdue invoices overview',
      data: [
        { month: '', value: 4 },
        { month: '', value: 6 },
        { month: '', value: 9 },
        { month: '', value: 8 },
        { month: '', value: 14 },
        { month: '', value: 12 },
      ],
      dataKey: 'value',
      formatter: (val) => [`${val} invoices`, 'Overdue Invoices'],
    },
  };

  const currentChart = chartConfigs[selectedCard] || chartConfigs.revenue;

  // Complete subscriptions list
  const allSubsList =
    subscriptions && subscriptions.length > 0
      ? subscriptions
      : [
          { id: 'SUB-001', customerName: 'ABC Ltd', planName: 'Premium', totalAmount: 5000, status: 'Active' },
          { id: 'SUB-002', customerName: 'XYZ Pvt Ltd', planName: 'Basic', totalAmount: 1000, status: 'Draft' },
          { id: 'SUB-003', customerName: 'PQR Corp', planName: 'Enterprise', totalAmount: 10000, status: 'Closed' },
          { id: 'SUB-004', customerName: 'Global Logistics', planName: 'Enterprise', totalAmount: 15000, status: 'Active' },
          { id: 'SUB-005', customerName: 'Nova Tech Systems', planName: 'Pro Tier', totalAmount: 3500, status: 'Active' },
          { id: 'SUB-006', customerName: 'Apex Innovations', planName: 'Starter', totalAmount: 8000, status: 'Active' },
        ];

  // If collapsed: top 3 matching Template 3; if expanded: all items!
  const displayedSubs = showAllSubs ? allSubsList : allSubsList.slice(0, 3);

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

      {/* 4 Stat Cards with Hover & Click Highlighting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const isSelected = selectedCard === card.id;
          return (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
              className={`group rounded-2xl p-5 border cursor-pointer select-none transition-all duration-200 active:scale-[0.98] ${
                isSelected
                  ? 'bg-[#fef3c7] border-[#fde68a] shadow-xs scale-[1.01]'
                  : 'bg-white border-[#faefbe] shadow-2xs hover:bg-[#fef3c7] hover:border-[#fde68a] hover:scale-[1.01] hover:shadow-xs'
              }`}
              title={`Click to highlight and view ${card.title} analytics`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold transition-colors duration-200 ${
                    isSelected ? 'text-amber-900' : 'text-slate-500 group-hover:text-amber-900'
                  }`}
                >
                  {card.title}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f5b72e] animate-pulse" />
                )}
              </div>
              <div className="text-2xl font-extrabold text-slate-950 mt-1">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Charts & Recent Subscriptions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue overview - Golden Smooth Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#faefbe] shadow-2xs flex flex-col justify-between">
          <div className="pb-3 border-b border-[#faefbe]/40 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{currentChart.title}</h3>
            <span className="text-[11px] font-semibold text-slate-400">
              Interactive timeline
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  formatter={currentChart.formatter}
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={currentChart.dataKey}
                  stroke="#f5b72e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#warmGoldenGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Subscriptions Card with "View all" Toggle */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#faefbe] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#faefbe]/40 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {showAllSubs ? `All subscriptions (${displayedSubs.length})` : 'Recent subscriptions'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAllSubs((prev) => !prev)}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 bg-[#fef3c7] hover:bg-[#fde68a] px-2.5 py-1 rounded-full transition flex items-center gap-1 active:scale-95 cursor-pointer shadow-2xs"
              >
                <span>{showAllSubs ? 'Show recent' : 'View all'}</span>
                <span className="text-[11px] font-bold">{showAllSubs ? '↑' : '→'}</span>
              </button>
            </div>

            <div
              className={`divide-y divide-[#faefbe]/40 transition-all duration-300 ${
                showAllSubs ? 'max-h-72 overflow-y-auto pr-1' : ''
              }`}
            >
              {displayedSubs.map((sub, idx) => (
                <div
                  key={sub.id || idx}
                  className="py-3.5 flex items-center justify-between text-xs hover:bg-[#fef8db]/30 rounded-xl px-2 -mx-2 transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900">{sub.customerName || sub.customer}</span>
                      {showAllSubs && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            sub.status === 'Active'
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : sub.status === 'Draft'
                              ? 'bg-[#fef3c7] text-[#b45309]'
                              : 'bg-[#fee2e2] text-[#b91c1c]'
                          }`}
                        >
                          {sub.status || 'Active'}
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400 font-medium">
                      <span>{sub.planName || sub.plan}</span>
                      {sub.interval && <span> · {sub.interval}</span>}
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 text-xs shrink-0 ml-2">
                    {formatCurrency(sub.totalAmount || sub.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#faefbe]/40 mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAllSubs((prev) => !prev)}
              className="text-xs font-bold text-slate-700 hover:text-slate-950 transition flex items-center gap-1 cursor-pointer"
            >
              <span>
                {showAllSubs ? 'Show less (3 items)' : `View all subscriptions (${allSubsList.length})`}
              </span>
              <span>{showAllSubs ? '↑' : '→'}</span>
            </button>

            <Link
              to="/admin/subscriptions"
              className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2"
            >
              Manage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
