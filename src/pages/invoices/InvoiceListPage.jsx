import React, { useState, useMemo } from 'react';
import { Plus, Search, Eye, CreditCard, ChevronLeft, ChevronRight, Printer, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const InvoiceListPage = () => {
  const { invoices, customers, addInvoice, recordPayment } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [payingInvoice, setPayingInvoice] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    amount: 5000,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: 'CRM Software - Monthly Subscription',
  });

  const handleOpenAdd = () => {
    setFormData({
      customerId: customers[0]?.id || '',
      amount: 5000,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'CRM Software - Monthly Subscription',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === formData.customerId) || customers[0];

    addInvoice({
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      customerAddress: cust.address || 'Corporate Headquarters',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      status: 'Pending',
      items: [
        {
          description: formData.description,
          quantity: 1,
          unitPrice: Number(formData.amount),
          amount: Number(formData.amount),
        },
      ],
      subtotal: Number(formData.amount),
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: Number(formData.amount),
    });

    setIsModalOpen(false);
  };

  const handleSettlePayment = () => {
    if (!payingInvoice) return;
    recordPayment({
      invoiceId: payingInvoice.id,
      invoiceNumber: payingInvoice.invoiceNumber,
      customerId: payingInvoice.customerId,
      customerName: payingInvoice.customerName,
      amount: payingInvoice.totalAmount,
      paymentMethod: 'Direct Net Banking',
      paymentDate: new Date().toISOString().split('T')[0],
    });
    setPayingInvoice(null);
    setViewingInvoice(null);
  };

  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoices;
    const lower = searchQuery.toLowerCase();
    return invoices.filter(
      (i) =>
        i.invoiceNumber.toLowerCase().includes(lower) ||
        i.customerName.toLowerCase().includes(lower) ||
        i.status.toLowerCase().includes(lower)
    );
  }, [invoices, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header matching screenshot */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Invoices</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">View and manage invoices</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Invoice</span>
        </button>
      </div>

      {/* Main Table Card matching screenshot */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Search bar inside card */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoices..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Invoices Table matching screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold text-[11px]">
                <th className="px-6 py-3.5">Invoice No.</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{inv.customerName}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(inv.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : inv.status === 'Pending'
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(inv.issueDate)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => setPayingInvoice(inv)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition"
                        >
                          Settle
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer pagination bar matching screenshot */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>
            Showing 1-{filteredInvoices.length} of {filteredInvoices.length} items
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-40" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-[11px]">
              1
            </span>
            <button className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-40" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Invoice"
        description="Issue a new itemized recurring billing invoice."
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Customer"
            required
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            options={customers.map((c) => ({ value: c.id, label: c.name }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Invoice Amount (INR ₹)"
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />

            <Input
              label="Payment Due Date"
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g. CRM Software Monthly Subscription"
          />

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Invoice Details / Print View */}
      {viewingInvoice && (
        <Modal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          title={`Invoice ${viewingInvoice.invoiceNumber}`}
          description={`Customer: ${viewingInvoice.customerName}`}
          size="md"
        >
          <div id="printable-section" className="space-y-4 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px]">Issued To</span>
                <span className="font-bold text-slate-800 text-sm">{viewingInvoice.customerName}</span>
                <span className="text-slate-500 block">{viewingInvoice.customerEmail}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Date Issued</span>
                <span className="font-semibold text-slate-800">{formatDate(viewingInvoice.issueDate)}</span>
                <span className="block text-slate-500">Due: {formatDate(viewingInvoice.dueDate)}</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-50 font-bold border-b border-slate-100 flex justify-between">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="p-3 flex justify-between">
                <span>{viewingInvoice.items?.[0]?.description || 'Recurring Subscription Service'}</span>
                <span className="font-bold">{formatCurrency(viewingInvoice.totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 border border-blue-100">
              <span className="font-bold text-slate-800">Total Due</span>
              <span className="text-base font-extrabold text-blue-600">{formatCurrency(viewingInvoice.totalAmount)}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold"
              >
                <Printer className="w-4 h-4" />
                Print Invoice
              </button>
              <button
                type="button"
                onClick={() => setViewingInvoice(null)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Quick Settle Modal */}
      {payingInvoice && (
        <Modal
          isOpen={!!payingInvoice}
          onClose={() => setPayingInvoice(null)}
          title={`Settle ${payingInvoice.invoiceNumber}`}
          description={`Customer: ${payingInvoice.customerName}`}
          size="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Mark this invoice of <strong>{formatCurrency(payingInvoice.totalAmount)}</strong> as Paid?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPayingInvoice(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSettlePayment}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-xs"
              >
                Confirm Paid
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
