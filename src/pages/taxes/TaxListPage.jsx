import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Percent, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useData } from '../../context/DataContext';

export const TaxListPage = () => {
  const { taxes, addTax, updateTax, deleteTax } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    rate: 18,
    type: 'Percentage',
    appliesTo: 'All Software Subscriptions',
    isDefault: false,
    status: 'Active',
    description: '',
  });

  const handleOpenAdd = () => {
    setEditingTax(null);
    setFormData({
      name: '',
      code: '',
      rate: 18,
      type: 'Percentage',
      appliesTo: 'All Software Subscriptions',
      isDefault: false,
      status: 'Active',
      description: 'Standard domestic tax bracket.',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tax) => {
    setEditingTax(tax);
    setFormData({
      name: tax.name,
      code: tax.code,
      rate: tax.rate,
      type: tax.type || 'Percentage',
      appliesTo: tax.appliesTo || 'All Products',
      isDefault: !!tax.isDefault,
      status: tax.status || 'Active',
      description: tax.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      code: formData.code.toUpperCase().trim(),
      rate: Number(formData.rate),
      type: formData.type,
      appliesTo: formData.appliesTo,
      isDefault: formData.isDefault,
      status: formData.status,
      description: formData.description,
    };

    if (editingTax) {
      updateTax(editingTax.id, payload);
    } else {
      addTax(payload);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteTax(deletingId);
      setDeletingId(null);
    }
  };

  const filteredTaxes = useMemo(() => {
    if (!searchQuery.trim()) return taxes || [];
    const lower = searchQuery.toLowerCase();
    return (taxes || []).filter(
      (t) =>
        t.name.toLowerCase().includes(lower) ||
        t.code.toLowerCase().includes(lower) ||
        t.appliesTo.toLowerCase().includes(lower)
    );
  }, [taxes, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header matching BrightLoop style */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Taxes</h1>
          <p className="text-xs text-zinc-500 font-normal mt-0.5">
            Manage tax rates and GST/VAT rules applied to recurring invoices
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#f5b72e] hover:bg-[#eab308] text-zinc-900 font-medium text-xs shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tax Rate</span>
        </button>
      </div>

      {/* Standalone Search Bar */}
      <div className="relative max-w-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tax rules by name or code..."
          className="w-full px-4 py-2.5 text-xs bg-white border border-[#faefbe] rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#f5b72e]/30 focus:border-[#f5b72e] shadow-xs transition-colors"
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-[#faefbe] shadow-xs overflow-hidden">
        {/* Taxes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#faefbe]/60 text-zinc-400 font-medium text-[11px]">
                <th className="px-6 py-4">Tax Name & Code</th>
                <th className="px-6 py-4">Rate (%)</th>
                <th className="px-6 py-4">Applies To</th>
                <th className="px-6 py-4">Default</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#faefbe]/40 text-zinc-700">
              {filteredTaxes.map((tax) => (
                <tr key={tax.id} className="hover:bg-[#fef8db]/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900">{tax.name}</div>
                    <div className="text-[11px] font-mono text-zinc-400">{tax.code}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-zinc-900 text-sm">
                    {tax.rate}%
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{tax.appliesTo}</td>
                  <td className="px-6 py-4">
                    {tax.isDefault ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#b45309] bg-[#fef3c7] px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Default
                      </span>
                    ) : (
                      <span className="text-zinc-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium ${
                        tax.status === 'Active'
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : 'bg-[#fee2e2] text-[#b91c1c]'
                      }`}
                    >
                      {tax.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(tax)}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-900 hover:bg-[#fef8db] transition"
                        title="Edit Tax Rule"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(tax.id)}
                        className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Delete Tax Rule"
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
            Showing 1-{filteredTaxes.length} of {filteredTaxes.length} items
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

      {/* Add / Edit Tax Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTax ? 'Edit Tax Rate' : 'Add Tax Rate'}
        description="Configure GST, VAT, or Sales Tax brackets for subscription billing."
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tax Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. GST (Goods & Services Tax)"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tax Code / Identifier"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g. GST-18"
            />

            <Input
              label="Tax Rate Percentage (%)"
              type="number"
              min="0"
              max="100"
              required
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
              placeholder="18"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Applies To"
              value={formData.appliesTo}
              onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value })}
              options={[
                { value: 'All Software Subscriptions', label: 'All Software Subscriptions' },
                { value: 'Select SMB Packages', label: 'Select SMB Packages' },
                { value: 'International Clients', label: 'International Clients' },
                { value: 'Consulting Services', label: 'Consulting Services' },
              ]}
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
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded border-[#faefbe] text-[#f5b72e] focus:ring-[#f5b72e]"
              />
              <span className="text-xs font-normal text-zinc-700">Set as default tax rate on new invoices</span>
            </label>
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
              {editingTax ? 'Save Changes' : 'Create Tax Rule'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Tax Rule?"
        message="Are you sure you want to delete this tax rate rule?"
        confirmText="Delete"
      />
    </div>
  );
};

