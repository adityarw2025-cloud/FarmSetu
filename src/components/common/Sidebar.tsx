import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ShoppingBag, 
  Sprout, 
  Tractor, 
  Package, 
  Bot, 
  User, 
  CheckCircle2, 
  Activity, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  LogOut,
  LogIn
} from 'lucide-react';
import type { UserProfile } from '../../types';
import { i18n } from '../../lib/i18n';

export type NavTab = 
  | 'home' 
  | 'marketplace' 
  | 'myfarm' 
  | 'farmcheck' 
  | 'intelligence' 
  | 'equipment' 
  | 'my-equipment' 
  | 'rentals' 
  | 'activity' 
  | 'farmAI' 
  | 'profile' 
  | 'landing';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onLogout,
  onOpenAuth 
}) => {
  const [, setLang] = useState(i18n.getLanguage());

  useEffect(() => {
    return i18n.subscribe(() => setLang(i18n.getLanguage()));
  }, []);

  const t = i18n.t();
  const isFarmer = currentUser?.role === 'Farmer';

  return (
    <aside style={{
      width: '280px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'var(--surface)',
      borderRight: '1px solid var(--surface-border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      overflowY: 'auto'
    }} className="sidebar-desktop">
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--surface-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('landing')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0F4C3A 0%, #16A34A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>
              FARMSETU
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t.subTagline.slice(0, 30)}...
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button 
          className={`sidebar-link ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
          style={navStyle(activeTab === 'home')}
        >
          <Home size={19} />
          <span>{currentUser ? `${currentUser.role} ${t.home}` : t.home}</span>
        </button>

        <button 
          className={`sidebar-link ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveTab('marketplace')}
          style={navStyle(activeTab === 'marketplace')}
        >
          <ShoppingBag size={19} />
          <span>{t.marketplace}</span>
        </button>

        {/* My Farm Group */}
        <div style={{ marginTop: '8px', marginBottom: '4px' }}>
          <div style={groupHeaderStyle}>🌱 {t.myFarm}</div>
          
          <button 
            onClick={() => setActiveTab('myfarm')}
            style={subNavStyle(activeTab === 'myfarm')}
          >
            <Sprout size={17} />
            <span>My Products</span>
            {isFarmer && <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800 }}>Farmer</span>}
          </button>

          <button 
            onClick={() => setActiveTab('farmcheck')}
            style={subNavStyle(activeTab === 'farmcheck')}
          >
            <ShieldCheck size={17} />
            <span>FarmCheck</span>
            <span style={badgeTagStyle}>Verified</span>
          </button>

          <button 
            onClick={() => setActiveTab('intelligence')}
            style={subNavStyle(activeTab === 'intelligence')}
          >
            <Activity size={17} />
            <span>Weather Center</span>
          </button>
        </div>

        {/* Equipment Group */}
        <div style={{ marginTop: '8px', marginBottom: '4px' }}>
          <div style={groupHeaderStyle}>🚜 EQUIPMENT</div>
          
          <button 
            onClick={() => setActiveTab('equipment')}
            style={subNavStyle(activeTab === 'equipment')}
          >
            <Tractor size={17} />
            <span>Find Equipment</span>
          </button>

          <button 
            onClick={() => setActiveTab('my-equipment')}
            style={subNavStyle(activeTab === 'my-equipment')}
          >
            <Package size={17} />
            <span>My Equipment</span>
          </button>

          <button 
            onClick={() => setActiveTab('rentals')}
            style={subNavStyle(activeTab === 'rentals')}
          >
            <CheckCircle2 size={17} />
            <span>Rental Requests</span>
          </button>
        </div>

        <button 
          onClick={() => setActiveTab('activity')}
          style={navStyle(activeTab === 'activity')}
        >
          <Package size={19} />
          <span>My Activity</span>
        </button>

        <button 
          onClick={() => setActiveTab('farmAI')}
          style={navStyle(activeTab === 'farmAI')}
        >
          <Bot size={19} color="#16A34A" />
          <span>FarmAI</span>
          <span style={{
            marginLeft: 'auto',
            background: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
            color: '#14532D',
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            AI
          </span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          style={navStyle(activeTab === 'profile')}
        >
          <User size={19} />
          <span>Profile</span>
        </button>

        {/* Logout / Login Footer Controls */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentUser ? (
            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                background: '#FEE2E2',
                color: '#991B1B',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogOut size={16} /> Logout Session
              </span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'var(--emerald-light)',
                color: 'var(--emerald-dark)',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogIn size={16} /> Login / Sign Up
              </span>
            </button>
          )}

          {/* Landing Switcher */}
          <button 
            onClick={() => setActiveTab('landing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'var(--surface-hover)',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <span>View Public Landing</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </nav>

      {/* Footer Tagline */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--surface-border)', background: '#FAF5FF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
          <Sparkles size={14} color="#16A34A" />
          <span>FarmSetu Ecosystem</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
          “From Farm to Buyer. Connected by Data.”
        </p>
      </div>
    </aside>
  );
};

const navStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 14px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontFamily: 'var(--font-body)',
  fontWeight: isActive ? 700 : 500,
  color: isActive ? 'var(--color-canopy)' : 'var(--color-ink-muted)',
  background: isActive ? 'var(--color-sand)' : 'transparent',
  borderLeft: isActive ? '3px solid var(--color-canopy)' : '3px solid transparent',
  width: '100%',
  textAlign: 'left',
  transition: 'all 0.15s ease'
});

const subNavStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 12px 8px 24px',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontFamily: 'var(--font-body)',
  fontWeight: isActive ? 700 : 500,
  color: isActive ? 'var(--color-canopy)' : 'var(--color-ink-muted)',
  background: isActive ? 'var(--color-sand)' : 'transparent',
  borderLeft: isActive ? '3px solid var(--color-canopy)' : '3px solid transparent',
  width: '100%',
  textAlign: 'left',
  marginBottom: '2px',
  transition: 'all 0.15s ease'
});

const groupHeaderStyle: React.CSSProperties = {
  fontSize: '0.68rem',
  fontWeight: 800,
  color: '#94A3B8',
  padding: '8px 14px 4px 14px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase'
};

const badgeTagStyle: React.CSSProperties = {
  marginLeft: 'auto',
  background: '#E0F2FE',
  color: '#0369A1',
  fontSize: '0.65rem',
  fontWeight: 800,
  padding: '2px 7px',
  borderRadius: '12px'
};
