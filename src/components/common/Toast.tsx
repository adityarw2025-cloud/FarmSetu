import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  text?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 size={20} color="#16A34A" />;
      case 'error': return <AlertCircle size={20} color="#EF4444" />;
      default: return <Info size={20} color="#3B82F6" />;
    }
  };

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 110,
      background: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 18px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      border: '1px solid var(--surface-border)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      maxWidth: '380px'
    }}>
      {getIcon()}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
          {toast.title}
        </div>
        {toast.text && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {toast.text}
          </div>
        )}
      </div>
      <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
        <X size={16} />
      </button>
    </div>
  );
};
