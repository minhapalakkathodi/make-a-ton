import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle2, Zap, ArrowRight, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatInterval } from '../../utils/formatters';

export const BrowsePlansPage = () => {
  const { plans, products, addSubscription } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [intervalFilter, setIntervalFilter] = useState('ALL');
  const [subscribingPlan, setSubscribingPlan] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Filter plans
  const activePlans = plans.filter((p) => p.status === 'Active');
  const filteredPlans = activePlans.filter((p) => {
    if (intervalFilter === 'ALL') return true;
    return p.interval.toLowerCase() === intervalFilter.toLowerCase();
  });

  const handleConfirmSubscribe = (e) => {
    e.preventDefault();
    if (!subscribingPlan) return;

    const product = products.find((p) => p.id === subscribingPlan.productId);
    const today = new Date();
    const renewalDays = subscribingPlan.interval === 'yearly' ? 365 : subscribingPlan.interval === 'weekly' ? 7 : 30;
    const renewalDate = new Date(today.getTime() + renewalDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const subtotal = subscribingPlan.price * quantity;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    addSubscription({
      customerId: currentUser?.id || 'CUST-SELF',
      customerName: currentUser?.company || currentUser?.name || 'Customer Account',
      customerEmail: currentUser?.email || 'customer@company.com',
      productId: product?.id || 'PROD-001',
      productName: product?.name || 'Software Suite',
      planId: subscribingPlan.id,
      planName: subscribingPlan.name,
      interval: subscribingPlan.interval,
      unitPrice: subscribingPlan.price,
      quantity: Number(quantity),
      discountCode: null,
      discountAmount: 0,
      taxPercent: 10,
      taxAmount: tax,
      totalAmount: total,
      startDate: today.toISOString().split('T')[0],
      nextRenewalDate: renewalDate,
      status: 'Active',
      notes: 'Self-service subscription order placed via Customer Portal.',
    });

    setSubscribingPlan(null);
    navigate('/portal/subscriptions');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse Available Plans"
        subtitle="Explore software packages, scale seat tiers, and activate new recurring services."
        breadcrumbs={[
          { label: 'Customer Portal', to: '/portal/dashboard' },
          { label: 'Browse Plans' },
        ]}
      />

      {/* Interval Filter Pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Billing Frequency:
        </span>
        {['ALL', 'monthly', 'yearly', 'weekly', 'daily'].map((intvl) => (
          <button
            key={intvl}
            onClick={() => setIntervalFilter(intvl)}
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${
              intervalFilter === intvl
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {intvl === 'ALL' ? 'All Frequencies' : intvl}
          </button>
        ))}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          const product = products.find((p) => p.id === plan.productId);
          return (
            <Card key={plan.id} hover className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200/60">
                      {product?.category || 'SaaS'}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                      {formatInterval(plan.interval)}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-lg">{plan.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">{formatCurrency(plan.price)}</span>
                    <span className="text-xs text-slate-500 font-medium"> / {plan.interval}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Package Highlights
                    </span>
                    <ul className="space-y-2 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Includes {product?.name || 'Standard product features'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Automatic recurring renewals</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Min order: {plan.minQuantity || 1} license(s)</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-4">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full shadow-xs"
                  rightIcon={ArrowRight}
                  onClick={() => {
                    setQuantity(plan.minQuantity || 1);
                    setSubscribingPlan(plan);
                  }}
                >
                  Subscribe Now
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Subscribe Confirmation Modal */}
      {subscribingPlan && (
        <Modal
          isOpen={!!subscribingPlan}
          onClose={() => setSubscribingPlan(null)}
          title={`Subscribe to ${subscribingPlan.name}`}
          description={`Billed at ${formatCurrency(subscribingPlan.price)} / ${subscribingPlan.interval}`}
          size="sm"
        >
          <form onSubmit={handleConfirmSubscribe} className="space-y-4">
            <Input
              label="Select Number of Licenses / Seats"
              type="number"
              min={subscribingPlan.minQuantity || 1}
              required
              value={quantity}
              onChange={(e) => setQuantity(Math.max(subscribingPlan.minQuantity || 1, parseInt(e.target.value) || 1))}
            />

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Unit Price:</span>
                <span>{formatCurrency(subscribingPlan.price)} × {quantity}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (10%):</span>
                <span>+{formatCurrency(subscribingPlan.price * quantity * 0.1)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                <span>Estimated Total:</span>
                <span className="text-brand-600">{formatCurrency(subscribingPlan.price * quantity * 1.1)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSubscribingPlan(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={Zap}>
                Activate Subscription
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

