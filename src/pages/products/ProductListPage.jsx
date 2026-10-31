import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';

export const ProductListPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Software',
    price: 2000,
    status: 'Active',
    description: '',
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      type: 'Software',
      price: 2000,
      status: 'Active',
      description: 'Business software product.',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      type: prod.type || prod.category || 'Software',
      price: prod.price || 2000,
      status: prod.status || 'Active',
      description: prod.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      type: formData.type,
      category: formData.type,
      price: Number(formData.price),
      status: formData.status,
      description: formData.description,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteProduct(deletingId);
      setDeletingId(null);
    }
  };

  // Filter products by search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const lower = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.type && p.type.toLowerCase().includes(lower)) ||
        (p.category && p.category.toLowerCase().includes(lower))
    );
  }, [products, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header matching screenshot */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Products</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage your products here</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
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
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Products Table matching screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold text-[11px]">
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">{p.name}</td>
                  <td className="px-6 py-4 text-slate-600">{p.type || p.category || 'Software'}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(p.price || 2000)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        p.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1 rounded text-blue-600 hover:bg-blue-50 transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(p.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 transition"
                        title="Delete"
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
            Showing 1-{filteredProducts.length} of {filteredProducts.length} items
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

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        description="Configure product name, type, price, and commercial status."
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. CRM Software"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Product Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'Software', label: 'Software' },
                { value: 'Service', label: 'Service' },
                { value: 'Hardware', label: 'Hardware' },
              ]}
            />

            <Input
              label="Standard Price (INR ₹)"
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="2000"
            />
          </div>

          <Select
            label="Product Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
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
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product?"
        message="Are you sure you want to remove this product from the catalog?"
        confirmText="Delete"
      />
    </div>
  );
};
