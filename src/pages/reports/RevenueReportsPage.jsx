import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Repeat,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  Printer,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { StatsCard } from '../../components/common/StatsCard';
import { Button } from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';

export const RevenueReportsPage = () => {
  const { metrics, subscriptions, invoices, plans } = useData();

  // Plan Distribution Breakdown
  const planRevenueData = plans.map((p) => {
    const activeWithPlan = subscriptions.filter((s) => s.planId === p.id && s.status === 'Active');
    const totalRev = activeWithPlan.reduce((acc, s) => acc + s.totalAmount, 0);
    return {
      name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
      subscriptions: activeWithPlan.length,
      revenue: totalRev,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue & Growth Analytics"
        subtitle="In-depth recurring metrics, monthly cohorts, subscription retention, and cash collections."
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Reports' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={Printer}
              onClick={() => window.print()}
            >
              Export Report
            </Button>
          </div>
        }
      />

      {/* High-level Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Current MRR"
          value={formatCurrency(metrics.mrr)}
          change="+15.3%"
          isPositive={true}
          icon={DollarSign}
          iconColor="text-emerald-600 bg-emerald-50 border-emerald-100"
          subtext="Monthly Recurring Revenue"
        />

        <StatsCard
          title="Annual Run Rate (ARR)"
          value={formatCurrency(metrics.arr)}
          change="+18.2%"
          isPositive={true}
          icon={TrendingUp}
          iconColor="text-brand-600 bg-brand-50 border-brand-100"
          subtext="Projected 12-month forward"
        />

        <StatsCard
          title="Total Cash Collected"
          value={formatCurrency(metrics.totalCollected)}
          icon={Repeat}
          iconColor="text-blue-600 bg-blue-50 border-blue-100"
          subtext="Cleared invoices YTD"
        />

        <StatsCard
          title="At-Risk Outstanding"
          value={formatCurrency(metrics.outstandingAmount)}
          change={metrics.overdueCount > 0 ? `${metrics.overdueCount} Overdue` : 'Zero Overdue'}
          isPositive={metrics.overdueCount === 0}
          icon={AlertTriangle}
          iconColor="text-amber-600 bg-amber-50 border-amber-100"
          subtext="Uncollected invoice volume"
        />
      </div>

      {/* Revenue Trend vs Monthly Target (Bar + Line) */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              Trailing 6-Month Performance
            </span>
          }
        >
          <CardTitle>Monthly Cash Flow & Target Realization</CardTitle>
          <CardDescription>Actual revenue earned vs forecasted monthly quota</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.monthlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  formatter={(val, name) => [formatCurrency(val), name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  formatter={(v) => <span className="text-xs text-slate-600 font-medium">{v}</span>}
                />
                <Bar dataKey="revenue" name="Actual Realized MRR" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Monthly Target" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Plan Performance & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Plan Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Subscription Tier</CardTitle>
            <CardDescription>Active subscription distribution across catalog tiers</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {planRevenueData.map((tier, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">{tier.name}</span>
                    <span className="text-slate-900">{formatCurrency(tier.revenue)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (tier.revenue / Math.max(1, metrics.mrr)) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {tier.subscriptions} active subscription(s)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Retention Status */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Retention Health</CardTitle>
            <CardDescription>Status health of current customer base</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.statusDistribution}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {metrics.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val} subscriptions`, name]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

