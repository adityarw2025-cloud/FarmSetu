import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  MapPin, 
  Star, 
  Tractor, 
  Sprout, 
  Eye, 
  Calendar,
  Tag
} from 'lucide-react';
import type { Product, Equipment, UserProfile } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ProductDetailModal } from './ProductDetailModal';
import { i18n } from '../../lib/i18n';
import { formatDate, cleanLocation, formatPrice, formatQuantity } from '../../utils/formatters';

interface MarketplaceProps {
  products: Product[];
  equipment: Equipment[];
  currentUser: UserProfile | null;
  onBuyProduct: (productId: string, quantity: number) => void;
  onOpenQRReport: (reportId: string) => void;
  onOpenEquipmentRentModal: (equipment: Equipment) => void;
  onEditProduct?: (product: Product) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  products,
  equipment,
  currentUser,
  onBuyProduct,
  onOpenQRReport,
  onOpenEquipmentRentModal,
  onEditProduct
}) => {
  const [, setLang] = useState(i18n.getLanguage());

  useEffect(() => {
    return i18n.subscribe(() => setLang(i18n.getLanguage()));
  }, []);

  const t = i18n.t();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'All' | 'Produce' | 'Vegetables' | 'Fruits' | 'Grains' | 'Equipment'>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter produce
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeCategoryTab === 'All' || 
                       activeCategoryTab === 'Produce' || 
                       p.category === activeCategoryTab;
    const matchesLoc = locationFilter === 'All' || p.location.includes(locationFilter);
    return matchesSearch && matchesTab && matchesLoc;
  });

  // Filter equipment
  const filteredEquipment = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeCategoryTab === 'All' || activeCategoryTab === 'Equipment';
    const matchesLoc = locationFilter === 'All' || e.location.includes(locationFilter);
    return matchesSearch && matchesTab && matchesLoc;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Unified Search & Category Controls */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
          {/* Search Bar */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '42px', borderRadius: '24px' }}
            />
          </div>

          {/* Location Filter */}
          <div style={{ minWidth: '180px' }}>
            <select 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="form-select"
              style={{ borderRadius: '24px' }}
            >
              <option value="All">📍 {t.location} (All)</option>
              <option value="Nashik">Nashik, Maharashtra</option>
              <option value="Indore">Indore, Madhya Pradesh</option>
              <option value="Ratnagiri">Ratnagiri, Maharashtra</option>
              <option value="Erode">Erode, Tamil Nadu</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="tabs-nav">
          <button className={`tab-btn ${activeCategoryTab === 'All' ? 'active' : ''}`} onClick={() => setActiveCategoryTab('All')}>
            🌐 {t.all}
          </button>
          <button className={`tab-btn ${activeCategoryTab === 'Produce' ? 'active' : ''}`} onClick={() => setActiveCategoryTab('Produce')}>
            🌱 {t.produce}
          </button>
          <button className={`tab-btn ${activeCategoryTab === 'Vegetables' ? 'active' : ''}`} onClick={() => setActiveCategoryTab('Vegetables')}>
            🥦 {t.vegetables}
          </button>
          <button className={`tab-btn ${activeCategoryTab === 'Fruits' ? 'active' : ''}`} onClick={() => setActiveCategoryTab('Fruits')}>
            🍓 {t.fruits}
          </button>
          <button className={`tab-btn ${activeCategoryTab === 'Grains' ? 'active' : ''}`} onClick={() => setActiveCategoryTab('Grains')}>
            🌾 {t.grains}
          </button>
          <button className={`tab-btn ${activeCategoryTab === 'Equipment' ? 'active' : ''}`} onClick={() => setActiveCategoryTab('Equipment')}>
            🚜 {t.equipment}
          </button>
        </div>
      </div>

      {/* Produce Grid */}
      {(activeCategoryTab !== 'Equipment') && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sprout size={20} color="#16A34A" />
              <span>{t.produce} ({filteredProducts.length})</span>
            </h3>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No produce matching search query. Try broadening your filters.
            </div>
          ) : (
            <div className="grid-responsive">
              {filteredProducts.map(prod => (
                <div 
                  key={prod.id} 
                  className={`card card-interactive ${prod.farmCheck?.verified ? 'verified-ticket-card' : ''}`} 
                  style={{ display: 'flex', flexDirection: 'column', padding: 0 }}
                >
                  {/* Card Image */}
                  <div className="grid-card-img" style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {prod.farmCheck?.verified && (
                      <div className="badge badge-verified" style={{
                        position: 'absolute',
                        top: '10px',
                        left: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <ShieldCheck size={12} color="var(--color-sprout)" />
                        <span>Verified Ticket</span>
                      </div>
                    )}

                    {prod.farmCheck && (
                      <div style={{
                        position: 'absolute',
                        bottom: '6px',
                        right: '6px',
                        background: 'var(--color-canopy)',
                        color: 'var(--color-rice-paper)',
                        fontFamily: 'var(--font-mono)',
                        padding: '3px 7px',
                        borderRadius: '6px',
                        fontSize: '0.65rem',
                        fontWeight: 700
                      }}>
                        {prod.farmCheck.overallScore}/100 • {prod.farmCheck.grade}
                      </div>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="grid-card-body" style={{ padding: '12px 10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '6px' }}>
                        <StatusBadge status={prod.category} />
                        <span className="num-mono" style={{ fontSize: '0.725rem', color: 'var(--color-ink-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{formatQuantity(prod.quantity)} {prod.unit}s</span>
                      </div>

                      <h4 className="grid-card-title" style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-canopy)', lineHeight: 1.3 }}>
                        {prod.name}
                      </h4>

                      <div className="grid-card-price price-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-canopy)', marginBottom: '4px' }}>
                        {formatPrice(prod.price)} <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>/ {prod.unit}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.725rem', color: 'var(--color-ink-muted)', marginBottom: '10px' }}>
                        <MapPin size={13} color="var(--color-canopy)" style={{ flexShrink: 0 }} />
                        <span>{cleanLocation(prod.location)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedProduct(prod)}
                      className="btn btn-cta grid-card-btn"
                      style={{ width: '100%', borderRadius: '8px', justifyContent: 'center', background: 'var(--color-turmeric)', color: 'var(--color-turmeric-text)', fontWeight: 800, whiteSpace: 'nowrap' }}
                    >
                      <Eye size={14} style={{ flexShrink: 0 }} />
                      <span>{t.viewProduct || 'View Product'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Equipment Grid */}
      {(activeCategoryTab === 'All' || activeCategoryTab === 'Equipment') && (
        <div style={{ marginTop: activeCategoryTab === 'All' ? '20px' : '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-terracotta)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tractor size={20} color="var(--color-terracotta)" />
              <span>{t.equipment} ({filteredEquipment.length})</span>
            </h3>
          </div>

          {filteredEquipment.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-ink-muted)' }}>
              No equipment matching query.
            </div>
          ) : (
            <div className="grid-responsive">
              {filteredEquipment.map(eq => (
                <div key={eq.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', border: '1px solid var(--color-sand)' }}>
                  <div className="grid-card-img" style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={eq.image} 
                      alt={eq.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      padding: '3px 6px',
                      borderRadius: '8px',
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <Star size={11} fill="#E0A72E" color="#E0A72E" />
                      <span>{eq.rating}</span>
                    </div>

                    <div style={{
                      position: 'absolute',
                      bottom: '6px',
                      left: '6px'
                    }}>
                      <StatusBadge status={eq.availability} />
                    </div>
                  </div>

                  <div className="grid-card-body" style={{ padding: '12px 10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-terracotta)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{eq.category}</span>
                      </div>

                      <h4 className="grid-card-title" style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '4px', color: 'var(--color-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {eq.name}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                        <div className="grid-card-price price-mono" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-terracotta)' }}>
                          ₹{eq.dailyPrice} <span style={{ fontSize: '0.65rem', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>{t.perDay}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem', color: 'var(--color-ink-muted)', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <MapPin size={11} color="var(--color-terracotta)" />
                        <span>{eq.location}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => onOpenEquipmentRentModal(eq)}
                      className="btn btn-terracotta grid-card-btn"
                      style={{ width: '100%', borderRadius: '8px', justifyContent: 'center' }}
                    >
                      <Tractor size={13} />
                      <span>Rent Equipment</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Produce Details Modal */}
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        currentUser={currentUser}
        onBuyProduct={onBuyProduct}
        onOpenQRReport={onOpenQRReport}
        onEditProduct={onEditProduct}
      />
    </div>
  );
};
