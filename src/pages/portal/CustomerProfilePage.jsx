import React, { useState } from 'react';
import { User, Building, Mail, Phone, MapPin, Save, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';

export const CustomerProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Sarah Jenkins',
    email: currentUser?.email || 'sarah.jenkins@acme.corp',
    company: currentUser?.company || 'Acme Corporation',
    phone: '+1 (555) 234-5678',
    address: '100 Enterprise Way, Suite 400',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      company: formData.company,
      email: formData.email,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile & Billing Address"
        subtitle="Manage your contact person information and official company address."
        breadcrumbs={[
          { label: 'Customer Portal', to: '/portal/dashboard' },
          { label: 'Profile' },
        ]}
      />

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your contact details as an authorized account executive</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                leftIcon={User}
              />

              <Input
                label="Company / Enterprise Name"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                leftIcon={Building}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Work Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                leftIcon={Mail}
              />

              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                leftIcon={Phone}
              />
            </div>

            <Input
              label="Street Billing Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              leftIcon={MapPin}
            />

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                label="State / Province"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
              <Input
                label="Postal Code"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              />
            </div>
          </CardContent>

          <CardFooter>
            <span className="text-xs text-slate-500">Stored safely in client session</span>
            <Button type="submit" variant="primary" size="sm" leftIcon={Save}>
              Save Profile
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

