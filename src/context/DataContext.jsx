import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialCustomers } from '../data/mockCustomers';
import { initialProducts, initialPlans } from '../data/mockProducts';
import { initialDiscounts } from '../data/mockDiscounts';
import { initialSubscriptions } from '../data/mockSubscriptions';
import { initialQuotations } from '../data/mockQuotations';
import { initialInvoices } from '../data/mockInvoices';
import { initialPayments } from '../data/mockPayments';
import { initialStaff } from '../data/mockStaff';
import { initialTaxes } from '../data/mockTaxes';
import { storage, getMonthlyEquivalent, generateId } from '../utils/helpers';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [customers, setCustomers] = useState(() => storage.get('subflow_customers', initialCustomers));
  const [products, setProducts] = useState(() => storage.get('subflow_products', initialProducts));
  const [plans, setPlans] = useState(() => storage.get('subflow_plans', initialPlans));
  const [discounts, setDiscounts] = useState(() => storage.get('subflow_discounts', initialDiscounts));
  const [taxes, setTaxes] = useState(() => storage.get('subflow_taxes', initialTaxes));
  const [subscriptions, setSubscriptions] = useState(() => storage.get('subflow_subscriptions', initialSubscriptions));
  const [quotations, setQuotations] = useState(() => storage.get('subflow_quotations', initialQuotations));
  const [invoices, setInvoices] = useState(() => storage.get('subflow_invoices', initialInvoices));
  const [payments, setPayments] = useState(() => storage.get('subflow_payments', initialPayments));
  const [staff, setStaff] = useState(() => storage.get('subflow_staff', initialStaff));

  // Sync to localStorage
  useEffect(() => { storage.set('subflow_customers', customers); }, [customers]);
  useEffect(() => { storage.set('subflow_products', products); }, [products]);
  useEffect(() => { storage.set('subflow_plans', plans); }, [plans]);
  useEffect(() => { storage.set('subflow_discounts', discounts); }, [discounts]);
  useEffect(() => { storage.set('subflow_taxes', taxes); }, [taxes]);
  useEffect(() => { storage.set('subflow_subscriptions', subscriptions); }, [subscriptions]);
  useEffect(() => { storage.set('subflow_quotations', quotations); }, [quotations]);
  useEffect(() => { storage.set('subflow_invoices', invoices); }, [invoices]);
  useEffect(() => { storage.set('subflow_payments', payments); }, [payments]);
  useEffect(() => { storage.set('subflow_staff', staff); }, [staff]);

  // Reset all to sample data
  const resetToDefaults = () => {
    setCustomers(initialCustomers);
    setProducts(initialProducts);
    setPlans(initialPlans);
    setDiscounts(initialDiscounts);
    setTaxes(initialTaxes);
    setSubscriptions(initialSubscriptions);
    setQuotations(initialQuotations);
    setInvoices(initialInvoices);
    setPayments(initialPayments);
    setStaff(initialStaff);
  };

  // --- CRUD HELPERS ---

  // Products
  const addProduct = (prod) => {
    const newProd = {
      ...prod,
      id: generateId('PROD'),
      createdDate: new Date().toISOString().split('T')[0],
      status: prod.status || 'Active',
    };
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Plans
  const addPlan = (plan) => {
    const product = products.find((p) => p.id === plan.productId);
    const newPlan = {
      ...plan,
      id: generateId('PLAN'),
      productName: product ? product.name : plan.productName || 'Custom Product',
      status: plan.status || 'Active',
    };
    setPlans((prev) => [newPlan, ...prev]);
    return newPlan;
  };

  const updatePlan = (id, updates) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePlan = (id) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  // Subscriptions
  const addSubscription = (sub) => {
    const newSub = {
      ...sub,
      id: generateId('SUB'),
      status: sub.status || 'Active',
      startDate: sub.startDate || new Date().toISOString().split('T')[0],
    };
    setSubscriptions((prev) => [newSub, ...prev]);
    return newSub;
  };

  const updateSubscription = (id, updates) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const cancelSubscription = (id) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Closed' } : s))
    );
  };

  // Quotations
  const addQuotation = (quote) => {
    const newQuote = {
      ...quote,
      id: generateId('QUO'),
      quotationNumber: `QT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      issueDate: quote.issueDate || new Date().toISOString().split('T')[0],
      status: quote.status || 'Pending',
      convertedSubscriptionId: null,
    };
    setQuotations((prev) => [newQuote, ...prev]);
    return newQuote;
  };

  const updateQuotation = (id, updates) => {
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  // Convert Quotation into Active/Confirmed Subscription!
  const convertQuotationToSubscription = (quoteId) => {
    const quote = quotations.find((q) => q.id === quoteId);
    if (!quote) return null;

    // Create Subscription from Quote
    const newSub = {
      id: generateId('SUB'),
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      productId: quote.productId,
      productName: quote.productName,
      planId: quote.planId,
      planName: quote.planName,
      interval: 'monthly',
      unitPrice: quote.unitPrice,
      quantity: quote.quantity,
      discountCode: quote.discountCode,
      discountAmount: quote.discountAmount,
      taxPercent: quote.taxPercent,
      taxAmount: quote.taxAmount,
      totalAmount: quote.totalAmount,
      startDate: new Date().toISOString().split('T')[0],
      nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Confirmed',
      notes: `Generated from converted quotation ${quote.quotationNumber}.`,
    };

    setSubscriptions((prev) => [newSub, ...prev]);

    // Mark quote as Converted
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quoteId
          ? { ...q, status: 'Converted', convertedSubscriptionId: newSub.id }
          : q
      )
    );

    // Also automatically generate an invoice for this new subscription!
    const newInv = {
      id: generateId('INV'),
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      subscriptionId: newSub.id,
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerAddress: 'Registered Office',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
      items: [
        {
          description: `${quote.planName} (Qty: ${quote.quantity})`,
          quantity: quote.quantity,
          unitPrice: quote.unitPrice,
          amount: quote.subtotal,
        },
      ],
      subtotal: quote.subtotal,
      discountCode: quote.discountCode,
      discountAmount: quote.discountAmount,
      taxPercent: quote.taxPercent,
      taxAmount: quote.taxAmount,
      totalAmount: quote.totalAmount,
      paidAmount: 0.0,
      paidDate: null,
      notes: `Invoice for confirmed quote ${quote.quotationNumber}`,
    };
    setInvoices((prev) => [newInv, ...prev]);

    return newSub;
  };

  // Invoices & Payments
  const addInvoice = (inv) => {
    const newInv = {
      ...inv,
      id: generateId('INV'),
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      issueDate: inv.issueDate || new Date().toISOString().split('T')[0],
      status: inv.status || 'Pending',
      paidAmount: inv.paidAmount || 0,
    };
    setInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const updateInvoice = (id, updates) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  // Record a payment against an invoice
  const recordPayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: generateId('PAY'),
      paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
      status: 'Completed',
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update target invoice status to Paid
    if (paymentData.invoiceId) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === paymentData.invoiceId
            ? {
                ...inv,
                status: 'Paid',
                paidAmount: Number(paymentData.amount) || inv.totalAmount,
                paidDate: newPayment.paymentDate,
              }
            : inv
        )
      );
    }

    return newPayment;
  };

  // Discounts
  const addDiscount = (disc) => {
    const newDisc = {
      ...disc,
      id: generateId('DISC'),
      usedCount: 0,
      status: disc.status || 'Active',
    };
    setDiscounts((prev) => [newDisc, ...prev]);
    return newDisc;
  };

  const updateDiscount = (id, updates) => {
    setDiscounts((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDiscount = (id) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  };

  // Taxes
  const addTax = (tax) => {
    const newTax = {
      ...tax,
      id: generateId('TAX'),
      status: tax.status || 'Active',
    };
    setTaxes((prev) => [newTax, ...prev]);
    return newTax;
  };

  const updateTax = (id, updates) => {
    setTaxes((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTax = (id) => {
    setTaxes((prev) => prev.filter((t) => t.id !== id));
  };

  // Customers
  const addCustomer = (cust) => {
    const newCust = {
      ...cust,
      id: generateId('CUST'),
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      totalSpent: 0,
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id, updates) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Staff
  const addStaff = (member) => {
    const newStaff = {
      ...member,
      id: generateId('STF'),
      joinedDate: new Date().toISOString().split('T')[0],
      status: member.status || 'Active',
      assignedAccounts: 0,
    };
    setStaff((prev) => [newStaff, ...prev]);
    return newStaff;
  };

  const updateStaff = (id, updates) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStaff = (id) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  // --- DERIVED METRICS FOR DASHBOARDS & CHARTS ---
  const metrics = useMemo(() => {
    // Active subscriptions
    const activeSubs = subscriptions.filter((s) => s.status === 'Active');
    const confirmedSubs = subscriptions.filter((s) => s.status === 'Confirmed');
    const draftSubs = subscriptions.filter((s) => s.status === 'Draft');
    const closedSubs = subscriptions.filter((s) => s.status === 'Closed');

    // MRR calculation (normalize by interval)
    const mrr = activeSubs.reduce((acc, sub) => {
      const monthlyVal = getMonthlyEquivalent(sub.totalAmount, sub.interval || 'monthly');
      return acc + monthlyVal;
    }, 0);

    // Invoices metrics
    const overdueInvoices = invoices.filter((i) => i.status === 'Overdue');
    const pendingInvoices = invoices.filter((i) => i.status === 'Pending');
    const paidInvoices = invoices.filter((i) => i.status === 'Paid');

    const overdueAmount = overdueInvoices.reduce((acc, i) => acc + (Number(i.totalAmount) - Number(i.paidAmount || 0)), 0);
    const pendingAmount = pendingInvoices.reduce((acc, i) => acc + (Number(i.totalAmount) - Number(i.paidAmount || 0)), 0);
    const outstandingAmount = overdueAmount + pendingAmount;
    const totalCollected = paidInvoices.reduce((acc, i) => acc + Number(i.paidAmount || i.totalAmount), 0);

    // Monthly revenue trend (realistic 6 months)
    const monthlyRevenueData = [
      { month: 'May', revenue: 3820, target: 3500 },
      { month: 'Jun', revenue: 4210, target: 4000 },
      { month: 'Jul', revenue: 4980, target: 4500 },
      { month: 'Aug', revenue: 5430, target: 5000 },
      { month: 'Sep', revenue: 6100, target: 5800 },
      { month: 'Oct', revenue: Math.round(mrr > 0 ? mrr : 6850), target: 6500 },
    ];

    // Status distribution
    const statusDistribution = [
      { name: 'Active', value: activeSubs.length, color: '#10b981' },
      { name: 'Confirmed', value: confirmedSubs.length, color: '#6366f1' },
      { name: 'Draft', value: draftSubs.length, color: '#f59e0b' },
      { name: 'Closed', value: closedSubs.length, color: '#ef4444' },
    ];

    return {
      totalCustomers: customers.length,
      activeSubscriptionsCount: activeSubs.length,
      totalSubscriptionsCount: subscriptions.length,
      mrr,
      arr: mrr * 12,
      outstandingAmount,
      overdueCount: overdueInvoices.length,
      overdueAmount,
      totalCollected,
      monthlyRevenueData,
      statusDistribution,
      pendingQuotesCount: quotations.filter((q) => q.status === 'Pending').length,
    };
  }, [customers, subscriptions, invoices, quotations]);

  return (
    <DataContext.Provider
      value={{
        customers,
        products,
        plans,
        discounts,
        taxes,
        subscriptions,
        quotations,
        invoices,
        payments,
        staff,
        metrics,
        resetToDefaults,
        // Product Actions
        addProduct,
        updateProduct,
        deleteProduct,
        // Plan Actions
        addPlan,
        updatePlan,
        deletePlan,
        // Tax Actions
        addTax,
        updateTax,
        deleteTax,
        // Subscription Actions
        addSubscription,
        updateSubscription,
        cancelSubscription,
        // Quotation Actions
        addQuotation,
        updateQuotation,
        convertQuotationToSubscription,
        // Invoice & Payment Actions
        addInvoice,
        updateInvoice,
        recordPayment,
        // Discount Actions
        addDiscount,
        updateDiscount,
        deleteDiscount,
        // Customer Actions
        addCustomer,
        updateCustomer,
        // Staff Actions
        addStaff,
        updateStaff,
        deleteStaff,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

