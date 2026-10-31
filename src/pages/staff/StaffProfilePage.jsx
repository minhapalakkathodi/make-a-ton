import React from 'react';
import { User, Briefcase, Mail, Phone, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

export const StaffProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Profile"
        subtitle="Operational role credentials, department, and assigned queue metrics."
        breadcrumbs={[
          { label: 'Staff Hub', to: '/staff/dashboard' },
          { label: 'Profile' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 text-center p-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              currentUser?.name?.charAt(0) || 'S'
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 mt-4">{currentUser?.name}</h3>
          <p className="text-xs text-slate-500 font-medium">{currentUser?.title || 'Operations Specialist'}</p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
            <Badge status="Active" size="sm" />
            <span className="text-xs text-slate-400 capitalize">Role: {currentUser?.role}</span>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Staff Member Entitlements</CardTitle>
            <CardDescription>Daily operational permissions assigned to your role</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px]">Email Address</span>
                <span className="font-semibold text-slate-800">{currentUser?.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Department</span>
                <span className="font-semibold text-slate-800">Finance & Billing Operations</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2">Operational Responsibilities</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Review and generate customer quotations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Inspect subscription renewals and customer queues</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Log inbound payments and reconcile invoices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Follow up on overdue receivables</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

