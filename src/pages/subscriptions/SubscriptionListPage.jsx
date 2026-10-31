import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const SubscriptionListPage = () => {
  const { subscriptions, customers, plans, products, addSubscription, updateSubscription, cancelSubscription } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [viewingSub, setViewingSub] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    planId: plans[0]?.id || '',
    status: 'Active',
  });

  const handleOpenAdd = () => {
    setEditingSub(null);
    setFormData({
      customerId: customers[0]?.id || '',
      planId: plans[0]?.id || '',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setEditingSub(sub);
    setFormData({
      customerId: sub.customerId,
      planId: sub.planId,
      status: sub.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === formData.customerId) || customers[0];
    const pl = plans.find((p) => p.id === formData.planId) || plans[0];

    const payload = {
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      productId: pl.productId,
      productName: pl.productName || 'Software Package',
      planId: pl.id,
      planName: pl.name,
      interval: pl.interval || 'Monthly',
      unitPrice: pl.price,
      quantity: 1,
      totalAmount: pl.price,
      startDate: new Date().toISOString().split('T')[0],
      nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: formData.status,
    };

    if (editingSub) {
      updateSubscription(editingSub.id, payload);
    } else {
      addSubscription(payload);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      cancelSubscription(deletingId);
      setDeletingId(null);
    }
  };

  const filteredSubs = useMemo(() => {
    if (!searchQuery.trim()) return subscriptions;
    const lower = searchQuery.toLowerCase();
    return subscriptions.filter(
      (s) =>
        s.id.toLowerCase().includes(lower) ||
        s.customerName.toLowerCase().includes(lower) ||
        s.planName.toLowerCase().includes(lower) ||
        s.status.toLowerCase().includes(lower)
    );
  }, [subscriptions, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Subscriptions</h1>
          <p className="text-xs text-zinc-500 font-normal mt-0.5">Manage all subscriptions</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#f5b72e] hover:bg-[#eab308] text-zinc-900 font-medium text-xs shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Subscription</span>
        </button>
      </div>

      {/* Standalone Search Bar */}
      <div className="relative max-w-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search subscriptions..."
          className="w-full px-4 py-2.5 text-xs bg-white border border-[#faefbe] rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#f5b72e]/30 focus:border-[#f5b72e] shadow-xs transition-colors"
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-[#faefbe] shadow-xs overflow-hidden">
        {/* Subscriptions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#faefbe]/60 text-zinc-400 font-medium text-[11px]">
                <th className="px-6 py-4">Subscription</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#faefbe]/40 text-zinc-700">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#fef8db]/30 transition">
                  <td className="px-6 py-4 font-mono font-medium text-zinc-900">{sub.id}</td>
                  <td className="px-6 py-4 font-normal text-zinc-800">{sub.customerName}</td>
                  <td className="px-6 py-4 text-zinc-600">{sub.planName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium ${
                        sub.status === 'Active'
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : sub.status === 'Draft'
                          ? 'bg-[#fef3c7] text-[#b45309]'
                          : 'bg-[#fee2e2] text-[#b91c1c]'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingSub(sub)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-[#fef8db] transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(sub)}
                        className="p-1 rounded text-zinc-600 hover:text-zinc-900 hover:bg-[#fef8db] transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(sub.id)}
                        className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Cancel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
            Showing 1-{filteredSubs.length} of {filteredSubs.length} items
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

      {/* Add / Edit Subscription Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSub ? 'Edit Subscription' : 'New Subscription'}
        description="Assign a client to a recurring pricing tier."
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

          <Select
            label="Subscription Plan"
            required
            value={formData.planId}
            onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
            options={plans.map((p) => ({ value: p.id, label: `${p.name} - ₹${p.price} / ${p.interval}` }))}
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Draft', label: 'Draft' },
              { value: 'Closed', label: 'Closed' },
            ]}
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
              {editingSub ? 'Save Changes' : 'Confirm Subscription'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {viewingSub && (
        <Modal
          isOpen={!!viewingSub}
          onClose={() => setViewingSub(null)}
          title={`Subscription ${viewingSub.id}`}
          description={`Customer: ${viewingSub.customerName}`}
          size="sm"
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-[#fffdf5] border border-[#faefbe]">
              <span className="text-zinc-500">Plan:</span>
              <span className="font-semibold text-zinc-900">{viewingSub.planName}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[#fef3c7]/60 border border-[#fde68a]">
              <span className="text-zinc-600">Rate:</span>
              <span className="font-bold text-zinc-900">{formatCurrency(viewingSub.totalAmount)} / {viewingSub.interval}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[#fffdf5] border border-[#faefbe]">
              <span className="text-zinc-500">Next Renewal:</span>
              <span className="font-medium text-zinc-900">{formatDate(viewingSub.nextRenewalDate)}</span>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingSub(null)}
                className="px-4 py-1.5 rounded-full border border-zinc-200 text-zinc-700 font-medium text-xs hover:bg-[#fef8db]"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete/Cancel Confirmation */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Cancel Subscription?"
        message="Are you sure you want to cancel this subscription?"
        confirmText="Cancel Subscription"
      />
    </div>
  );
};
