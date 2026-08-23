import React from 'react';
import { ShieldCheck, Calendar, Hash, Award, ExternalLink } from 'lucide-react';
import type { FarmCheckReport } from '../../types';

interface QRCardProps {
  report: FarmCheckReport;
  onOpenReport?: (id: string) => void;
}

export const QRCard: React.FC<QRCardProps> = ({ report, onOpenReport }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
      border: '2px solid var(--emerald)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      boxShadow: 'var(--shadow-lg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--surface-border)',
        paddingBottom: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
              ✓ FARMSETU VERIFIED
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Quality Verification Passport
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--emerald-light)',
          color: 'var(--emerald-dark)',
          padding: '6px 14px',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 800,
          border: '1px solid #86EFAC'
        }}>
          {report.grade}
        </div>
      </div>

      {/* Body Grid: Details on Left, QR code on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            {report.productName}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={14} color="#16A34A" />
              <span>Overall Score: <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{report.overallScore} / 100</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Hash size={14} />
              <span>Verification ID: <strong>{report.id}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} />
              <span>Verified On: {report.verificationDate}</span>
            </div>
          </div>

          {/* Key metrics breakdown preview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginTop: '14px',
            background: 'var(--surface-hover)',
            padding: '10px',
            borderRadius: 'var(--radius-md)'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Weight Score</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{report.metrics.weightScore}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Color Quality</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{report.metrics.colourScore}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Size Uniformity</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{report.metrics.sizeScore}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Defects Free</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{report.metrics.defectScore}%</div>
            </div>
          </div>
        </div>

        {/* QR Code Visual Block */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          background: 'white',
          padding: '12px',
          borderRadius: '16px',
          border: '1px solid var(--surface-border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Custom SVG QR Code Matrix representation */}
          <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="white" />
            {/* Top-Left Position Square */}
            <rect x="5" y="5" width="30" height="30" rx="4" fill="#0F4C3A" />
            <rect x="10" y="10" width="20" height="20" rx="2" fill="white" />
            <rect x="14" y="14" width="12" height="12" rx="1" fill="#0F4C3A" />

            {/* Top-Right Position Square */}
            <rect x="65" y="5" width="30" height="30" rx="4" fill="#0F4C3A" />
            <rect x="70" y="10" width="20" height="20" rx="2" fill="white" />
            <rect x="74" y="14" width="12" height="12" rx="1" fill="#0F4C3A" />

            {/* Bottom-Left Position Square */}
            <rect x="5" y="65" width="30" height="30" rx="4" fill="#0F4C3A" />
            <rect x="10" y="70" width="20" height="20" rx="2" fill="white" />
            <rect x="14" y="74" width="12" height="12" rx="1" fill="#0F4C3A" />

            {/* Data Modules */}
            <rect x="42" y="10" width="6" height="6" fill="#16A34A" />
            <rect x="50" y="10" width="6" height="6" fill="#0F4C3A" />
            <rect x="42" y="24" width="6" height="6" fill="#0F4C3A" />
            <rect x="52" y="24" width="6" height="6" fill="#16A34A" />
            
            <rect x="10" y="42" width="6" height="6" fill="#0F4C3A" />
            <rect x="24" y="42" width="6" height="6" fill="#16A34A" />
            <rect x="40" y="40" width="20" height="20" rx="4" fill="#16A34A" />
            <path d="M46 50 L49 53 L54 47" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="68" y="42" width="6" height="6" fill="#0F4C3A" />
            <rect x="82" y="42" width="6" height="6" fill="#16A34A" />

            <rect x="42" y="68" width="6" height="6" fill="#0F4C3A" />
            <rect x="52" y="68" width="6" height="6" fill="#16A34A" />
            <rect x="68" y="68" width="6" height="6" fill="#0F4C3A" />
            <rect x="82" y="68" width="6" height="6" fill="#16A34A" />
            <rect x="42" y="82" width="6" height="6" fill="#16A34A" />
            <rect x="52" y="82" width="6" height="6" fill="#0F4C3A" />
            <rect x="68" y="82" width="12" height="6" fill="#0F4C3A" />
          </svg>
          
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>
            Scan to Verify
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px dashed var(--surface-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <span>FarmCheck Prototype Verification Record</span>

        {onOpenReport && (
          <button 
            onClick={() => onOpenReport(report.id)}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '20px' }}
          >
            <ExternalLink size={13} />
            <span>Open Public Report</span>
          </button>
        )}
      </div>
    </div>
  );
};
