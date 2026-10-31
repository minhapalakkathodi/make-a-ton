import React, { useState } from 'react';
import { Bell, Check, Clock, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Invoice Overdue Warning',
      message: 'Invoice INV-2026-102 for TechFlow Solutions is overdue by 16 days.',
      time: '10m ago',
      type: 'warning',
      unread: true,
    },
    {
      id: 2,
      title: 'Payment Received',
      message: 'Payment of $655.60 received for Acme Corporation.',
      time: '1h ago',
      type: 'success',
      unread: true,
    },
    {
      id: 3,
      title: 'Quotation Approved',
      message: 'Apex Health Systems approved quotation QT-2026-082.',
      time: '3h ago',
      type: 'info',
      unread: false,
    },
    {
      id: 4,
      title: 'New Subscription Active',
      message: 'CloudSync Enterprise license confirmed for 2 sites.',
      time: '1d ago',
      type: 'info',
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-brand-100 text-brand-700 font-bold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-brand-600 hover:text-brand-700 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 flex gap-3 text-xs transition hover:bg-slate-50/80 ${
                    item.unread ? 'bg-brand-50/20' : ''
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {item.type === 'warning' ? (
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                    ) : item.type === 'success' ? (
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{item.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-slate-100 text-center bg-slate-50/50">
              <span className="text-[11px] text-slate-400 font-medium">
                All notifications synced live
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

