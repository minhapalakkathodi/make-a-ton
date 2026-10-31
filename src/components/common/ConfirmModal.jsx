import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const icons = {
    danger: <AlertTriangle className="w-6 h-6 text-rose-600" />,
    warning: <AlertCircle className="w-6 h-6 text-amber-600" />,
    info: <Info className="w-6 h-6 text-brand-600" />,
  };

  const bgStyles = {
    danger: 'bg-rose-50 border-rose-100',
    warning: 'bg-amber-50 border-amber-100',
    info: 'bg-brand-50 border-brand-100',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title}>
      <div className="flex items-start gap-4 py-2">
        <div className={`p-3 rounded-xl border shrink-0 ${bgStyles[variant] || bgStyles.danger}`}>
          {icons[variant] || icons.danger}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

