/**
 * Formatters tailored for BrightLoop SaaS (supporting INR ₹ matching screenshot)
 */

export const formatCurrency = (amount, compact = false) => {
  const num = Number(amount) || 0;

  if (compact) {
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    }
    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(0)}K`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateInput) => {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const formatInterval = (interval) => {
  const map = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    annual: 'Yearly',
  };
  return map[interval?.toLowerCase()] || interval || 'Monthly';
};

export const getStatusConfig = (status = '') => {
  const s = status.toLowerCase();

  // Active / Paid / Confirmed
  if (['active', 'paid', 'confirmed', 'approved', 'success'].includes(s)) {
    return {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      dot: 'bg-emerald-500',
      label: status.charAt(0).toUpperCase() + status.slice(1),
    };
  }

  // Pending / Draft / Quotation
  if (['pending', 'draft', 'quotation', 'in review', 'warning'].includes(s)) {
    return {
      bg: 'bg-amber-50 text-amber-600 border-amber-200/80',
      dot: 'bg-amber-500',
      label: status.charAt(0).toUpperCase() + status.slice(1),
    };
  }

  // Closed / Overdue / Inactive / Cancelled
  if (['closed', 'overdue', 'inactive', 'cancelled', 'rejected', 'failed'].includes(s)) {
    return {
      bg: 'bg-rose-50 text-rose-600 border-rose-200/80',
      dot: 'bg-rose-500',
      label: status.charAt(0).toUpperCase() + status.slice(1),
    };
  }

  return {
    bg: 'bg-slate-50 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    label: status || 'Unknown',
  };
};
