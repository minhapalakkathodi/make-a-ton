import React, { useState } from 'react';
import { Settings, Save, RefreshCw, CheckCircle2, Building, DollarSign, Bell, Shield } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useData } from '../../context/DataContext';

export const SettingsPage = () => {
  const { resetToDefaults } = useData();

  const [companyName, setCompanyName] = useState('BrightLoop Technologies Inc.');
  const [supportEmail, setSupportEmail] = useState('support@brightloop.io');
  const [currency, setCurrency] = useState('INR');
  const [defaultTax, setDefaultTax] = useState(10);
  const [autoRenewNotify, setAutoRenewNotify] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);
  const [resetMessage, setResetMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all mock data back to sample hackathon defaults? This will restore initial products, subscriptions, and invoices.')) {
      resetToDefaults();
      setResetMessage(true);
      setTimeout(() => setResetMessage(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        subtitle="Configure organization metadata, default tax rates, currency, and demo environment."
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Settings' },
        ]}
      />

      {savedMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Settings saved successfully!
        </div>
      )}

      {resetMessage && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          Demo data reset to default seed records!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Company & Billing Identity</CardTitle>
            <CardDescription>Appears on generated PDF receipts, invoices, and quotations</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                leftIcon={Building}
              />

              <Input
                label="Support & Billing Email"
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Currency & Tax Defaults */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Defaults</CardTitle>
            <CardDescription>Default currency symbol and automated sales tax calculations</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Primary Business Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={[
                  { value: 'USD', label: 'USD ($) — United States Dollar' },
                  { value: 'EUR', label: 'EUR (€) — Euro' },
                  { value: 'GBP', label: 'GBP (£) — British Pound' },
                  { value: 'INR', label: 'INR (₹) — Indian Rupee' },
                ]}
              />

              <Input
                label="Default Tax Percentage (%)"
                type="number"
                min="0"
                max="50"
                value={defaultTax}
                onChange={(e) => setDefaultTax(e.target.value)}
                hint="Applied to quotations and recurring subscription renewals."
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRenewNotify}
                  onChange={(e) => setAutoRenewNotify(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Dispatch email notifications to customers 7 days before automated renewal
                </span>
              </label>
            </div>
          </CardContent>

          <CardFooter>
            <span className="text-xs text-slate-500">Changes persist in local browser store</span>
            <Button type="submit" variant="primary" size="sm" leftIcon={Save}>
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Demo Reset Card for Hackathon */}
      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900">Demo Reset Controls</CardTitle>
          <CardDescription>
            Helpful during hackathon evaluation to reset all modified products, subscriptions, and payments back to the initial sample data state.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Clear your browser&apos;s localStorage session and restore pristine sample mock data.
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={RefreshCw}
              onClick={handleReset}
              className="text-rose-600 border-rose-300 hover:bg-rose-50 shrink-0"
            >
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

