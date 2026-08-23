import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = '520px' 
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 12px',
        overflowY: 'auto'
      }} 
      onClick={onClose}
    >
      <div 
        className="animate-fade-in"
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth,
          maxHeight: 'calc(100vh - 40px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--surface-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          margin: 'auto 0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div style={{
          padding: '12px 18px',
          borderBottom: '1px solid var(--surface-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface)',
          flexShrink: 0
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.3 }}>
            {title}
          </h3>
          <button 
            onClick={onClose} 
            style={{
              padding: '6px',
              borderRadius: '50%',
              background: 'var(--surface-hover)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body Container */}
        <div style={{ 
          padding: '16px 18px', 
          overflowY: 'auto', 
          flex: '1 1 auto'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};
