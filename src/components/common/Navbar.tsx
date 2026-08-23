import React, { useState, useEffect } from 'react';
import { Menu, ShieldCheck, LogOut, LogIn, UserPlus } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { i18n } from '../../lib/i18n';
import type { NavTab } from './Sidebar';
import type { UserProfile } from '../../types';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  profile: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenAuth,
  onLogout,
  onOpenMobileMenu
}) => {
  const [, setLang] = useState(i18n.getLanguage());

  useEffect(() => {
    return i18n.subscribe(() => setLang(i18n.getLanguage()));
  }, []);

  const t = i18n.t();

  const getTitle = () => {
    switch (activeTab) {
      case 'home': return profile ? `${profile.role} ${t.home}` : t.home;
      case 'marketplace': return t.marketplace;
      case 'myfarm': return t.myFarm;
      case 'farmcheck': return t.qualityPassport;
      case 'intelligence': return t.weatherForecast;
      case 'equipment': return t.equipment;
      case 'my-equipment': return t.equipment;
      case 'rentals': return t.rentMachinery;
      case 'activity': return 'My Activity & Orders';
      case 'farmAI': return t.farmAI;
      case 'profile': return 'User Profile & Settings';
      case 'landing': return 'FarmSetu';
      default: return 'FarmSetu';
    }
  };

  return (
    <header className="glass-header" style={{ padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50, background: 'var(--color-canopy)', borderBottom: '1px solid var(--color-canopy-dark)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
        {/* Left Mobile Menu Toggle + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
          <button 
            className="mobile-menu-btn"
            onClick={onOpenMobileMenu}
            style={{
              padding: '8px',
              borderRadius: '10px',
              border: '1px solid var(--color-canopy-dark)',
              background: 'var(--color-canopy-dark)',
              color: 'var(--color-rice-paper)',
              flexShrink: 0
            }}
            aria-label="Open Navigation Drawer"
          >
            <Menu size={19} />
          </button>

          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{
              fontSize: 'clamp(1.05rem, 4vw, 1.3rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-rice-paper)',
              margin: 0,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {getTitle()}
            </h1>
            <p className="hidden-mobile" style={{ fontSize: '0.75rem', color: '#D2E5DA', fontWeight: 500, margin: 0, fontFamily: 'var(--font-body)' }}>
              {profile ? `Authenticated as ${profile.name} (${profile.role}) • ${profile.location}` : 'Visitor Mode'}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Desktop FarmCheck Direct Trigger */}
          <button 
            onClick={() => setActiveTab('farmcheck')}
            className="btn hidden-mobile"
            style={{ borderRadius: '20px', fontWeight: 700, background: 'rgba(250, 246, 236, 0.15)', color: 'var(--color-rice-paper)' }}
          >
            <ShieldCheck size={15} />
            <span>FarmCheck</span>
          </button>

          {/* Multilingual Language Switcher */}
          <LanguageSelector compact />

          {/* Auth State: Profile / Logout VS Login / Signup */}
          {profile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                onClick={() => setActiveTab('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px 4px 4px',
                  borderRadius: '24px',
                  border: '1px solid var(--color-canopy-dark)',
                  background: 'var(--color-canopy-dark)',
                  color: 'var(--color-rice-paper)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-rice-paper)' }} className="hidden-mobile">
                  {profile.name.split(' ')[0]}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  background: profile.role === 'Farmer' ? 'var(--color-sprout)' : 'var(--color-terracotta)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }} className="hidden-mobile">
                  {profile.role}
                </span>
              </div>

              {/* Real Logout Button */}
              <button 
                onClick={onLogout}
                className="btn btn-outline btn-sm"
                style={{ borderRadius: '20px', padding: '6px 12px', color: '#FCA5A5', borderColor: '#FCA5A5', background: 'transparent' }}
                title="Log out of session"
              >
                <LogOut size={15} />
                <span className="hidden-mobile">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => onOpenAuth('login')}
                className="btn btn-sm"
                style={{ borderRadius: '20px', padding: '6px 14px', fontWeight: 700, color: 'var(--color-rice-paper)', background: 'rgba(250, 246, 236, 0.12)' }}
              >
                <LogIn size={14} />
                <span>Login</span>
              </button>
              <button 
                onClick={() => onOpenAuth('signup')}
                className="btn btn-cta btn-sm"
                style={{ borderRadius: '20px', padding: '6px 16px', fontWeight: 800, background: 'var(--color-turmeric)', color: 'var(--color-turmeric-text)' }}
              >
                <UserPlus size={14} />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
