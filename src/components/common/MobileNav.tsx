import React from 'react';
import { Home, ShoppingBag, Sprout, Tractor, Bot, X, ShieldCheck, Activity, Package, User, LogOut, LogIn } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import type { NavTab } from './Sidebar';
import type { UserProfile } from '../../types';

interface MobileNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  onClose,
  currentUser,
  onOpenAuth,
  onLogout 
}) => {
  return (
    <>
      {/* Bottom Sticky Mobile Navigation Bar */}
      <div className="lg:hidden" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--surface-border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 0',
        zIndex: 45,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
      }}>
        <button 
          onClick={() => setActiveTab('home')}
          style={bottomTabStyle(activeTab === 'home')}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('marketplace')}
          style={bottomTabStyle(activeTab === 'marketplace')}
        >
          <ShoppingBag size={20} />
          <span>Market</span>
        </button>

        <button 
          onClick={() => setActiveTab('myfarm')}
          style={bottomTabStyle(['myfarm', 'farmcheck', 'intelligence'].includes(activeTab))}
        >
          <Sprout size={20} />
          <span>My Farm</span>
        </button>

        <button 
          onClick={() => setActiveTab('equipment')}
          style={bottomTabStyle(['equipment', 'my-equipment', 'rentals'].includes(activeTab))}
        >
          <Tractor size={20} />
          <span>Equipment</span>
        </button>

        <button 
          onClick={() => setActiveTab('farmAI')}
          style={bottomTabStyle(activeTab === 'farmAI')}
        >
          <Bot size={20} color={activeTab === 'farmAI' ? '#16A34A' : 'currentColor'} />
          <span>FarmAI</span>
        </button>
      </div>

      {/* Drawer Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 90,
          display: 'flex'
        }} onClick={onClose}>
          <div style={{
            width: '80%',
            maxWidth: '320px',
            background: 'var(--surface)',
            height: '100%',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '4px 0 24px rgba(0,0,0,0.15)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sprout size={24} color="#16A34A" />
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>FARMSETU</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LanguageSelector compact />
                <button onClick={onClose} style={{ padding: '6px', borderRadius: '8px', background: 'var(--surface-hover)' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1 }}>
              <button onClick={() => { setActiveTab('home'); onClose(); }} style={drawerItemStyle(activeTab === 'home')}>
                <Home size={18} /> {currentUser ? `${currentUser.role} Dashboard` : 'Dashboard'}
              </button>
              <button onClick={() => { setActiveTab('marketplace'); onClose(); }} style={drawerItemStyle(activeTab === 'marketplace')}>
                <ShoppingBag size={18} /> Marketplace
              </button>
              <button onClick={() => { setActiveTab('myfarm'); onClose(); }} style={drawerItemStyle(activeTab === 'myfarm')}>
                <Sprout size={18} /> My Products
              </button>
              <button onClick={() => { setActiveTab('farmcheck'); onClose(); }} style={drawerItemStyle(activeTab === 'farmcheck')}>
                <ShieldCheck size={18} /> FarmCheck Quality Verification
              </button>
              <button onClick={() => { setActiveTab('intelligence'); onClose(); }} style={drawerItemStyle(activeTab === 'intelligence')}>
                <Activity size={18} /> Weather Center
              </button>
              <button onClick={() => { setActiveTab('equipment'); onClose(); }} style={drawerItemStyle(activeTab === 'equipment')}>
                <Tractor size={18} /> Find Equipment
              </button>
              <button onClick={() => { setActiveTab('my-equipment'); onClose(); }} style={drawerItemStyle(activeTab === 'my-equipment')}>
                <Package size={18} /> My Equipment Listings
              </button>
              <button onClick={() => { setActiveTab('rentals'); onClose(); }} style={drawerItemStyle(activeTab === 'rentals')}>
                <Package size={18} /> Rental Requests
              </button>
              <button onClick={() => { setActiveTab('activity'); onClose(); }} style={drawerItemStyle(activeTab === 'activity')}>
                <Package size={18} /> My Activity & Orders
              </button>
              <button onClick={() => { setActiveTab('farmAI'); onClose(); }} style={drawerItemStyle(activeTab === 'farmAI')}>
                <Bot size={18} color="#16A34A" /> FarmAI Assistant
              </button>
              <button onClick={() => { setActiveTab('profile'); onClose(); }} style={drawerItemStyle(activeTab === 'profile')}>
                <User size={18} /> Profile Settings
              </button>
              <button onClick={() => { setActiveTab('landing'); onClose(); }} style={{ ...drawerItemStyle(activeTab === 'landing'), background: '#FAF5FF', color: 'var(--primary)' }}>
                View Public Landing Page
              </button>
            </div>

            {/* Auth Drawer Action */}
            <div style={{ paddingTop: '12px', borderTop: '1px solid var(--surface-border)' }}>
              {currentUser ? (
                <button
                  onClick={() => { onLogout(); onClose(); }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#FEE2E2',
                    color: '#991B1B',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <LogOut size={16} /> Logout Session
                </button>
              ) : (
                <button
                  onClick={() => { onOpenAuth('login'); onClose(); }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'var(--emerald)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <LogIn size={16} /> Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const bottomTabStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
  padding: '4px 8px 2px 8px',
  fontSize: '0.68rem',
  fontFamily: 'var(--font-body)',
  fontWeight: active ? 700 : 500,
  color: active ? 'var(--color-canopy)' : 'var(--color-ink-muted)',
  borderBottom: active ? '2px solid var(--color-canopy)' : '2px solid transparent',
  background: 'transparent',
  transition: 'all 0.15s ease'
});

const drawerItemStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 14px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontFamily: 'var(--font-body)',
  fontWeight: active ? 700 : 500,
  color: active ? 'var(--color-canopy)' : 'var(--color-ink)',
  background: active ? 'var(--color-sand)' : 'transparent',
  borderLeft: active ? '3px solid var(--color-canopy)' : '3px solid transparent',
  textAlign: 'left',
  width: '100%'
});
