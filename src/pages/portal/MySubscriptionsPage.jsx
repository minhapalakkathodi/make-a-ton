import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Repeat, Calendar, ArrowRight, ShoppingBag, Eye, XCircle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate, formatInterval } from '../../utils/formatters';

export const MySubscriptionsPage = () => {
  const { subscriptions, cancelSubscription } = useData();
  const { currentUser } = useAuth();

  const [viewingSub, setViewingSub] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  // Filter subscriptions for logged in customer
  const mySubscriptions = subscriptions.filter(
    (s) => s.customerId === currentUser?.id || s.customerEmail === currentUser?.email || s.customerName?.includes('Acme')
  );

  const handleCancelConfirm = () => {
    if (cancelingId) {
      cancelSubscription(cancelingId);
      setCancelingId(null);
    }
  };

  const columns = [
    {
      key: 'planName',
      header: 'Subscription Plan',
      render: (name, row) => (
        <div>
          <span className="font-bold text-slate-900 text-xs">{name}</span>
          <span className="block text-[11px] text-slate-500">{row.productName}</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Seats / Licenses',
      render: (qty) => <span className="font-semibold text-slate-700 text-xs">{qty} user seat(s)</span>,
    },
    {
      key: 'totalAmount',
      header: 'Recurring Charge',
      render: (amt, row) => (
        <div>
          <span className="font-bold text-slate-900 text-xs">{formatCurrency(amt)}</span>
          <span className="block text-[10px] text-slate-400 capitalize">per {row.interval}</span>
        </div>
      ),
    },
    {
      key: 'nextRenewalDate',
      header: 'Next Renewal Date',
      render: (date) => (
        <span className="text-slate-700 text-xs font-medium flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-brand-600" />
          {formatDate(date)}
        </span>
      ),
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
            onClick={() => setViewingSub(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status !== 'Closed' && (
            <button
              onClick={() => setCancelingId(row.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition"
              title="Request Cancellation"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Subscriptions"
        subtitle="Manage active licenses, upcoming renewal dates, and subscription settings."
        breadcrumbs={[
          { label: 'Customer Portal', to: '/portal/dashboard' },
          { label: 'My Subscriptions' },
        ]}
        actions={
          <Link to="/portal/plans">
            <Button variant="primary" size="md" leftIcon={ShoppingBag}>
              Browse More Plans
            </Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={mySubscriptions}
        searchPlaceholder="Search my subscriptions..."
        searchKeys={['planName', 'productName', 'status']}
        emptyTitle="No subscriptions active"
        emptyDescription="You haven't subscribed to any plans yet. Browse our plans to get started."
      />

      {/* Details Modal */}
      {viewingSub && (
        <Modal
          isOpen={!!viewingSub}
          onClose={() => setViewingSub(null)}
          title={viewingSub.planName}
          description={`Subscription ID: ${viewingSub.id}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Current Status:</span>
              <Badge status={viewingSub.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px]">Product</span>
                <span className="font-bold text-slate-800">{viewingSub.productName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Licensed Quantity</span>
                <span className="font-bold text-slate-800">{viewingSub.quantity} seats</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Billing Frequency</span>
                <span className="font-bold text-slate-800 capitalize">{viewingSub.interval}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Next Scheduled Renewal</span>
                <span className="font-bold text-brand-600">{formatDate(viewingSub.nextRenewalDate)}</span>
              </div>
            </div>

            <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Total Recurring Cost</span>
                <span className="text-[11px] text-slate-500">Includes all applicable taxes</span>
              </div>
              <span className="text-lg font-extrabold text-brand-700">{formatCurrency(viewingSub.totalAmount)}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingSub(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation */}
      <ConfirmModal
        isOpen={!!cancelingId}
        onClose={() => setCancelingId(null)}
        onConfirm={handleCancelConfirm}
        title="Cancel Subscription?"
        message="Are you sure you want to stop renewal for this subscription? Your access will continue through the end of the current billing cycle."
        confirmText="Confirm Cancellation"
      />
    </div>
  );
};

