import React from 'react';
import { ShieldCheck, ArrowLeft, Printer } from 'lucide-react';
import type { FarmCheckReport } from '../../types';
import { QRCard } from '../common/QRCard';

interface VerifyReportProps {
  reportId: string;
  reports: FarmCheckReport[];
  onBack: () => void;
}

export const VerifyReport: React.FC<VerifyReportProps> = ({ reportId, reports, onBack }) => {
  const report = reports.find(r => r.id === reportId) || reports[0];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <button 
        onClick={onBack}
        className="btn btn-outline btn-sm"
        style={{ width: 'fit-content', borderRadius: '20px' }}
      >
        <ArrowLeft size={16} /> Back to Application
      </button>

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0F4C3A 0%, #16A34A 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)'
          }}>
            <ShieldCheck size={36} />
          </div>

          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--emerald)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            PUBLIC VERIFICATION PASSPORT
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
            FarmCheck Prototype Verification
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Official quality verification report stored on FarmSetu ledger.
          </p>
        </div>

        {report && <QRCard report={report} />}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button onClick={() => window.print()} className="btn btn-outline">
            <Printer size={16} /> Print Passport Record
          </button>
        </div>
      </div>
    </div>
  );
};
