import React, { useState } from 'react';
import { UserCog, Plus, Edit2, Trash2, Mail, Phone, ShieldCheck, Briefcase } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/formatters';

export const StaffManagementPage = () => {
  const { staff, addStaff, updateStaff, deleteStaff } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deletingStaffId, setDeletingStaffId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Billing Specialist',
    department: 'Finance & Operations',
    phone: '',
    status: 'Active',
  });

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      role: 'Billing Specialist',
      department: 'Finance & Operations',
      phone: '+1 (555) 789-0000',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
      phone: member.phone || '',
      status: member.status || 'Active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaff(editingStaff.id, formData);
    } else {
      addStaff(formData);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingStaffId) {
      deleteStaff(deletingStaffId);
      setDeletingStaffId(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Staff Member',
      render: (name, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-xs">{name}</div>
            <div className="text-[11px] text-slate-400">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role & Title',
      render: (role, row) => (
        <div>
          <span className="font-medium text-slate-800 text-xs block">{role}</span>
          <span className="text-[11px] text-slate-400">{row.department}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact',
      render: (phone) => <span className="text-slate-600 text-xs">{phone || '—'}</span>,
    },
    {
      key: 'joinedDate',
      header: 'Joined Date',
      render: (date) => <span className="text-slate-500 text-xs">{formatDate(date)}</span>,
    },
    {
      key: 'status',
      header: 'Account Status',
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
            title="Edit Staff Member"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingStaffId(row.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition"
            title="Remove Staff"
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
        title="Staff Account Management"
        subtitle="Provision and manage internal employee access credentials and operational permissions."
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Staff Accounts' },
        ]}
        actions={
          <Button variant="primary" size="md" leftIcon={Plus} onClick={handleOpenAdd}>
            Create Staff Account
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={staff}
        searchPlaceholder="Search staff by name, email or role..."
        searchKeys={['name', 'email', 'role', 'department']}
      />

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? 'Edit Staff Member' : 'Provision Staff Account'}
        description="Internal accounts can access quotation and billing queues but cannot alter global system settings."
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Maya Lin"
          />

          <Input
            label="Corporate Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@subflow.io"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'Billing Specialist', label: 'Billing Specialist' },
                { value: 'Customer Success Manager', label: 'Customer Success Manager' },
                { value: 'Sales Representative', label: 'Sales Representative' },
                { value: 'Operations Associate', label: 'Operations Associate' },
              ]}
            />

            <Select
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={[
                { value: 'Finance & Operations', label: 'Finance & Operations' },
                { value: 'Sales & Quotations', label: 'Sales & Quotations' },
                { value: 'Support & Success', label: 'Support & Success' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Direct Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 789-0000"
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive / Suspended' },
              ]}
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingStaff ? 'Save Changes' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingStaffId}
        onClose={() => setDeletingStaffId(null)}
        onConfirm={handleDeleteConfirm}
        title="Revoke Staff Account?"
        message="This staff account will be permanently deactivated. Their operational audit logs will be retained for compliance."
        confirmText="Revoke Account"
      />
    </div>
  );
};

