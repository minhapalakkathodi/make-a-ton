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
      {/* Top Header matching screenshot */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Subscriptions</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage all subscriptions</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Subscription</span>
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
              placeholder="Search subscriptions..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Subscriptions Table matching screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold text-[11px]">
                <th className="px-6 py-3.5">Subscription</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Plan</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{sub.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{sub.customerName}</td>
                  <td className="px-6 py-4 text-slate-600">{sub.planName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        sub.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : sub.status === 'Draft'
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingSub(sub)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(sub)}
                        className="p-1 rounded text-blue-600 hover:bg-blue-50 transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(sub.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 transition"
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
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>
            Showing 1-{filteredSubs.length} of {filteredSubs.length} items
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
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Plan:</span>
              <span className="font-bold text-slate-900">{viewingSub.planName}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Rate:</span>
              <span className="font-bold text-blue-600">{formatCurrency(viewingSub.totalAmount)} / {viewingSub.interval}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Next Renewal:</span>
              <span className="font-semibold text-slate-800">{formatDate(viewingSub.nextRenewalDate)}</span>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingSub(null)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs"
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
