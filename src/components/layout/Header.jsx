import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';

export const Header = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const { currentUser, role, loginAs, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const handleRoleSwitch = (newRole) => {
    loginAs(newRole);
    setIsRoleMenuOpen(false);
    if (newRole === 'admin') navigate('/admin/dashboard');
    else if (newRole === 'staff') navigate('/staff/dashboard');
    else navigate('/portal/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadges = {
    admin: { label: 'Admin View', bg: 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]', icon: Shield },
    staff: { label: 'Staff View', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Briefcase },
    customer: { label: 'Customer View', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: User },
  };

  const CurrentRoleIcon = roleBadges[role]?.icon || Shield;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#fffdf5] border-b border-[#faefbe] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Sidebar toggle & Search input */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-[#fef8db] transition focus:outline-none"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search pill matching screenshot */}
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#faefbe] rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f5b72e]/30 focus:border-[#f5b72e] transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Right: Demo Switcher, Notification, Profile */}
      <div className="flex items-center gap-3">
        {/* Demo Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition shadow-2xs ${
              roleBadges[role]?.bg || 'bg-[#fef8db] text-slate-800 border-[#faefbe]'
            }`}
          >
            <CurrentRoleIcon className="w-3.5 h-3.5" />
            <span>{roleBadges[role]?.label || 'Workspace'}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isRoleMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsRoleMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-1.5 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Demo Persona
                </div>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                    role === 'admin' ? 'bg-[#fef8db] text-slate-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-4 h-4 text-[#d97706]" />
                  <div>
                    <div>Administrator</div>
                    <div className="text-[10px] text-slate-400">Full management suite</div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSwitch('staff')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                    role === 'staff' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <div>
                    <div>Staff Member</div>
                    <div className="text-[10px] text-slate-400">Daily billing operations</div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSwitch('customer')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                    role === 'customer' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div>Customer (John Doe)</div>
                    <div className="text-[10px] text-slate-400">Self-service & invoices</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User Avatar Circle */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-[#fef8db] transition focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#f5b72e] text-slate-900 font-bold text-xs flex items-center justify-center ring-2 ring-[#faefbe]">
              {role === 'customer' ? 'JD' : currentUser?.name?.charAt(0) || 'A'}
            </div>
          </button>

          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-2 animate-in fade-in zoom-in-95">
                <div className="p-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (role === 'customer') navigate('/portal/profile');
                      else if (role === 'staff') navigate('/staff/profile');
                      else navigate('/admin/settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </button>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
