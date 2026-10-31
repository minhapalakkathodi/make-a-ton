import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  DollarSign,
  Printer,
  Zap,
} from 'lucide-react';
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
import { calculateTotals } from '../../utils/helpers';

export const QuotationListPage = () => {
  const {
    quotations,
    customers,
    products,
    plans,
    discounts,
    addQuotation,
    convertQuotationToSubscription,
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingQuote, setViewingQuote] = useState(null);
  const [convertingQuoteId, setConvertingQuoteId] = useState(null);
  const [conversionSuccessInfo, setConversionSuccessInfo] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    planId: plans[0]?.id || '',
    quantity: 1,
    discountCode: '',
    validityDays: 30,
    notes: 'Standard corporate quotation valid for 30 calendar days.',
  });

  const selectedPlan = plans.find((p) => p.id === formData.planId) || plans[0];
  const selectedCustomer = customers.find((c) => c.id === formData.customerId) || customers[0];
  const selectedDiscount = discounts.find((d) => d.code === formData.discountCode && d.status === 'Active');

  const pricing = calculateTotals({
    price: selectedPlan?.price || 0,
    quantity: formData.quantity,
    discountValue: selectedDiscount ? selectedDiscount.value : 0,
    discountType: selectedDiscount ? selectedDiscount.type : 'percentage',
    taxPercent: 10,
  });

  const handleOpenAdd = () => {
    setFormData({
      customerId: customers[0]?.id || '',
      planId: plans[0]?.id || '',
      quantity: 1,
      discountCode: '',
      validityDays: 30,
      notes: 'Custom sales proposal. Tier pricing guaranteed through the validity period.',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = products.find((p) => p.id === selectedPlan?.productId);
    const validUntilDate = new Date(Date.now() + formData.validityDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    addQuotation({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerEmail: selectedCustomer.email,
      productId: product?.id || 'PROD-001',
      productName: product?.name || 'Software Subscription',
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      quantity: Number(formData.quantity) || 1,
      unitPrice: selectedPlan.price,
      subtotal: pricing.subtotal,
      discountCode: formData.discountCode || null,
      discountAmount: pricing.discountAmount,
      taxPercent: 10,
      taxAmount: pricing.taxAmount,
      totalAmount: pricing.total,
      validUntil: validUntilDate,
      status: 'Pending',
      notes: formData.notes,
    });

    setIsModalOpen(false);
  };

  const handleConvertConfirm = () => {
    if (convertingQuoteId) {
      const createdSub = convertQuotationToSubscription(convertingQuoteId);
      setConvertingQuoteId(null);
      if (createdSub) {
        setConversionSuccessInfo(createdSub);
      }
    }
  };

  const columns = [
    {
      key: 'quotationNumber',
      header: 'Quotation #',
      render: (num, row) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs">{num}</span>
          <span className="block text-[10px] text-slate-400">Issued: {formatDate(row.issueDate)}</span>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Prospect / Client',
      render: (name, row) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs">{name}</span>
          <span className="block text-[11px] text-slate-500">{row.customerEmail}</span>
        </div>
      ),
    },
    {
      key: 'planName',
      header: 'Proposed Plan',
      render: (name, row) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs">{name}</span>
          <span className="block text-[11px] text-slate-500">Qty: {row.quantity} units</span>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total Value',
      render: (total) => <span className="font-bold text-slate-900 text-xs">{formatCurrency(total)}</span>,
    },
    {
      key: 'validUntil',
      header: 'Valid Until',
      render: (date) => (
        <span className="text-slate-600 text-xs font-medium flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {formatDate(date)}
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
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setViewingQuote(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Inspect Quotation"
          >
            <Eye className="w-4 h-4" />
          </button>

          {row.status !== 'Converted' ? (
            <Button
              variant="outline"
              size="sm"
              leftIcon={Zap}
              onClick={() => setConvertingQuoteId(row.id)}
              className="text-brand-600 border-brand-200 hover:bg-brand-50 text-[11px] py-1 px-2.5"
            >
              Convert to Sub
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Active Sub
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotation Management"
        subtitle="Generate pricing proposals, handle discounts, and seamlessly convert approved quotes into active subscriptions."
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Quotations' },
        ]}
        actions={
          <Button variant="primary" size="md" leftIcon={Plus} onClick={handleOpenAdd}>
            Draft Quotation
          </Button>
        }
      />

      {/* Success Notification Banner for Conversion */}
      {conversionSuccessInfo && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">
                Quotation converted successfully into Subscription {conversionSuccessInfo.id}!
              </p>
              <p className="text-emerald-700 mt-0.5">
                The customer commitment is now confirmed, and an initial recurring invoice has been automatically generated in Invoices.
              </p>
            </div>
          </div>
          <button
            onClick={() => setConversionSuccessInfo(null)}
            className="text-emerald-800 hover:text-emerald-950 font-bold px-3 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={quotations}
        searchPlaceholder="Search quotation by #, customer or plan..."
        searchKeys={['quotationNumber', 'customerName', 'planName', 'status']}
      />

      {/* Create Quotation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Draft New Quotation"
        description="Build a proposal with quantity, discounts, and validity duration."
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Select Prospect / Customer"
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              options={customers.map((c) => ({ value: c.id, label: `${c.name} (${c.email})` }))}
            />

            <Select
              label="Select Proposed Plan"
              required
              value={formData.planId}
              onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              options={plans.map((p) => ({
                value: p.id,
                label: `${p.name} - ₹${p.price} / ${p.interval}`,
              }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Quantity"
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
            />

            <Select
              label="Discount Code"
              value={formData.discountCode}
              onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
              options={[
                { value: '', label: 'No Discount' },
                ...discounts
                  .filter((d) => d.status === 'Active')
                  .map((d) => ({
                    value: d.code,
                    label: `${d.code} (${d.type === 'percentage' ? `${d.value}% off` : `$${d.value} off`})`,
                  })),
              ]}
            />

            <Select
              label="Quote Validity"
              value={formData.validityDays}
              onChange={(e) => setFormData({ ...formData, validityDays: Number(e.target.value) })}
              options={[
                { value: 14, label: '14 Days' },
                { value: 30, label: '30 Days (Standard)' },
                { value: 60, label: '60 Days' },
                { value: 90, label: '90 Days (Enterprise)' },
              ]}
            />
          </div>

          {/* Pricing Preview Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="font-semibold text-slate-800">Quotation Breakdown:</div>
            <div className="flex justify-between text-slate-600">
              <span>Unit Price:</span>
              <span>{formatCurrency(selectedPlan?.price)} × {formData.quantity}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(pricing.subtotal)}</span>
            </div>
            {pricing.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount Applied:</span>
                <span>-{formatCurrency(pricing.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Applicable Tax (10%):</span>
              <span>+{formatCurrency(pricing.taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
              <span>Grand Total:</span>
              <span className="text-brand-600">{formatCurrency(pricing.total)}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Proposal Remarks</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Generate Quotation
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Quotation Modal / Print View */}
      {viewingQuote && (
        <Modal
          isOpen={!!viewingQuote}
          onClose={() => setViewingQuote(null)}
          title={`Quotation ${viewingQuote.quotationNumber}`}
          description={`Customer: ${viewingQuote.customerName}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">Status</span>
                <Badge status={viewingQuote.status} size="md" className="mt-1" />
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Valid Until</span>
                <span className="font-bold text-slate-900 text-xs">{formatDate(viewingQuote.validUntil)}</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{viewingQuote.planName}</div>
                      <div className="text-[11px] text-slate-400">{viewingQuote.productName}</div>
                    </td>
                    <td className="p-3 text-center">{viewingQuote.quantity}</td>
                    <td className="p-3 text-right">{formatCurrency(viewingQuote.unitPrice)}</td>
                    <td className="p-3 text-right font-semibold">{formatCurrency(viewingQuote.subtotal)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-4 bg-slate-50/70 border-t border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(viewingQuote.subtotal)}</span>
                </div>
                {viewingQuote.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({viewingQuote.discountCode}):</span>
                    <span>-{formatCurrency(viewingQuote.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Tax ({viewingQuote.taxPercent}%):</span>
                  <span>+{formatCurrency(viewingQuote.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                  <span>Total Proposed:</span>
                  <span className="text-brand-600">{formatCurrency(viewingQuote.totalAmount)}</span>
                </div>
              </div>
            </div>

            {viewingQuote.status === 'Converted' ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  This quotation was successfully converted into confirmed subscription{' '}
                  <strong>{viewingQuote.convertedSubscriptionId}</strong>.
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-800 flex items-center justify-between">
                <span>Customer agreed to proposal terms? Convert into an active subscription:</span>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={Zap}
                  onClick={() => {
                    const id = viewingQuote.id;
                    setViewingQuote(null);
                    setConvertingQuoteId(id);
                  }}
                >
                  Convert Now
                </Button>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                <Printer className="w-4 h-4" />
                Print Quotation
              </button>
              <Button variant="outline" size="sm" onClick={() => setViewingQuote(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Convert to Subscription Confirmation Modal */}
      <ConfirmModal
        isOpen={!!convertingQuoteId}
        onClose={() => setConvertingQuoteId(null)}
        onConfirm={handleConvertConfirm}
        title="Convert Quotation to Subscription?"
        message="This action will officially accept the quotation, create a Confirmed recurring subscription in Subscriptions, and automatically generate the first billing invoice."
        confirmText="Confirm & Activate"
        variant="info"
      />
    </div>
  );
};

