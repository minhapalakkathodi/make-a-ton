import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Dashboards
import { AdminDashboard } from '../pages/dashboard/AdminDashboard';
import { StaffDashboard } from '../pages/dashboard/StaffDashboard';
import { CustomerDashboard } from '../pages/dashboard/CustomerDashboard';

// Shared / Admin Feature Pages
import { ProductListPage } from '../pages/products/ProductListPage';
import { PlanListPage } from '../pages/plans/PlanListPage';
import { SubscriptionListPage } from '../pages/subscriptions/SubscriptionListPage';
import { QuotationListPage } from '../pages/quotations/QuotationListPage';
import { InvoiceListPage } from '../pages/invoices/InvoiceListPage';
import { PaymentListPage } from '../pages/payments/PaymentListPage';
import { DiscountListPage } from '../pages/discounts/DiscountListPage';
import { CustomerListPage } from '../pages/customers/CustomerListPage';
import { StaffManagementPage } from '../pages/staff/StaffManagementPage';
import { RevenueReportsPage } from '../pages/reports/RevenueReportsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { StaffProfilePage } from '../pages/staff/StaffProfilePage';

// Customer Portal Pages
import { BrowsePlansPage } from '../pages/portal/BrowsePlansPage';
import { MySubscriptionsPage } from '../pages/portal/MySubscriptionsPage';
import { MyInvoicesPage } from '../pages/portal/MyInvoicesPage';
import { MyPaymentsPage } from '../pages/portal/MyPaymentsPage';
import { CustomerProfilePage } from '../pages/portal/CustomerProfilePage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="plans" element={<PlanListPage />} />
        <Route path="discounts" element={<DiscountListPage />} />
        <Route path="subscriptions" element={<SubscriptionListPage />} />
        <Route path="quotations" element={<QuotationListPage />} />
        <Route path="invoices" element={<InvoiceListPage />} />
        <Route path="payments" element={<PaymentListPage />} />
        <Route path="customers" element={<CustomerListPage />} />
        <Route path="staff" element={<StaffManagementPage />} />
        <Route path="reports" element={<RevenueReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Staff Protected Routes */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="customers" element={<CustomerListPage />} />
        <Route path="subscriptions" element={<SubscriptionListPage />} />
        <Route path="quotations" element={<QuotationListPage />} />
        <Route path="invoices" element={<InvoiceListPage />} />
        <Route path="payments" element={<PaymentListPage />} />
        <Route path="profile" element={<StaffProfilePage />} />
      </Route>

      {/* Customer Protected Portal Routes */}
      <Route
        path="/portal"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/portal/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="plans" element={<BrowsePlansPage />} />
        <Route path="subscriptions" element={<MySubscriptionsPage />} />
        <Route path="invoices" element={<MyInvoicesPage />} />
        <Route path="payments" element={<MyPaymentsPage />} />
        <Route path="profile" element={<CustomerProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

