import React from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Heart,
  Eye
} from 'lucide-react';
import type { Product, Order, UserProfile } from '../../types';
import type { NavTab } from '../common/Sidebar';

interface BuyerDashboardProps {
  currentUser: UserProfile;
  products: Product[];
  orders: Order[];
  onNavigate: (tab: NavTab) => void;
  onSelectProduct: (product: Product) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  currentUser,
  products,
  orders,
  onNavigate,
  onSelectProduct
}) => {
  // STRICT DATA ISOLATION: Filter orders placed ONLY by this logged-in buyer!
  const buyerOrders = orders.filter(o => o.buyerId === currentUser.id);

  // Recommended products from verified farmers
  const recommendedProducts = products.slice(0, 4);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Personalized Welcome Banner */}
      <div className="card" style={{
        background: 'var(--color-canopy)',
        color: 'var(--color-rice-paper)',
        padding: '32px 28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        border: '1px solid var(--color-canopy-dark)'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.85, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--color-turmeric)' }}>
            🛒 Verified Buyer Operating System
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4.5vw, 1.9rem)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-rice-paper)', marginTop: '4px', lineHeight: 1.2 }}>
            Welcome to FarmSetu, {currentUser.name} 👋
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: '6px', maxWidth: '600px', lineHeight: 1.5, color: '#D2E5DA' }}>
            Discover fresh harvests directly from verified regional farmers with FarmCheck quality certification.
          </p>
        </div>

        <button 
          onClick={() => onNavigate('marketplace')}
          className="btn btn-cta"
          style={{ background: 'var(--color-turmeric)', color: 'var(--color-turmeric-text)', borderRadius: '10px', padding: '12px 24px', fontWeight: 800 }}
        >
          <ShoppingBag size={18} />
          <span>Explore Marketplace</span>
        </button>
      </div>

      {/* Buyer Quick Stats (Requirement: background var(--color-sand), border-radius 10px, no border, numbers in var(--color-canopy) & monospace) */}
      <div className="grid-3">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink-muted)', letterSpacing: '0.05em' }}>ORDERS PLACED</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--color-rice-paper)', color: 'var(--color-canopy)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D8CEB7' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="stat-card-number" style={{ fontSize: '1.8rem' }}>
            {buyerOrders.length} <span style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>orders</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-sprout)', marginTop: '4px', fontWeight: 700 }}>
            Direct farm purchases
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink-muted)', letterSpacing: '0.05em' }}>TOTAL SPENT</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--color-rice-paper)', color: 'var(--color-canopy)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D8CEB7' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="stat-card-number" style={{ fontSize: '1.8rem' }}>
            ₹{buyerOrders.reduce((a, b) => a + b.totalPrice, 0).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)', marginTop: '4px', fontWeight: 600 }}>
            Zero middleman commission
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink-muted)', letterSpacing: '0.05em' }}>SAVED FARMS</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--color-rice-paper)', color: 'var(--color-turmeric)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D8CEB7' }}>
              <Heart size={18} />
            </div>
          </div>
          <div className="stat-card-number" style={{ fontSize: '1.8rem' }}>
            {buyerOrders.length > 0 ? 3 : 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)', marginTop: '4px', fontWeight: 600 }}>
            Verified regional producers
          </div>
        </div>
      </div>

      {/* Main Section: Buyer Orders or Empty State */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px' }}>
          My Recent Orders ({buyerOrders.length})
        </h3>

        {buyerOrders.length === 0 ? (
          /* REQUIREMENT 5: EMPTY STATE FOR NEW BUYER */
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
              background: '#E0F2FE',
              color: '#0369A1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <ShoppingBag size={28} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              Start discovering agricultural products from farmers.
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '460px', margin: '0 auto 20px auto' }}>
              Browse vine-ripened organic tomatoes, Sharbati wheat, export mangoes, and direct farm produce.
            </p>

            <button onClick={() => onNavigate('marketplace')} className="btn btn-emerald btn-lg" style={{ borderRadius: '24px' }}>
              <ShoppingBag size={20} />
              <span>Explore Marketplace</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {buyerOrders.map(o => (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{o.productName}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Quantity: {o.quantity} {o.unit} • Seller: <strong>{o.sellerName}</strong> • Date: {o.date}
                  </div>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{o.totalPrice.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Products for Buyer */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
            Recommended Direct Farm Produce
          </h3>
          <button onClick={() => onNavigate('marketplace')} className="btn btn-outline btn-sm" style={{ borderRadius: '20px' }}>
            View All Marketplace
          </button>
        </div>

        <div className="grid-responsive">
          {recommendedProducts.map(prod => (
            <div key={prod.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ height: '160px', position: 'relative' }}>
                <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {prod.farmCheck?.verified && (
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, color: '#0369A1' }}>
                    ✓ FarmCheck
                  </div>
                )}
              </div>
              <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{prod.name}</h4>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{prod.price} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/ {prod.unit}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Farmer: {prod.farmerName} • {prod.location}
                  </div>
                </div>
                <button onClick={() => onSelectProduct(prod)} className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '12px', borderRadius: '8px' }}>
                  <Eye size={14} /> View Details & Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
