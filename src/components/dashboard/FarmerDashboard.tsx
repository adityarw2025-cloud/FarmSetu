import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Sprout, 
  ShoppingBag, 
  Tractor, 
  Bot, 
  User, 
  TrendingUp, 
  Package, 
  MessageSquare, 
  Eye,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import type { Product, Order, UserProfile } from '../../types';
import type { NavTab } from '../common/Sidebar';
import { WeatherWidget } from '../intelligence/WeatherWidget';
import { i18n } from '../../lib/i18n';

interface FarmerDashboardProps {
  currentUser: UserProfile;
  products: Product[];
  orders: Order[];
  onNavigate: (tab: NavTab) => void;
  onOpenAddProductModal: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  currentUser,
  products,
  orders,
  onNavigate,
  onOpenAddProductModal
}) => {
  const [, setLang] = useState(i18n.getLanguage());

  useEffect(() => {
    return i18n.subscribe(() => setLang(i18n.getLanguage()));
  }, []);

  const t = i18n.t();

  // STRICT DATA ISOLATION: Filter products and sales belonging ONLY to this logged-in farmer!
  const farmerProducts = products.filter(p => p.farmerId === currentUser.id);
  const activeListings = farmerProducts.filter(p => p.quantity > 0).length;

  const farmerSales = orders.filter(o => o.sellerId === currentUser.id);
  const totalSalesAmount = farmerSales.reduce((acc, s) => acc + s.totalPrice, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Personalized Welcome Banner */}
      <div className="card" style={{
        background: 'var(--color-canopy)',
        color: 'var(--color-rice-paper)',
        padding: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        border: '1px solid var(--color-canopy-dark)'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.85, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-turmeric)' }}>
            🌾 {t.tagline}
          </div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 4.5vw, 1.85rem)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-rice-paper)', marginTop: '4px', lineHeight: 1.2 }}>
            {t.welcomeBack}, {currentUser.name.length > 20 ? currentUser.name.split(' ')[0] : currentUser.name} 👋
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.875rem', marginTop: '6px', maxWidth: '600px', color: '#D2E5DA' }}>
            {t.subTagline}
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button 
            onClick={onOpenAddProductModal}
            className="btn btn-cta"
            style={{ background: 'var(--color-turmeric)', color: 'var(--color-turmeric-text)', borderRadius: '10px', fontWeight: 800 }}
          >
            <PlusCircle size={17} />
            <span>{t.listHarvest}</span>
          </button>
          <button 
            onClick={() => onNavigate('myfarm')}
            className="btn"
            style={{ background: 'rgba(250, 246, 236, 0.15)', color: 'var(--color-rice-paper)', borderRadius: '10px', fontWeight: 700 }}
          >
            <Sprout size={17} />
            <span>{t.myFarm}</span>
          </button>
          <button 
            onClick={() => onNavigate('equipment')}
            className="btn"
            style={{ background: 'rgba(250, 246, 236, 0.15)', color: 'var(--color-rice-paper)', borderRadius: '10px', fontWeight: 700 }}
          >
            <Tractor size={17} />
            <span>{t.equipment}</span>
          </button>
        </div>
      </div>

      {/* Personalized Statistics Cards (Requirement: background var(--color-sand), border-radius 10px, no border, numbers in var(--color-canopy) & monospace) */}
      <div className="grid-4">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink-muted)', letterSpacing: '0.05em' }}>TOTAL LISTINGS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--color-rice-paper)', color: 'var(--color-canopy)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D8CEB7' }}>
              <Package size={18} />
            </div>
          </div>
          <div className="stat-card-number" style={{ fontSize: '1.75rem' }}>
            {farmerProducts.length} <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>items</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-sprout)', marginTop: '4px', fontWeight: 700 }}>
            {activeListings} active stock listings
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink-muted)', letterSpacing: '0.05em' }}>TOTAL REVENUE</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--color-rice-paper)', color: 'var(--color-canopy)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D8CEB7' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="stat-card-number" style={{ fontSize: '1.75rem' }}>
            ₹{totalSalesAmount.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            From direct buyer orders
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>BUYER INQUIRIES</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {farmerSales.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Harvest purchase requests
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>PRODUCT VIEWS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F3E8FF', color: '#6B21A8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {farmerProducts.length * 14}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--emerald)', marginTop: '4px', fontWeight: 600 }}>
            Marketplace impressions
          </div>
        </div>
      </div>

      {/* Real-Time Weather Widget */}
      <WeatherWidget currentUser={currentUser} />

      {/* Main Farmer Section: Listings or Empty State */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
            My Crop Listings ({farmerProducts.length})
          </h3>
          {farmerProducts.length > 0 && (
            <button 
              onClick={() => onNavigate('myfarm')}
              className="btn btn-outline btn-sm"
              style={{ borderRadius: '20px' }}
            >
              Manage All Products
            </button>
          )}
        </div>

        {farmerProducts.length === 0 ? (
          /* REQUIREMENT 5: EMPTY STATE FOR NEW FARMER */
          <div style={{
            padding: '50px 20px',
            textAlign: 'center',
            background: 'var(--surface-hover)',
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed var(--surface-border)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Sprout size={28} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              No products listed yet.
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '460px', margin: '0 auto 20px auto' }}>
              Start listing your freshly harvested produce on FarmSetu to connect directly with verified buyers.
            </p>

            <button onClick={onOpenAddProductModal} className="btn btn-emerald btn-lg" style={{ borderRadius: '24px' }}>
              <Plus size={20} />
              <span>Add Your First Product</span>
            </button>
          </div>
        ) : (
          /* Recent Products List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {farmerProducts.map(p => (
              <div key={p.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'var(--surface-hover)',
                borderRadius: 'var(--radius-md)',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={p.image} alt={p.name} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{p.name}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Quantity: {p.quantity} {p.unit}s • Harvested: {p.harvestDate}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{p.price} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/ {p.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Buyer Inquiries / Orders */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '14px' }}>
          Recent Buyer Inquiries & Orders ({farmerSales.length})
        </h3>

        {farmerSales.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No buyer inquiries received yet. Once buyers order your produce, requests will appear here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {farmerSales.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surface-hover)', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{s.productName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Buyer: <strong>{s.buyerName}</strong> • {s.quantity} {s.unit}s</div>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--emerald)' }}>
                  +₹{s.totalPrice.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
