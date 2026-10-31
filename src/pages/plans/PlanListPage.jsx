import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';

export const PlanListPage = () => {
  const { plans, products, addPlan, updatePlan, deletePlan } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Basic',
    productId: products[0]?.id || '',
    price: 500,
    billing: 'Monthly',
    status: 'Active',
  });

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      productId: products[0]?.id || '',
      price: 500,
      billing: 'Monthly',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      productId: plan.productId,
      price: plan.price,
      billing: plan.billing || plan.interval || 'Monthly',
      status: plan.status || 'Active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      productId: formData.productId,
      price: Number(formData.price),
      billing: formData.billing,
      interval: formData.billing,
      status: formData.status,
    };

    if (editingPlan) {
      updatePlan(editingPlan.id, payload);
    } else {
      addPlan(payload);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deletePlan(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header matching screenshot */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Plans</h1>
          <p className="text-xs text-zinc-500 font-normal mt-0.5">Create and manage subscription plans</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#f5b72e] hover:bg-[#eab308] text-zinc-900 font-medium text-xs shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Main Table Card matching screenshot */}
      <div className="bg-white rounded-2xl border border-[#faefbe] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#faefbe]/60 text-zinc-400 font-medium text-[11px]">
                <th className="px-6 py-4">Plan Name</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Billing</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#faefbe]/40 text-zinc-700">
              {plans.map((pl) => (
                <tr key={pl.id} className="hover:bg-[#fef8db]/30 transition">
                  <td className="px-6 py-4 font-medium text-zinc-900">{pl.name}</td>
                  <td className="px-6 py-4 font-semibold text-zinc-900">{formatCurrency(pl.price)}</td>
                  <td className="px-6 py-4 text-zinc-600 capitalize">{pl.billing || pl.interval || 'Monthly'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#dcfce7] text-[#15803d]">
                      {pl.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(pl)}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-900 hover:bg-[#fef8db] transition"
                        title="Edit Plan"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(pl.id)}
                        className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Delete Plan"
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
            Showing 1-{plans.length} of {plans.length} items
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

      {/* Add / Edit Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? 'Edit Plan' : 'Create Subscription Plan'}
        description="Configure tier name, pricing, and recurring interval."
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Plan Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Basic, Premium, Enterprise"
          />

          <Select
            label="Associated Product"
            required
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            options={products.map((p) => ({ value: p.id, label: p.name }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price (INR ₹)"
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />

            <Select
              label="Billing Interval"
              value={formData.billing}
              onChange={(e) => setFormData({ ...formData, billing: e.target.value })}
              options={[
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Yearly', label: 'Yearly' },
                { value: 'Weekly', label: 'Weekly' },
                { value: 'Daily', label: 'Daily' },
              ]}
            />
          </div>

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
              {editingPlan ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Plan?"
        message="Are you sure you want to remove this subscription plan?"
        confirmText="Delete"
      />
    </div>
  );
};
