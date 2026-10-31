import React, { useState } from 'react';
import { Percent, Plus, Edit2, Trash2, Tag, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const DiscountListPage = () => {
  const { discounts, products, addDiscount, updateDiscount, deleteDiscount } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [deletingDiscountId, setDeletingDiscountId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'percentage', // percentage | fixed
    value: 15,
    minPurchaseAmount: 100,
    minQuantity: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 50,
    applicableProductId: 'ALL',
    status: 'Active',
    description: '',
  });

  const handleOpenAdd = () => {
    setEditingDiscount(null);
    setFormData({
      code: `SAVE${Math.floor(10 + Math.random() * 80)}`,
      name: 'Spring Promotional Campaign',
      type: 'percentage',
      value: 15,
      minPurchaseAmount: 100,
      minQuantity: 1,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      usageLimit: 50,
      applicableProductId: 'ALL',
      status: 'Active',
      description: 'Promotional discount applied at checkout or quotation generation.',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (disc) => {
    setEditingDiscount(disc);
    setFormData({
      code: disc.code,
      name: disc.name,
      type: disc.type,
      value: disc.value,
      minPurchaseAmount: disc.minPurchaseAmount || 0,
      minQuantity: disc.minQuantity || 1,
      startDate: disc.startDate || '',
      endDate: disc.endDate || '',
      usageLimit: disc.usageLimit || 100,
      applicableProductId: disc.applicableProductId || 'ALL',
      status: disc.status || 'Active',
      description: disc.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      code: formData.code.toUpperCase().trim(),
      name: formData.name,
      type: formData.type,
      value: Number(formData.value),
      minPurchaseAmount: Number(formData.minPurchaseAmount),
      minQuantity: Number(formData.minQuantity),
      startDate: formData.startDate,
      endDate: formData.endDate,
      usageLimit: Number(formData.usageLimit),
      applicableProductId: formData.applicableProductId,
      status: formData.status,
      description: formData.description,
    };

    if (editingDiscount) {
      updateDiscount(editingDiscount.id, payload);
    } else {
      addDiscount(payload);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingDiscountId) {
      deleteDiscount(deletingDiscountId);
      setDeletingDiscountId(null);
    }
  };

  const columns = [
    {
      key: 'code',
      header: 'Promo Code & Name',
      render: (code, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono font-bold text-slate-900 text-xs tracking-wider">{code}</div>
            <div className="text-[11px] text-slate-500">{row.name}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'value',
      header: 'Discount Benefit',
      render: (val, row) => (
        <span className="font-extrabold text-slate-900 text-xs bg-purple-50 text-purple-800 px-2.5 py-1 rounded-full border border-purple-200">
          {row.type === 'percentage' ? `${val}% OFF` : `${formatCurrency(val)} OFF`}
        </span>
      ),
    },
    {
      key: 'usage',
      header: 'Usage Quota',
      render: (_, row) => (
        <div>
          <span className="text-xs font-semibold text-slate-800">
            {row.usedCount || 0} / {row.usageLimit} redeemed
          </span>
          <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-purple-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, ((row.usedCount || 0) / (row.usageLimit || 1)) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'validity',
      header: 'Valid Window',
      render: (_, row) => (
        <span className="text-slate-500 text-xs">
          {formatDate(row.startDate)} → {formatDate(row.endDate)}
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
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition"
            title="Edit Coupon"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingDiscountId(row.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition"
            title="Delete Coupon"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discount Management"
        subtitle="Manage promotional discount codes, fixed and percentage savings, and volume incentive coupons."
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Discounts' },
        ]}
        actions={
          <Button variant="primary" size="md" leftIcon={Plus} onClick={handleOpenAdd}>
            Create Discount Code
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={discounts}
        searchPlaceholder="Search discount code, name or type..."
        searchKeys={['code', 'name', 'type', 'status']}
      />

      {/* Add / Edit Discount Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDiscount ? 'Edit Discount Code' : 'Create Discount Code'}
        description="Configure promo codes, threshold criteria, and redemption quotas."
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Promo Code"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. FLASH20"
            />

            <Input
              label="Campaign Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Early Bird Founders"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Discount Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'percentage', label: 'Percentage (%)' },
                { value: 'fixed', label: 'Fixed Dollar Amount ($)' },
              ]}
            />

            <Input
              label={formData.type === 'percentage' ? 'Percentage (e.g. 20%)' : 'Dollar Value (e.g. $50)'}
              type="number"
              min="1"
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min Purchase Amount ($)"
              type="number"
              value={formData.minPurchaseAmount}
              onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
              placeholder="0"
            />

            <Input
              label="Usage Limit (Quota)"
              type="number"
              min="1"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              placeholder="50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />

            <Input
              label="End Date (Expiry)"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <Select
            label="Applicable Product"
            value={formData.applicableProductId}
            onChange={(e) => setFormData({ ...formData, applicableProductId: e.target.value })}
            options={[
              { value: 'ALL', label: 'All Products & Plans' },
              ...products.map((p) => ({ value: p.id, label: p.name })),
            ]}
          />

          <Select
            label="Discount Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Active', label: 'Active (Available)' },
              { value: 'Inactive', label: 'Inactive (Disabled)' },
            ]}
          />

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingDiscount ? 'Save Coupon' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingDiscountId}
        onClose={() => setDeletingDiscountId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Discount Code?"
        message="Are you sure you want to delete this discount coupon? Existing subscriptions will keep their historical billing totals."
        confirmText="Delete Coupon"
      />
    </div>
  );
};

