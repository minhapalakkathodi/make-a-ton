/**
 * BrightLoop API Client Service
 * Connects frontend to the Node.js / Express / MongoDB backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for fetch with JSON headers
const request = async (endpoint, options = {}) => {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API Client] ${endpoint} request failed:`, err.message);
    throw err;
  }
};

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Subscriptions
  getSubscriptions: () => request('/subscriptions'),
  createSubscription: (data) => request('/subscriptions', { method: 'POST', body: JSON.stringify(data) }),
  updateSubscription: (id, data) => request(`/subscriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  cancelSubscription: (id) => request(`/subscriptions/${id}`, { method: 'DELETE' }),

  // Invoices
  getInvoices: () => request('/invoices'),
  createInvoice: (data) => request('/invoices', { method: 'POST', body: JSON.stringify(data) }),
  updateInvoice: (id, data) => request(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Payments
  getPayments: () => request('/payments'),
  createPayment: (data) => request('/payments', { method: 'POST', body: JSON.stringify(data) }),

  // Products
  getProducts: () => request('/products'),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Plans
  getPlans: () => request('/plans'),
  createPlan: (data) => request('/plans', { method: 'POST', body: JSON.stringify(data) }),
  updatePlan: (id, data) => request(`/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePlan: (id) => request(`/plans/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: () => request('/customers'),
  createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  // Quotations
  getQuotations: () => request('/quotations'),
  createQuotation: (data) => request('/quotations', { method: 'POST', body: JSON.stringify(data) }),
  convertQuotation: (id) => request(`/quotations/${id}/convert`, { method: 'POST' }),

  // Discounts
  getDiscounts: () => request('/discounts'),
  createDiscount: (data) => request('/discounts', { method: 'POST', body: JSON.stringify(data) }),
};

