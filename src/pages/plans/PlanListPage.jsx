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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Plans</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Create and manage subscription plans</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Main Table Card matching screenshot */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold text-[11px]">
                <th className="px-6 py-3.5">Plan Name</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Billing</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {plans.map((pl) => (
                <tr key={pl.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">{pl.name}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(pl.price)}</td>
                  <td className="px-6 py-4 text-slate-600 capitalize">{pl.billing || pl.interval || 'Monthly'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {pl.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(pl)}
                        className="p-1 rounded text-blue-600 hover:bg-blue-50 transition"
                        title="Edit Plan"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(pl.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 transition"
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
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>
            Showing 1-{plans.length} of {plans.length} items
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
