import React, { useState } from 'react';
import { Receipt, Eye, CreditCard, Printer, CheckCircle2, Zap } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const MyInvoicesPage = () => {
  const { invoices, recordPayment } = useData();
  const { currentUser } = useAuth();

  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [payingInvoice, setPayingInvoice] = useState(null);

  const myInvoices = invoices.filter(
    (i) => i.customerId === currentUser?.id || i.customerEmail === currentUser?.email || i.customerName?.includes('Acme')
  );

  const handlePay = (e) => {
    e.preventDefault();
    if (!payingInvoice) return;

    recordPayment({
      invoiceId: payingInvoice.id,
      invoiceNumber: payingInvoice.invoiceNumber,
      customerId: payingInvoice.customerId,
      customerName: payingInvoice.customerName,
      amount: payingInvoice.totalAmount,
      paymentMethod: 'Credit Card (Customer Portal)',
      transactionRef: `tx_portal_${Date.now().toString().slice(-6)}`,
      recordedBy: 'Customer Portal',
    });

    setPayingInvoice(null);
    setViewingInvoice(null);
  };

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      render: (num) => <span className="font-mono font-bold text-slate-900 text-xs">{num}</span>,
    },
    {
      key: 'issueDate',
      header: 'Billing Date',
      render: (date) => <span className="text-slate-600 text-xs">{formatDate(date)}</span>,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (date, row) => (
        <span className={`text-xs font-medium ${row.status === 'Overdue' ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
          {formatDate(date)}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Amount Due',
      render: (amt) => <span className="font-bold text-slate-900 text-xs">{formatCurrency(amt)}</span>,
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
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setViewingInvoice(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Inspect Invoice"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status !== 'Paid' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={CreditCard}
              onClick={() => setPayingInvoice(row)}
              className="text-[11px] py-1 px-2.5"
            >
              Pay Now
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Invoices & Statements"
        subtitle="Review itemized billing receipts, tax breakdown, and clear open payments."
        breadcrumbs={[
          { label: 'Customer Portal', to: '/portal/dashboard' },
          { label: 'My Invoices' },
        ]}
      />

      <DataTable
        columns={columns}
        data={myInvoices}
        searchPlaceholder="Search invoices by # or date..."
        searchKeys={['invoiceNumber', 'status']}
        emptyTitle="No invoices found"
        emptyDescription="You currently have no billing records or receipts."
      />

      {/* Invoice Viewer Modal */}
      {viewingInvoice && (
        <Modal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          title={`Invoice ${viewingInvoice.invoiceNumber}`}
          description={`Issued: ${formatDate(viewingInvoice.issueDate)} • Due: ${formatDate(viewingInvoice.dueDate)}`}
          size="lg"
        >
          <div id="printable-section" className="space-y-6">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-brand-600 font-extrabold text-lg">
                  <Zap className="w-5 h-5 fill-current" />
                  <span>SubFlow Enterprise</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">100 Tech Plaza, San Francisco, CA</p>
              </div>

              <div className="text-right">
                <span className="text-lg font-mono font-bold text-slate-900">{viewingInvoice.invoiceNumber}</span>
                <div className="mt-1">
                  <Badge status={viewingInvoice.status} size="md" />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {viewingInvoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-slate-800">{item.description}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="p-3 text-right font-semibold">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-4 bg-slate-50/70 border-t border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(viewingInvoice.subtotal)}</span>
                </div>
                {viewingInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount:</span>
                    <span>-{formatCurrency(viewingInvoice.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Tax ({viewingInvoice.taxPercent}%):</span>
                  <span>+{formatCurrency(viewingInvoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-brand-600">{formatCurrency(viewingInvoice.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                <Printer className="w-4 h-4" />
                Print Receipt
              </button>
              <div className="flex items-center gap-2">
                {viewingInvoice.status !== 'Paid' && (
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={CreditCard}
                    onClick={() => setPayingInvoice(viewingInvoice)}
                  >
                    Pay Balance
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setViewingInvoice(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Quick Pay Modal */}
      {payingInvoice && (
        <Modal
          isOpen={!!payingInvoice}
          onClose={() => setPayingInvoice(null)}
          title="Instant Payment"
          description={`Settling invoice ${payingInvoice.invoiceNumber}`}
          size="sm"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-mono font-bold text-slate-800">{payingInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Due:</span>
                <span className="text-base font-extrabold text-slate-900">{formatCurrency(payingInvoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Card on File:</span>
                <span className="font-medium text-slate-700">Visa ending in •••• 4242</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setPayingInvoice(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handlePay} leftIcon={CheckCircle2}>
                Confirm Payment ({formatCurrency(payingInvoice.totalAmount)})
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

