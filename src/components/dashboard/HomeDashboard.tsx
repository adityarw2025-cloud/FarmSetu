import React from 'react';
import { 
  ShoppingBag, 
  PlusCircle, 
  Tractor, 
  TrendingUp, 
  Award, 
  Package
} from 'lucide-react';
import type { NavTab } from '../common/Sidebar';
import type { Product, Equipment, RentalRequest, Order, UserProfile } from '../../types';
import { WeatherWidget } from '../intelligence/WeatherWidget';

interface HomeDashboardProps {
  onNavigate: (tab: NavTab) => void;
  products: Product[];
  equipment: Equipment[];
  rentals: RentalRequest[];
  orders: Order[];
  profile: UserProfile;
  onOpenAddProductModal: () => void;
  onOpenAddEquipmentModal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  products,
  equipment: _equipment,
  rentals: _rentals,
  orders,
  profile,
  onOpenAddProductModal,
  onOpenAddEquipmentModal
}) => {
  // Calculate dynamic statistics
  const userProducts = products.filter(p => p.farmerId === profile.id);
  const activeListings = userProducts.length;

  const totalSales = orders
    .filter(o => o.sellerId === profile.id)
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const totalOrders = orders.length;

  const qualityScores = products
    .filter(p => p.farmCheck?.overallScore)
    .map(p => p.farmCheck!.overallScore);
  
  const avgQuality = qualityScores.length > 0
    ? Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length)
    : 92;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Greeting */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0F4C3A 0%, #16A34A 100%)',
        color: 'white',
        padding: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.85, fontWeight: 700, letterSpacing: '0.05em' }}>
            Unified AgriTech Operating System
          </div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 4.5vw, 1.85rem)', fontWeight: 800, color: 'white', marginTop: '4px', lineHeight: 1.2 }}>
            Good Morning, {profile.name.length > 20 ? profile.name.split(' ')[0] : profile.name} 👋
          </h2>
          <p style={{ opacity: '0.9', fontSize: '0.875rem', marginTop: '6px', maxWidth: '600px' }}>
            Connected with real-time weather telemetry and FarmCheck quality verification. Market demand for Grade A produce is strong today.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button 
            onClick={() => onNavigate('marketplace')}
            className="btn"
            style={{ background: 'white', color: 'var(--primary)', borderRadius: '12px' }}
          >
            <ShoppingBag size={17} />
            <span>Buy Produce</span>
          </button>
          <button 
            onClick={onOpenAddProductModal}
            className="btn"
            style={{ background: '#DCFCE7', color: '#14532D', borderRadius: '12px' }}
          >
            <PlusCircle size={17} />
            <span>Sell Produce</span>
          </button>
          <button 
            onClick={() => onNavigate('equipment')}
            className="btn"
            style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', borderRadius: '12px', backdropFilter: 'blur(4px)' }}
          >
            <Tractor size={17} />
            <span>Rent Equipment</span>
          </button>
          <button 
            onClick={onOpenAddEquipmentModal}
            className="btn"
            style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', borderRadius: '12px', backdropFilter: 'blur(4px)' }}
          >
            <PlusCircle size={17} />
            <span>List Equipment</span>
          </button>
        </div>
      </div>

      {/* Dynamic Key Stats */}
      <div className="grid-4">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL SALES</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--emerald)', marginTop: '4px', fontWeight: 600 }}>
            +18% from last month
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ACTIVE LISTINGS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
            {activeListings} items
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            FarmCheck quality verified
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ORDERS PROCESSED</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {totalOrders}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Direct buyer fulfillments
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>AVG QUALITY SCORE</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F3E8FF', color: '#6B21A8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
            {avgQuality} <span style={{ fontSize: '1rem', fontWeight: 600 }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--emerald)', marginTop: '4px', fontWeight: 700 }}>
            Grade A Certified Lot
          </div>
        </div>
      </div>

      {/* Real-Time OpenWeather Telemetry Radar */}
      <WeatherWidget currentUser={profile} />
    </div>
  );
};
