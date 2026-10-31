import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatInterval } from '../../utils/formatters';

export const PlanListPage = () => {
  const { plans, products, addPlan, updatePlan, deletePlan } = useData();

  // View mode: 'grid' (box wise) as default, with 'table' alternative
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [intervalFilter, setIntervalFilter] = useState('ALL');

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
    description: '',
  });

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      productId: products[0]?.id || '',
      price: 500,
      billing: 'Monthly',
      status: 'Active',
      description: 'Standard recurring subscription plan.',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      productId: plan.productId || products[0]?.id || '',
      price: plan.price,
      billing: plan.billing || plan.interval || 'Monthly',
      status: plan.status || 'Active',
      description: plan.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === formData.productId);
    const payload = {
      name: formData.name,
      productId: formData.productId,
      productName: prod?.name || 'Software',
      price: Number(formData.price),
      billing: formData.billing,
      interval: formData.billing,
      status: formData.status,
      description: formData.description,
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

  // Filter plans
  const filteredPlans = useMemo(() => {
    return plans.filter((pl) => {
      const matchSearch =
        !searchQuery.trim() ||
        pl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pl.productName && pl.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pl.interval && pl.interval.toLowerCase().includes(searchQuery.toLowerCase()));

      const intervalStr = (pl.billing || pl.interval || '').toLowerCase();
      const matchInterval =
        intervalFilter === 'ALL' || intervalStr === intervalFilter.toLowerCase();

      return matchSearch && matchInterval;
    });
  }, [plans, searchQuery, intervalFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Plans</h1>
          <p className="text-xs text-zinc-500 font-normal mt-0.5">
            Create and manage subscription plans
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle (Grid/Boxes vs Table) */}
          <div className="flex items-center p-1 rounded-full bg-[#fef8db] border border-[#faefbe]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#f5b72e] text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Box / Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#f5b72e] text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#f5b72e] hover:bg-[#eab308] text-zinc-900 font-medium text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by name, interval..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#faefbe] rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#f5b72e]/30 focus:border-[#f5b72e] shadow-xs transition-colors"
          />
        </div>

        {/* Frequency Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Monthly', 'Yearly', 'Weekly', 'Daily'].map((intvl) => (
            <button
              key={intvl}
              onClick={() => setIntervalFilter(intvl)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                intervalFilter === intvl
                  ? 'bg-[#f5b72e] text-zinc-900 shadow-xs'
                  : 'bg-white text-zinc-600 border border-[#faefbe] hover:bg-[#fef8db]/60'
              }`}
            >
              {intvl === 'ALL' ? 'All Frequencies' : intvl}
            </button>
          ))}
        </div>
      </div>

      {/* BOX-WISE (GRID) VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            const product =
              products.find((p) => p.id === plan.productId) || {
                name: plan.productName || 'Software Service',
              };

            const isHighTier =
              plan.name.toLowerCase().includes('enterprise') ||
              plan.name.toLowerCase().includes('pro') ||
              plan.name.toLowerCase().includes('unlimited');

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 border shadow-xs transition-all duration-200 flex flex-col justify-between group relative ${
                  isHighTier
                    ? 'bg-gradient-to-b from-[#fffdf5] to-[#fef8db]/40 border-[#fde68a] hover:border-[#f5b72e] hover:shadow-sm'
                    : 'bg-white border-[#faefbe] hover:border-[#fde68a] hover:bg-[#fffdf5] hover:shadow-sm'
                }`}
              >
                {/* Top Badge Row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#fef8db] border border-[#faefbe] text-zinc-800">
                      {product.name}
                    </span>

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#dcfce7] text-[#15803d]">
                      {plan.status || 'Active'}
                    </span>
                  </div>

                  {/* Plan Name & Highlights */}
                  <h3 className="text-lg font-bold text-zinc-900 group-hover:text-zinc-950 transition">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-normal mt-1 line-clamp-2 leading-relaxed">
                    {plan.description ||
                      `${formatInterval(plan.billing || plan.interval)} recurring subscription plan for ${product.name}.`}
                  </p>

                  {/* Price Block */}
                  <div className="mt-4 pt-4 border-t border-[#faefbe]/60 flex items-baseline">
                    <span className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium ml-1.5">
                      / {formatInterval(plan.billing || plan.interval)}
                    </span>
                  </div>

                  {/* Feature Highlights */}
                  <div className="mt-4 space-y-2 text-xs text-zinc-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Includes {product.name} license</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Recurring {formatInterval(plan.billing || plan.interval).toLowerCase()} billing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Instant self-service activation</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-5 mt-5 border-t border-[#faefbe]/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400">
                    ID: {plan.id}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(plan)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#fef8db] border border-[#faefbe] text-zinc-800 hover:bg-[#faefbe] text-xs font-medium transition active:scale-95 cursor-pointer"
                      title="Edit Plan"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeletingId(plan.id)}
                      className="p-1.5 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition active:scale-95 cursor-pointer"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW (ALTERNATIVE) */}
      {viewMode === 'table' && (
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
                {filteredPlans.map((pl) => (
                  <tr key={pl.id} className="hover:bg-[#fef8db]/30 transition">
                    <td className="px-6 py-4 font-medium text-zinc-900">{pl.name}</td>
                    <td className="px-6 py-4 font-semibold text-zinc-900">{formatCurrency(pl.price)}</td>
                    <td className="px-6 py-4 text-zinc-600 capitalize">
                      {pl.billing || pl.interval || 'Monthly'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#dcfce7] text-[#15803d]">
                        {pl.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(pl)}
                          className="p-1 rounded text-zinc-500 hover:text-zinc-900 hover:bg-[#fef8db] transition cursor-pointer"
                          title="Edit Plan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(pl.id)}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
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

          <div className="px-6 py-3.5 border-t border-[#faefbe]/60 flex items-center justify-between text-xs text-zinc-400 font-normal">
            <span>
              Showing 1-{filteredPlans.length} of {filteredPlans.length} items
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
      )}

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
            placeholder="e.g. Starter, Pro, Enterprise"
          />

          <Select
            label="Associated Product"
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

          <Input
            label="Plan Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g. Full-featured enterprise suite with priority SLA."
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
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
