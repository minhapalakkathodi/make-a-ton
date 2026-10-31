import React, { useState } from 'react';
import { CreditCard, Plus, Eye, CheckCircle2, XCircle, ArrowUpRight, DollarSign, Calendar, FileText } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const PaymentListPage = () => {
  const { payments, invoices, recordPayment } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);

  // Unpaid or pending invoices
  const pendingInvoices = invoices.filter((i) => i.status !== 'Paid');

  // Form State
  const [formData, setFormData] = useState({
    invoiceId: pendingInvoices[0]?.id || '',
    amount: pendingInvoices[0]?.totalAmount || 0,
    paymentMethod: 'Credit Card (Visa)',
    transactionRef: `tx_live_${Math.floor(100000 + Math.random() * 900000)}`,
    paymentDate: new Date().toISOString().split('T')[0],
  });

  const handleOpenRecord = () => {
    const firstPending = pendingInvoices[0];
    setFormData({
      invoiceId: firstPending ? firstPending.id : '',
      amount: firstPending ? firstPending.totalAmount : 100,
      paymentMethod: 'Credit Card (Visa)',
      transactionRef: `tx_live_${Math.floor(100000 + Math.random() * 900000)}`,
      paymentDate: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleInvoiceChange = (invId) => {
    const inv = invoices.find((i) => i.id === invId);
    setFormData({
      ...formData,
      invoiceId: invId,
      amount: inv ? inv.totalAmount : 0,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inv = invoices.find((i) => i.id === formData.invoiceId);

    recordPayment({
      invoiceId: formData.invoiceId,
      invoiceNumber: inv ? inv.invoiceNumber : 'INV-MANUAL',
      customerId: inv ? inv.customerId : 'CUST-GENERAL',
      customerName: inv ? inv.customerName : 'General Customer',
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      transactionRef: formData.transactionRef,
      paymentDate: formData.paymentDate,
      recordedBy: 'Finance Officer',
    });

    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'id',
      header: 'Payment Ref',
      render: (id, row) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs">{id}</span>
          <span className="block text-[10px] text-slate-400">Ref: {row.transactionRef || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (name) => <span className="font-semibold text-slate-900 text-xs">{name}</span>,
    },
    {
      key: 'invoiceNumber',
      header: 'Related Invoice',
      render: (invNum) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold">
          <FileText className="w-3 h-3 text-slate-400" />
          {invNum}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount Paid',
      render: (amount) => (
        <span className="font-bold text-emerald-700 text-xs flex items-center gap-1">
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      render: (method) => (
        <span className="text-slate-600 text-xs font-medium flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
          {method}
        </span>
      ),
    },
    {
      key: 'paymentDate',
      header: 'Settled Date',
      render: (date) => <span className="text-slate-500 text-xs">{formatDate(date)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (status) => <Badge status={status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <button
          onClick={() => setViewingPayment(row)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          title="View Receipt"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Transactions"
        subtitle="Live payment records, transaction settlements, reconciliation, and payment logging."
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Payments' },
        ]}
        actions={
          <Button variant="primary" size="md" leftIcon={Plus} onClick={handleOpenRecord}>
            Record Payment
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={payments}
        searchPlaceholder="Search payments by ref, customer, or invoice..."
        searchKeys={['id', 'customerName', 'invoiceNumber', 'transactionRef', 'paymentMethod']}
      />

      {/* Record Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Payment"
        description="Log an incoming customer payment and settle the corresponding open invoice."
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Select Pending Invoice"
            required
            value={formData.invoiceId}
            onChange={(e) => handleInvoiceChange(e.target.value)}
            options={
              pendingInvoices.length > 0
                ? pendingInvoices.map((i) => ({
                    value: i.id,
                    label: `${i.invoiceNumber} — ${i.customerName} (₹${i.totalAmount}) [${i.status}]`,
                  }))
                : [{ value: '', label: 'No unpaid invoices found (all clear!)' }]
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Payment Amount (USD)"
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              leftIcon={DollarSign}
            />

            <Input
              label="Payment Date"
              type="date"
              required
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Payment Method"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              options={[
                { value: 'Credit Card (Visa)', label: 'Credit Card (Visa)' },
                { value: 'Credit Card (Mastercard)', label: 'Credit Card (Mastercard)' },
                { value: 'ACH Bank Wire', label: 'ACH Bank Wire' },
                { value: 'Stripe Portal', label: 'Stripe Payment Gateway' },
                { value: 'Direct Bank Transfer', label: 'Direct Bank Transfer' },
                { value: 'Cash / Cheque', label: 'Cash / Cheque' },
              ]}
            />

            <Input
              label="Transaction Reference / ID"
              value={formData.transactionRef}
              onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
              placeholder="e.g. tx_stripe_99210"
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Recording this transaction will automatically mark the selected invoice as Paid.</span>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!formData.invoiceId}>
              Confirm & Settle
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Payment Receipt Modal */}
      {viewingPayment && (
        <Modal
          isOpen={!!viewingPayment}
          onClose={() => setViewingPayment(null)}
          title={`Payment Receipt ${viewingPayment.id}`}
          description={`Customer: ${viewingPayment.customerName}`}
          size="sm"
        >
          <div className="space-y-4">
            <div className="text-center py-4 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Payment Verified</span>
              <div className="text-3xl font-extrabold text-emerald-700 mt-1">{formatCurrency(viewingPayment.amount)}</div>
              <span className="text-xs text-emerald-600 mt-0.5 block">{formatDate(viewingPayment.paymentDate)}</span>
            </div>

            <div className="space-y-2 text-xs border border-slate-200 rounded-xl p-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice:</span>
                <span className="font-mono font-bold text-slate-800">{viewingPayment.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Method:</span>
                <span className="font-medium text-slate-800">{viewingPayment.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction Ref:</span>
                <span className="font-mono text-slate-600">{viewingPayment.transactionRef || 'Internal'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recorded By:</span>
                <span className="text-slate-600">{viewingPayment.recordedBy || 'System Gateway'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingPayment(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

