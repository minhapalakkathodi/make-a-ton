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
      {/* Top Header matching Template 4 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Invoices</h1>
          <p className="text-xs text-zinc-500 font-normal mt-0.5">View and manage invoices</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#f5b72e] hover:bg-[#eab308] text-zinc-900 font-medium text-xs shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Invoice</span>
        </button>
      </div>

      {/* Standalone Search Bar matching Template 4 */}
      <div className="relative max-w-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search invoices..."
          className="w-full px-4 py-2.5 text-xs bg-white border border-[#faefbe] rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#f5b72e]/30 focus:border-[#f5b72e] shadow-xs transition-colors"
        />
      </div>

      {/* Main Table Card matching Template 4 */}
      <div className="bg-white rounded-2xl border border-[#faefbe] shadow-xs overflow-hidden">
        {/* Invoices Table matching screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#faefbe]/60 text-zinc-400 font-medium text-[11px]">
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#faefbe]/40 text-zinc-700">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#fef8db]/30 transition">
                  <td className="px-6 py-4 font-mono font-medium text-zinc-900">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 font-normal text-zinc-800">{inv.customerName}</td>
                  <td className="px-6 py-4 font-semibold text-zinc-900">{formatCurrency(inv.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium ${
                        inv.status === 'Paid'
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : inv.status === 'Pending'
                          ? 'bg-[#fef3c7] text-[#b45309]'
                          : 'bg-[#fee2e2] text-[#b91c1c]'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{formatDate(inv.issueDate)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-[#fef8db] transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => setPayingInvoice(inv)}
                          className="px-2.5 py-1 rounded-full bg-[#fef8db] border border-[#faefbe] text-zinc-800 hover:bg-[#faefbe] font-medium text-[11px] transition"
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
        <div className="px-6 py-3.5 border-t border-[#faefbe]/60 flex items-center justify-between text-xs text-zinc-400 font-normal">
          <span>
            Showing 1-{filteredInvoices.length} of {filteredInvoices.length} items
          </span>
          <div className="flex items-center gap-1.5">
            <button className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-40" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="w-6 h-6 rounded bg-[#f5b72e] text-zinc-900 font-medium flex items-center justify-center text-[11px]">
              1
            </span>
            <button className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-40" disabled>
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

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#faefbe]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-full border border-zinc-200 text-zinc-600 text-xs font-medium hover:bg-[#fef8db]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#f5b72e] hover:bg-[#eab308] text-zinc-900 text-xs font-semibold shadow-xs"
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
            <div className="flex justify-between p-3.5 rounded-xl bg-[#fffdf5] border border-[#faefbe]">
              <div>
                <span className="text-zinc-400 block text-[10px]">Issued To</span>
                <span className="font-semibold text-zinc-900 text-sm">{viewingInvoice.customerName}</span>
                <span className="text-zinc-500 block">{viewingInvoice.customerEmail}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 block text-[10px]">Date Issued</span>
                <span className="font-medium text-zinc-900">{formatDate(viewingInvoice.issueDate)}</span>
                <span className="block text-zinc-500">Due: {formatDate(viewingInvoice.dueDate)}</span>
              </div>
            </div>

            <div className="border border-[#faefbe] rounded-xl overflow-hidden">
              <div className="p-3 bg-[#fef8db]/60 font-semibold border-b border-[#faefbe] flex justify-between text-zinc-800">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="p-3 flex justify-between text-zinc-700">
                <span>{viewingInvoice.items?.[0]?.description || 'Recurring Subscription Service'}</span>
                <span className="font-bold text-zinc-900">{formatCurrency(viewingInvoice.totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#fef3c7]/60 border border-[#fde68a]">
              <span className="font-medium text-zinc-900">Total Due</span>
              <span className="text-base font-bold text-zinc-900">{formatCurrency(viewingInvoice.totalAmount)}</span>
            </div>

            <div className="pt-3 border-t border-[#faefbe] flex items-center justify-between no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-zinc-900 font-medium"
              >
                <Printer className="w-4 h-4" />
                Print Invoice
              </button>
              <button
                type="button"
                onClick={() => setViewingInvoice(null)}
                className="px-4 py-1.5 rounded-full border border-zinc-200 text-zinc-700 font-medium hover:bg-[#fef8db]"
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
            <p className="text-zinc-600">
              Mark this invoice of <strong>{formatCurrency(payingInvoice.totalAmount)}</strong> as Paid?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#faefbe]">
              <button
                onClick={() => setPayingInvoice(null)}
                className="px-4 py-1.5 rounded-full border border-zinc-200 text-zinc-600 font-medium hover:bg-[#fef8db]"
              >
                Cancel
              </button>
              <button
                onClick={handleSettlePayment}
                className="px-4 py-1.5 rounded-full bg-[#f5b72e] hover:bg-[#eab308] text-zinc-900 font-semibold shadow-xs"
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
