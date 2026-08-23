import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  ShoppingBag, 
  MessageSquare, 
  ExternalLink,
  Edit
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import type { Product, UserProfile } from '../../types';
import { formatDate, cleanLocation, formatPrice, formatQuantity, getNumericPrice } from '../../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onBuyProduct: (productId: string, quantity: number) => void;
  onOpenQRReport: (reportId: string) => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  currentUser,
  onBuyProduct,
  onOpenQRReport,
  onEditProduct
}) => {
  const [buyQty, setBuyQty] = useState<number>(100);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  if (!product) return null;

  const isOwner = currentUser ? product.farmerId === currentUser.id : false;
  const fc = product.farmCheck;

  const safePrice = getNumericPrice(product.price);
  const formattedLocation = cleanLocation(product.location);
  const formattedDate = formatDate(product.harvestDate);
  const formattedQty = formatQuantity(product.quantity);

  const handleBuy = () => {
    onBuyProduct(product.id, buyQty);
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name} maxWidth="680px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Top Image + Quick Overview */}
        <div className="product-modal-hero">
          <div className="product-modal-img-wrapper">
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {fc?.verified && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
                padding: '5px 10px',
                borderRadius: '20px',
                fontSize: '0.725rem',
                fontWeight: 800,
                color: '#0369A1',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <ShieldCheck size={15} color="#0369A1" />
                <span>FarmCheck Verified</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <StatusBadge status={product.category} />
                {fc && <StatusBadge status={fc.grade} />}
              </div>

              <div className="price-mono" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-canopy)' }}>
                {formatPrice(product.price)} <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>/ {product.unit}</span>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.825rem', color: 'var(--color-ink-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} color="var(--color-canopy)" style={{ flexShrink: 0 }} />
                  <span>Location: <strong>{formattedLocation}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} style={{ flexShrink: 0 }} />
                  <span>Harvest Date: <strong className="num-mono">{formattedDate}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShoppingBag size={15} style={{ flexShrink: 0 }} />
                  <span>Available Quantity: <strong className="num-mono">{formattedQty} {product.unit}s</strong></span>
                </div>
              </div>

              {/* Farmer Info */}
              <div style={{
                marginTop: '14px',
                padding: '10px 14px',
                background: 'var(--color-sand)',
                border: '1px solid #D8CEB7',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--color-rice-paper)', color: 'var(--color-canopy)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D8CEB7', flexShrink: 0 }}>
                    <User size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-ink)' }}>{product.farmerName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-ink-muted)' }}>Farmer Producer</div>
                  </div>
                </div>
                {product.farmerVerified && (
                  <span className="badge badge-verified">
                    <CheckCircle2 size={13} /> Verified
                  </span>
                )}
              </div>
            </div>

            {/* Owner Edit button if applicable */}
            {isOwner && onEditProduct && (
              <button 
                onClick={() => { onClose(); onEditProduct(product); }}
                className="btn btn-outline"
                style={{ width: '100%', marginTop: '12px', fontWeight: 700 }}
              >
                <Edit size={16} />
                <span>Edit Listing Details</span>
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '4px', color: 'var(--color-canopy)' }}>Product Description</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
            {product.description}
          </p>
        </div>

        {/* FarmCheck Verification Score Section */}
        {fc ? (
          <div style={{
            background: 'var(--color-sand)',
            border: '1px solid #D8CEB7',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={20} color="var(--color-canopy)" />
                <span style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-canopy)' }}>FarmCheck Quality Passport</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="num-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-canopy)' }}>{fc.overallScore} / 100</span>
                <span className="badge badge-grade-a">{fc.grade}</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid-4" style={{ gap: '8px' }}>
              <div style={{ background: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #D8CEB7' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-ink-muted)', fontWeight: 600 }}>Weight</div>
                <div className="num-mono" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-canopy)' }}>{fc.metrics.weightScore}%</div>
              </div>

              <div style={{ background: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #D8CEB7' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-ink-muted)', fontWeight: 600 }}>Size</div>
                <div className="num-mono" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-canopy)' }}>{fc.metrics.sizeScore}%</div>
              </div>

              <div style={{ background: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #D8CEB7' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-ink-muted)', fontWeight: 600 }}>Colour</div>
                <div className="num-mono" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-canopy)' }}>{fc.metrics.colourScore}%</div>
              </div>

              <div style={{ background: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #D8CEB7' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-ink-muted)', fontWeight: 600 }}>Defect</div>
                <div className="num-mono" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-canopy)' }}>{fc.metrics.defectScore}%</div>
              </div>
            </div>

            <button 
              onClick={() => { onClose(); onOpenQRReport(fc.id); }}
              className="btn btn-outline btn-sm"
              style={{ marginTop: '10px', width: '100%', background: 'white', borderRadius: '8px', fontWeight: 700 }}
            >
              <ExternalLink size={13} />
              <span>View Quality Passport ({fc.id})</span>
            </button>
          </div>
        ) : (
          <div style={{ padding: '10px 14px', background: 'var(--color-sand)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
            ⚠️ Quality verification pending for this batch.
          </div>
        )}

        {/* Buying Action Section */}
        {!isOwner && (
          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--color-sand)' }}>
            {orderSuccess ? (
              <div style={{
                background: 'var(--color-sand)',
                color: 'var(--color-canopy)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                fontWeight: 800,
                border: '1px solid #D8CEB7'
              }}>
                ✓ Order Confirmed! Direct purchase request sent to farmer.
              </div>
            ) : (
              <div className="product-modal-actions">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-ink)' }}>Qty ({product.unit}):</span>
                  <input 
                    type="number"
                    min="1"
                    value={buyQty}
                    onChange={(e) => setBuyQty(Math.max(1, Number(e.target.value)))}
                    style={{ width: '80px', borderRadius: '8px', padding: '6px 8px' }}
                    className="form-input num-mono"
                  />
                </div>

                <button 
                  onClick={handleBuy}
                  className="btn btn-cta btn-lg"
                  style={{ flex: 1, minWidth: '150px', borderRadius: '10px', background: 'var(--color-turmeric)', color: 'var(--color-turmeric-text)', fontWeight: 800 }}
                >
                  <ShoppingBag size={17} />
                  <span>Buy Now (₹{(safePrice * buyQty).toLocaleString('en-IN')})</span>
                </button>

                <button 
                  onClick={() => alert(`Contacting farmer ${product.farmerName}`)}
                  className="btn btn-outline btn-lg"
                  style={{ borderRadius: '10px', fontWeight: 700 }}
                >
                  <MessageSquare size={17} />
                  <span>Contact Farmer</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
