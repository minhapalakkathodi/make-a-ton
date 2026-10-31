import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Repeat,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const StaffDashboard = () => {
  const { currentUser } = useAuth();
  const { subscriptions, invoices, quotations, customers } = useData();

  const pendingQuotations = quotations.filter((q) => q.status === 'Pending').slice(0, 4);
  const attentionInvoices = invoices.filter((i) => i.status === 'Overdue' || i.status === 'Pending').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Good Morning, {currentUser?.name?.split(' ')[0] || 'Staff'} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Operational dashboard for client billing, quotations, and active renewals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/staff/quotations">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-600/30 transition">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Create Quotation</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Assigned Clients</span>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{customers.length}</div>
            <div className="text-[11px] font-medium text-slate-400">Customer accounts</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Active Subscriptions</span>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {subscriptions.filter((s) => s.status === 'Active').length}
            </div>
            <div className="text-[11px] font-bold text-emerald-600">Generating revenue</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Repeat className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Pending Quotes</span>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{pendingQuotations.length}</div>
            <div className="text-[11px] font-medium text-amber-600">Awaiting client response</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Overdue Invoices</span>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {invoices.filter((i) => i.status === 'Overdue').length}
            </div>
            <div className="text-[11px] font-semibold text-rose-600">Follow-up needed</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Quotes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50 mb-3">
            <h3 className="text-sm font-bold text-slate-900">Open Quotations Awaiting Action</h3>
            <Link to="/staff/quotations" className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {pendingQuotations.map((q) => (
              <div key={q.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{q.customerName}</p>
                  <p className="text-[11px] text-slate-400">{q.planName}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block">{formatCurrency(q.totalAmount)}</span>
                  <span className="text-[10px] text-amber-600 font-semibold">{q.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attention Invoices */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50 mb-3">
            <h3 className="text-sm font-bold text-slate-900">Invoices Requiring Follow-Up</h3>
            <Link to="/staff/invoices" className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {attentionInvoices.map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{inv.customerName}</p>
                  <p className="text-[10px] font-mono text-slate-400">{inv.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block">{formatCurrency(inv.totalAmount)}</span>
                  <span
                    className={`text-[10px] font-semibold ${
                      inv.status === 'Overdue' ? 'text-rose-600' : 'text-amber-600'
                    }`}
                  >
                    {inv.status}
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
