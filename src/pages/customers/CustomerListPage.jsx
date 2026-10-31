import React, { useState } from 'react';
import {
  Users,
  Eye,
  Plus,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Repeat,
  Receipt,
  CreditCard,
  Edit2
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const CustomerListPage = () => {
  const { customers, subscriptions, invoices, payments, addCustomer, updateCustomer } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    status: 'Active',
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      company: '',
      contactPerson: '',
      email: '',
      phone: '+1 (555) 000-0000',
      address: '100 Business Parkway',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      name: cust.name,
      company: cust.company || cust.name,
      contactPerson: cust.contactPerson || cust.name,
      email: cust.email,
      phone: cust.phone || '',
      address: cust.address || '',
      city: cust.city || '',
      state: cust.state || '',
      zip: cust.zip || '',
      status: cust.status || 'Active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      header: 'Customer & Company',
      render: (name, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-xs">{name}</div>
            <div className="text-[11px] text-slate-400">Contact: {row.contactPerson || name}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact Info',
      render: (email, row) => (
        <div>
          <span className="text-slate-800 text-xs font-medium flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            {email}
          </span>
          {row.phone && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-slate-400" />
              {row.phone}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (_, row) => (
        <span className="text-slate-600 text-xs">
          {row.city ? `${row.city}, ${row.state}` : 'Headquarters'}
        </span>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      render: (spent) => (
        <span className="font-bold text-slate-900 text-xs">
          {formatCurrency(spent || 0)}
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
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setViewingCustomer(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Customer 360 View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition"
            title="Edit Customer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Helper lists for Customer 360 view
  const custSubs = viewingCustomer ? subscriptions.filter((s) => s.customerId === viewingCustomer.id) : [];
  const custInvs = viewingCustomer ? invoices.filter((i) => i.customerId === viewingCustomer.id) : [];
  const custPays = viewingCustomer ? payments.filter((p) => p.customerId === viewingCustomer.id) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Directory"
        subtitle="Manage customer profiles, contact persons, linked subscriptions, and financial ledgers."
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Customers' },
        ]}
        actions={
          <Button variant="primary" size="md" leftIcon={Plus} onClick={handleOpenAdd}>
            Add Customer
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={customers}
        searchPlaceholder="Search customer by name, email or company..."
        searchKeys={['name', 'company', 'email', 'contactPerson']}
      />

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        description="Customer account details and official billing address."
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Company / Account Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Acme Corporation"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Contact Person Name"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="e.g. Sarah Jenkins"
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

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@company.com"
            />

            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 234-5678"
            />
          </div>

          <Input
            label="Street Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="100 Enterprise Way, Suite 400"
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="State / Region"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
            <Input
              label="Postal Code"
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingCustomer ? 'Save Customer' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Customer 360 View Modal */}
      {viewingCustomer && (
        <Modal
          isOpen={!!viewingCustomer}
          onClose={() => setViewingCustomer(null)}
          title={`Customer 360°: ${viewingCustomer.name}`}
          description={`Customer ID: ${viewingCustomer.id} • Joined: ${formatDate(viewingCustomer.createdDate)}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Header info card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Contact Person</span>
                <span className="font-bold text-slate-800">{viewingCustomer.contactPerson || viewingCustomer.name}</span>
                <span className="text-slate-500 block truncate mt-0.5">{viewingCustomer.email}</span>
                <span className="text-slate-500 block">{viewingCustomer.phone}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Billing Address</span>
                <span className="text-slate-700 block font-medium mt-0.5">{viewingCustomer.address || 'Standard Address'}</span>
                <span className="text-slate-500 block">
                  {viewingCustomer.city}, {viewingCustomer.state} {viewingCustomer.zip}
                </span>
              </div>

              <div className="sm:text-right">
                <span className="text-slate-400 block text-[10px]">Total Revenue Settled</span>
                <span className="text-lg font-extrabold text-emerald-700 block mt-0.5">
                  {formatCurrency(viewingCustomer.totalSpent || 0)}
                </span>
                <Badge status={viewingCustomer.status} size="sm" className="mt-1" />
              </div>
            </div>

            {/* Linked Subscriptions */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-brand-600" />
                Active & Recurring Subscriptions ({custSubs.length})
              </h4>
              {custSubs.length > 0 ? (
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                  {custSubs.map((sub) => (
                    <div key={sub.id} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{sub.planName}</span>
                        <span className="block text-slate-500 text-[11px]">
                          Qty: {sub.quantity} • Renewal: {formatDate(sub.nextRenewalDate)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-800">{formatCurrency(sub.totalAmount)}</span>
                        <div className="mt-0.5">
                          <Badge status={sub.status} size="sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No active subscriptions found.</p>
              )}
            </div>

            {/* Invoice & Payment History */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                Billing History ({custInvs.length} invoices)
              </h4>
              {custInvs.length > 0 ? (
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs max-h-48 overflow-y-auto">
                  {custInvs.map((inv) => (
                    <div key={inv.id} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-slate-800">{inv.invoiceNumber}</span>
                        <span className="block text-slate-500 text-[10px]">Due: {formatDate(inv.dueDate)}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">{formatCurrency(inv.totalAmount)}</span>
                        <div className="mt-0.5">
                          <Badge status={inv.status} size="sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No invoices recorded yet.</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingCustomer(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

