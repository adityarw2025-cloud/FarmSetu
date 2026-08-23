import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'general' | 'grade' | 'availability';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bg = '#F1F5F9';
  let color = '#475569';
  let border = '#E2E8F0';

  const s = status.toUpperCase();

  if (s.includes('GRADE A') || s.includes('CONFIRMED') || s.includes('DELIVERED') || s.includes('AVAILABLE') || s.includes('ACCEPTED') || s === 'COMPLETED') {
    bg = '#DCFCE7';
    color = '#14532D';
    border = '#86EFAC';
  } else if (s.includes('GRADE B') || s.includes('PENDING') || s.includes('SHIPPED') || s.includes('RENTED')) {
    bg = '#FEF3C7';
    color = '#B45309';
    border = '#FDE68A';
  } else if (s.includes('DECLINED') || s.includes('CANCELLED') || s.includes('MAINTENANCE') || s.includes('UNVERIFIED')) {
    bg = '#FEE2E2';
    color = '#991B1B';
    border = '#FCA5A5';
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '0.725rem',
      fontWeight: 700,
      background: bg,
      color,
      border: `1px solid ${border}`,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap'
    }}>
      {status}
    </span>
  );
};
