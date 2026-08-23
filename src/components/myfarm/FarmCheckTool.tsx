import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Play, 
  Sparkles
} from 'lucide-react';
import type { Product, FarmCheckReport } from '../../types';
import { QRCard } from '../common/QRCard';

interface FarmCheckToolProps {
  products: Product[];
  initialSelectedProduct?: Product | null;
  onSaveReport: (productId: string, report: FarmCheckReport) => void;
  onOpenQRReport: (reportId: string) => void;
}

export const FarmCheckTool: React.FC<FarmCheckToolProps> = ({
  products,
  initialSelectedProduct,
  onSaveReport,
  onOpenQRReport
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialSelectedProduct?.id || (products.length > 0 ? products[0].id : '')
  );

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [currentReport, setCurrentReport] = useState<FarmCheckReport | null>(
    initialSelectedProduct?.farmCheck || (products.length > 0 && products[0].farmCheck ? products[0].farmCheck : null)
  );

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const runQualityCheck = () => {
    setIsScanning(true);
    setScanStep(1);

    // Step-by-step verification simulation sequence
    setTimeout(() => setScanStep(2), 700);
    setTimeout(() => setScanStep(3), 1400);
    setTimeout(() => setScanStep(4), 2100);

    setTimeout(() => {
      setIsScanning(false);
      setScanStep(0);

      // Generate randomized realistic score
      const score = Math.floor(Math.random() * 8) + 90; // 90 to 97
      const grade = score >= 90 ? 'GRADE A' : 'GRADE B';

      const newReport: FarmCheckReport = {
        id: `FC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        productId: selectedProduct?.id || 'prod_001',
        productName: selectedProduct?.name || 'Produce Lot',
        overallScore: score,
        grade,
        verified: true,
        verificationDate: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        inspector: 'FarmCheck Quality Standard v2',
        metrics: {
          weightScore: Math.floor(Math.random() * 6) + 92,
          sizeScore: Math.floor(Math.random() * 8) + 88,
          colourScore: Math.floor(Math.random() * 6) + 93,
          defectScore: Math.floor(Math.random() * 5) + 94,
          weightVal: `${selectedProduct?.unit || 'kg'} standard crate weight verified`,
          sizeVal: 'Uniform size spectrum analysis',
          colourVal: 'Reflectance spectro-scan matched',
          defectsVal: 'Defects < 1.5%'
        }
      };

      setCurrentReport(newReport);
      if (selectedProduct) {
        onSaveReport(selectedProduct.id, newReport);
      }
    }, 2800);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0F4C3A 0%, #16A34A 100%)',
        color: 'white',
        padding: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            <Sparkles size={14} />
            <span>FarmCheck Quality Verification System</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>
            Produce Quality Assessment
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.875rem', marginTop: '4px', maxWidth: '600px' }}>
            Run physical batch evaluation for weight accuracy, size uniformity, color reflectance, and defect scores to generate QR passports for marketplace listing.
          </p>
        </div>
      </div>

      {/* Main Grid: Control Panel + Live Scanning Visual */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2">
        {/* Left Control Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '14px' }}>
              Select Produce Batch to Verify
            </h3>

            {products.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No active produce listings available. Please add a product to your farm list first.
              </p>
            ) : (
              <div className="form-group">
                <label className="form-label">Harvest Produce Batch</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const found = products.find(p => p.id === e.target.value);
                    setCurrentReport(found?.farmCheck || null);
                  }}
                  className="form-input"
                  style={{ fontSize: '0.95rem', fontWeight: 700 }}
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.quantity} {p.unit}s) - {p.farmCheck ? `Score: ${p.farmCheck.overallScore}/100` : 'Unverified'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedProduct && (
              <div style={{
                background: 'var(--surface-hover)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginTop: '16px',
                border: '1px solid var(--surface-border)'
              }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{selectedProduct.name}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Category: {selectedProduct.category} • Price: ₹{selectedProduct.price}/{selectedProduct.unit}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--emerald)', fontWeight: 700, marginTop: '2px' }}>
                      Status: {selectedProduct.farmCheck ? `Verified Grade: ${selectedProduct.farmCheck.grade}` : 'Ready for Verification'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px' }}>
            <button
              onClick={runQualityCheck}
              disabled={isScanning || !selectedProduct}
              className="btn btn-emerald btn-lg"
              style={{ width: '100%', borderRadius: '12px', justifyContent: 'center' }}
            >
              {isScanning ? (
                <>
                  <Sparkles size={20} className="spin" />
                  <span>Evaluating Quality Batch (Step {scanStep}/4)...</span>
                </>
              ) : (
                <>
                  <Play size={20} />
                  <span>Start Quality Assessment</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Scan Visualization or Verification Report Card */}
        <div>
          {isScanning ? (
            <div className="card" style={{ padding: '40px 24px', textAlign: 'center', minHeight: '360px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Sparkles size={36} className="spin" />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                {scanStep === 1 && '1. Calibrating Weight & Quantity Measurement...'}
                {scanStep === 2 && '2. Scanning Produce Size Uniformity Spectrum...'}
                {scanStep === 3 && '3. Analyzing Color Reflectance & Ripeness Index...'}
                {scanStep === 4 && '4. Computing Defect Score & Quality Grade...'}
              </h3>

              <div style={{ width: '100%', maxWidth: '300px', height: '6px', background: 'var(--surface-border)', borderRadius: '3px', marginTop: '20px', overflow: 'hidden' }}>
                <div style={{ width: `${(scanStep / 4) * 100}%`, height: '100%', background: 'var(--emerald)', transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ) : currentReport ? (
            <QRCard report={currentReport} onOpenReport={onOpenQRReport} />
          ) : (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <ShieldCheck size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Quality Assessment Run Yet</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                Select a produce batch on the left and click "Start Quality Assessment" to generate a verified passport.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
