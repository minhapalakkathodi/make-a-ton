import React from 'react';
import { History, CreditCard, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const MyPaymentsPage = () => {
  const { payments } = useData();
  const { currentUser } = useAuth();

  const myPayments = payments.filter(
    (p) => p.customerId === currentUser?.id || p.customerName?.includes('Acme')
  );

  const columns = [
    {
      key: 'id',
      header: 'Payment ID',
      render: (id, row) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs">{id}</span>
          <span className="block text-[10px] text-slate-400">Ref: {row.transactionRef}</span>
        </div>
      ),
    },
    {
      key: 'invoiceNumber',
      header: 'Invoice Paid',
      render: (inv) => <span className="font-mono font-semibold text-slate-800 text-xs">{inv}</span>,
    },
    {
      key: 'amount',
      header: 'Amount Paid',
      render: (amt) => (
        <span className="font-bold text-emerald-700 text-xs flex items-center gap-1">
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
          {formatCurrency(amt)}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Method',
      render: (m) => <span className="text-slate-600 text-xs font-medium">{m}</span>,
    },
    {
      key: 'paymentDate',
      header: 'Date',
      render: (d) => <span className="text-slate-500 text-xs">{formatDate(d)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => <Badge status={s} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment History"
        subtitle="Receipts and confirmed settlements for your organization."
        breadcrumbs={[
          { label: 'Customer Portal', to: '/portal/dashboard' },
          { label: 'Payment History' },
        ]}
      />

      <DataTable
        columns={columns}
        data={myPayments}
        searchPlaceholder="Search payment transactions..."
        searchKeys={['id', 'invoiceNumber', 'transactionRef', 'paymentMethod']}
        emptyTitle="No payments found"
        emptyDescription="You haven't made any payments yet."
      />
    </div>
  );
};

