import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard utility for merging Tailwind classes safely
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Generates human-friendly sequential or random identifiers (e.g. INV-2026-004)
 */
export function generateId(prefix = 'REC') {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
}

/**
 * Normalizes any billing interval (daily, weekly, monthly, yearly) to a monthly equivalent
 */
export function getMonthlyEquivalent(amount, interval) {
  const val = Number(amount) || 0;
  switch (interval?.toLowerCase()) {
    case 'daily':
      return val * 30;
    case 'weekly':
      return (val * 52) / 12;
    case 'yearly':
    case 'annual':
      return val / 12;
    case 'monthly':
    default:
      return val;
  }
}

/**
 * Calculate totals with discount and tax
 */
export function calculateTotals({ price = 0, quantity = 1, discountValue = 0, discountType = 'percentage', taxPercent = 10 }) {
  const subtotal = Number(price) * Number(quantity);
  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = (subtotal * Number(discountValue)) / 100;
  } else {
    discountAmount = Number(discountValue);
  }
  discountAmount = Math.min(discountAmount, subtotal); // Cannot discount more than subtotal

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * Number(taxPercent)) / 100;
  const total = taxableAmount + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total,
  };
}

/**
 * Safe localStorage wrapper with memory fallback
 */
export const storage = {
  get: (key, defaultValue) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing to localStorage key "${key}":`, e);
    }
  },
  remove: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
    }
  },
};

