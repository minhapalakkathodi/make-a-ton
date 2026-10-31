import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Repeat,
  Receipt,
  CreditCard,
  Percent,
  PercentCircle,
  Users,
  UserCog,
  BarChart3,
  Settings,
  ShoppingBag,
  History,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import { BrightLoopLogo } from '../common/BrightLoopLogo';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

export const Sidebar = ({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) => {
  const { role, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu items matching the new templates
  const adminMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
    { label: 'Products', icon: Package, to: '/admin/products' },
    { label: 'Plans', icon: Layers, to: '/admin/plans' },
    { label: 'Subscriptions', icon: Repeat, to: '/admin/subscriptions' },
    { label: 'Quotations', icon: FileSpreadsheet, to: '/admin/quotations' },
    { label: 'Invoices', icon: Receipt, to: '/admin/invoices' },
    { label: 'Payments', icon: CreditCard, to: '/admin/payments' },
    { label: 'Discounts', icon: Percent, to: '/admin/discounts' },
    { label: 'Taxes', icon: PercentCircle, to: '/admin/taxes' },
    { label: 'Customers', icon: Users, to: '/admin/customers' },
    { label: 'Staff', icon: UserCog, to: '/admin/staff' },
    { label: 'Reports', icon: BarChart3, to: '/admin/reports' },
    { label: 'Settings', icon: Settings, to: '/admin/settings' },
  ];

  const staffMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/staff/dashboard' },
    { label: 'Customers', icon: Users, to: '/staff/customers' },
    { label: 'Subscriptions', icon: Repeat, to: '/staff/subscriptions' },
    { label: 'Quotations', icon: FileSpreadsheet, to: '/staff/quotations' },
    { label: 'Invoices', icon: Receipt, to: '/staff/invoices' },
    { label: 'Payments', icon: CreditCard, to: '/staff/payments' },
    { label: 'Profile', icon: User, to: '/staff/profile' },
  ];

  const customerMenuItems = [
    { label: 'Overview', icon: LayoutDashboard, to: '/portal/dashboard' },
    { label: 'Browse Plans', icon: ShoppingBag, to: '/portal/plans' },
    { label: 'My Subscriptions', icon: Repeat, to: '/portal/subscriptions' },
    { label: 'My Invoices', icon: Receipt, to: '/portal/invoices' },
    { label: 'Payment History', icon: History, to: '/portal/payments' },
    { label: 'Profile', icon: User, to: '/portal/profile' },
  ];

  const menuItems =
    role === 'staff'
      ? staffMenuItems
      : role === 'customer'
      ? customerMenuItems
      : adminMenuItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Frame - Warm Butter Cream Yellow (#fef8db) */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-[#fef8db] text-slate-800 transition-all duration-300 border-r border-[#faefbe] select-none',
          isCollapsed ? 'w-20' : 'w-60',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#faefbe] shrink-0">
          <Link
            to={role === 'customer' ? '/portal/dashboard' : role === 'staff' ? '/staff/dashboard' : '/admin/dashboard'}
            className="flex items-center gap-2 overflow-hidden"
          >
            <BrightLoopLogo showText={!isCollapsed} />
          </Link>

          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-[#faefbe] transition"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 group relative',
                    isActive
                      ? 'bg-[#f5b72e] text-slate-950 font-bold shadow-xs'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-[#faefbe] font-medium',
                    isCollapsed && 'justify-center px-2 py-3'
                  )
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom User Pill */}
        <div className="p-3 border-t border-[#faefbe] shrink-0">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-xl transition',
              isCollapsed && 'justify-center p-1'
            )}
          >
            <div className="w-8 h-8 rounded-full bg-[#faefbe] border border-[#ebd88d] text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.name?.charAt(0) || (role === 'admin' ? 'A' : role === 'staff' ? 'S' : 'C')}
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 capitalize leading-tight">
                    {role === 'admin' ? 'Admin' : role === 'staff' ? 'Staff' : 'Customer'}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-[11px] text-slate-500 hover:text-rose-600 transition leading-tight mt-0.5 flex items-center gap-1"
                  >
                    Logout
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
