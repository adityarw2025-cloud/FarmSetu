import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  ShoppingBag, 
  ShieldCheck, 
  Activity, 
  Tractor, 
  Bot, 
  ArrowRight,
  Sparkles,
  LogIn,
  UserPlus,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import type { NavTab } from '../common/Sidebar';
import type { UserProfile } from '../../types';
import { LanguageSelector } from '../common/LanguageSelector';
import { i18n } from '../../lib/i18n';

interface LandingPageProps {
  onNavigate: (tab: NavTab) => void;
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const [, setLang] = useState(i18n.getLanguage());

  useEffect(() => {
    return i18n.subscribe(() => setLang(i18n.getLanguage()));
  }, []);

  const t = i18n.t();

  const scrollToAbout = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, #F0FDF4 0%, #F8FAFC 300px, #FFFFFF 100%)', minHeight: '100vh', color: 'var(--text-main)' }}>
      {/* Landing Navbar - STICKY SINGLE LINE TOP HEADER */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--surface-border)',
        padding: '10px 16px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          gap: '10px'
        }}>
          {/* Left Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }} onClick={() => onNavigate('landing')}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0F4C3A 0%, #16A34A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 3px 8px rgba(22, 163, 74, 0.25)'
            }}>
              <Sprout size={18} />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>
              FARMSETU
            </span>
          </div>

          {/* Desktop Only Navigation Links */}
          <div className="hidden-mobile" style={{ alignItems: 'center', gap: '18px' }}>
            <button onClick={() => onNavigate('landing')} style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.875rem' }}>
              {t.home}
            </button>
            <button onClick={() => onNavigate('marketplace')} style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem' }}>
              {t.marketplace}
            </button>
            <button onClick={() => onNavigate('equipment')} style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem' }}>
              {t.equipment}
            </button>
            <button onClick={() => onNavigate('farmAI')} style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bot size={15} color="#16A34A" /> {t.farmAI}
            </button>
            <button onClick={scrollToAbout} style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem' }}>
              About
            </button>
          </div>

          {/* Right Auth Buttons & Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Multilingual Switcher (English / Hindi / Marathi) */}
            <LanguageSelector compact />

            {currentUser ? (
              <>
                <button 
                  onClick={() => onNavigate('home')}
                  className="btn btn-emerald btn-sm"
                  style={{ borderRadius: '20px' }}
                >
                  <UserIcon size={14} />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: '20px', color: '#EF4444', borderColor: '#FCA5A5' }}
                >
                  <LogOut size={14} />
                  <span className="hidden-mobile">{t.logout}</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onOpenAuth('login')}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: '20px', padding: '6px 12px' }}
                >
                  <LogIn size={14} />
                  <span>{t.login}</span>
                </button>
                <button 
                  onClick={() => onOpenAuth('signup')}
                  className="btn btn-emerald btn-sm"
                  style={{ borderRadius: '20px', padding: '6px 14px' }}
                >
                  <UserPlus size={14} />
                  <span>{t.signup}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        style={{
          background: 'var(--color-canopy)',
          color: 'var(--color-rice-paper)',
          padding: '48px 20px',
          borderBottom: '1px solid var(--color-canopy-dark)'
        }}
      >
        <div 
          className="hero-grid" 
          style={{
            maxWidth: '1280px',
            margin: '0 auto'
          }}
        >
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(224, 167, 46, 0.18)',
              color: 'var(--color-turmeric)',
              border: '1px solid rgba(224, 167, 46, 0.35)',
              fontSize: '0.785rem',
              fontWeight: 700,
              marginBottom: '16px'
            }}>
              <Sparkles size={14} />
              <span>Kisan AgriTech Portal</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.4rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              lineHeight: 1.12,
              color: 'var(--color-rice-paper)',
              letterSpacing: '-0.02em',
              marginBottom: '16px'
            }}>
              {t.tagline}
            </h1>

            <p style={{
              fontSize: '1rem',
              color: '#D2E5DA',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.55,
              marginBottom: '28px',
              maxWidth: '540px'
            }}>
              {t.subTagline}
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => onNavigate('marketplace')}
                className="btn btn-cta btn-lg"
                style={{
                  background: 'var(--color-turmeric)',
                  color: 'var(--color-turmeric-text)',
                  borderRadius: '10px',
                  padding: '13px 26px',
                  fontSize: '0.95rem',
                  fontWeight: 800
                }}
              >
                <ShoppingBag size={18} />
                <span>{t.exploreMarketplace}</span>
              </button>

              <button 
                onClick={() => {
                  if (currentUser) {
                    onNavigate('myfarm');
                  } else {
                    onOpenAuth('signup');
                  }
                }}
                className="btn btn-cta btn-lg"
                style={{
                  background: 'var(--color-turmeric)',
                  color: 'var(--color-turmeric-text)',
                  borderRadius: '10px',
                  padding: '13px 26px',
                  fontSize: '0.95rem',
                  fontWeight: 800
                }}
              >
                <Sprout size={18} />
                <span>{t.listHarvest}</span>
              </button>
            </div>

            {/* Stats Bar (Requirement: background var(--color-sand), border-radius 10px, no border, numbers in var(--color-canopy) & monospace) */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              marginTop: '32px', 
              padding: '16px 20px', 
              background: 'var(--color-sand)',
              borderRadius: '10px',
              border: 'none'
            }}>
              <div>
                <div className="num-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-canopy)' }}>92/100</div>
                <div style={{ fontSize: '0.725rem', color: 'var(--color-ink-muted)', fontWeight: 600 }}>Avg Quality Score</div>
              </div>
              <div style={{ width: '1px', background: '#D8CEB7' }} />
              <div>
                <div className="num-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-canopy)' }}>Zero</div>
                <div style={{ fontSize: '0.725rem', color: 'var(--color-ink-muted)', fontWeight: 600 }}>Middlemen Fee</div>
              </div>
              <div style={{ width: '1px', background: '#D8CEB7' }} />
              <div>
                <div className="num-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-canopy)' }}>Real-time</div>
                <div style={{ fontSize: '0.725rem', color: 'var(--color-ink-muted)', fontWeight: 600 }}>OpenWeather API</div>
              </div>
            </div>
          </div>

        {/* Hero Visual Card */}
        <div style={{ position: 'relative' }}>
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(15, 76, 58, 0.12)',
            border: '1px solid var(--surface-border)',
            background: 'white'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1000&q=80" 
              alt="FarmSetu Harvest" 
              style={{ width: '100%', height: 'clamp(200px, 30vh, 320px)', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px 20px', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0369A1', background: '#E0F2FE', padding: '3px 8px', borderRadius: '10px' }}>
                  FARMCHECK VERIFIED
                </span>
                <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--emerald)' }}>
                  GRADE A (92/100)
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Organic Red Tomatoes</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nashik, Maharashtra • Fresh Harvest Batch</p>
            </div>
          </div>

          {/* Floating Quality Badge */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'white',
            padding: '8px 12px',
            borderRadius: '14px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--surface-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={18} color="#16A34A" />
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>FarmCheck Quality</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Verified Produce Standard</div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* 4 Pillars Section */}
      <section style={{ background: 'var(--color-rice-paper)', padding: '56px 16px', borderTop: '1px solid var(--color-sand)', borderBottom: '1px solid var(--color-sand)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto 40px auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-sprout)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              AGRITECH PLATFORM
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.2rem)', color: 'var(--color-canopy)', fontFamily: 'var(--font-display)', fontWeight: 700, marginTop: '6px', marginBottom: '10px' }}>
              One Unified AgriTech Ecosystem
            </h2>
            <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.925rem', lineHeight: 1.5 }}>
              Combining produce trading, machine sharing, verified quality checks, and AI crop assistance under one roof.
            </p>
          </div>

          <div className="grid-responsive">
            <div className="card card-interactive" style={{ background: '#FFFFFF', border: '1px solid var(--color-sand)', padding: '24px' }} onClick={() => onNavigate('marketplace')}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--color-rice-paper)', color: 'var(--color-canopy)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px solid var(--color-sand)' }}>
                <ShoppingBag size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '6px', color: 'var(--color-canopy)' }}>Direct Produce Marketplace</h3>
              <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                Connect buyers directly with farm harvests. Transparent pricing, verified quantities, zero middleman fees.
              </p>
            </div>

            <div className="card card-interactive" style={{ background: '#FFFFFF', border: '1px solid var(--color-sand)', padding: '24px' }} onClick={() => onNavigate('farmcheck')}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--color-rice-paper)', color: 'var(--color-sprout)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px solid var(--color-sand)' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '6px', color: 'var(--color-canopy)' }}>FarmCheck Verified Quality</h3>
              <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                Evaluates weight, size uniformity, color reflectance, and defect scores to issue QR passports for verified harvests.
              </p>
            </div>

            <div className="card card-interactive" style={{ background: '#FFFFFF', border: '1px solid var(--color-sand)', padding: '24px' }} onClick={() => onNavigate('intelligence')}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--color-rice-paper)', color: 'var(--color-turmeric)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px solid var(--color-sand)' }}>
                <Activity size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '6px', color: 'var(--color-canopy)' }}>Weather & Climate Center</h3>
              <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                Access real-time OpenWeather satellite radar, 5-day regional precipitation forecasts, humidity, and temperature data.
              </p>
            </div>

            <div className="card card-interactive" style={{ background: '#FFFFFF', border: '1px solid var(--color-sand)', padding: '24px' }} onClick={() => onNavigate('equipment')}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--color-rice-paper)', color: 'var(--color-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px solid var(--color-sand)' }}>
                <Tractor size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '6px', color: 'var(--color-terracotta)' }}>Equipment Sharing Hub</h3>
              <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                Rent tractors, rotavators, sprayers, and pumps by the day or week. Earn revenue by renting out idle farm machinery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How FarmSetu Works Pipeline */}
      <section id="how-it-works-section" style={{ padding: '48px 16px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 36px auto' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-sprout)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            TRANSPARENT PIPELINE
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.1rem)', color: 'var(--color-canopy)', fontFamily: 'var(--font-display)', marginTop: '6px' }}>
            How FarmSetu Works
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          alignItems: 'center'
        }}>
          {[
            { step: '1', title: 'Farmer', desc: 'Prepares harvest batch' },
            { step: '2', title: 'List Produce', desc: 'Uploads details & price' },
            { step: '3', title: 'FarmCheck', desc: 'Quality evaluation test' },
            { step: '4', title: 'Quality Score', desc: 'Generates Grade & QR' },
            { step: '5', title: 'Marketplace', desc: 'Live verified listing' },
            { step: '6', title: 'Direct Buyer', desc: 'Instant order fulfillment' }
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '16px 12px', textAlign: 'center', background: 'white', border: '1px solid var(--color-sand)' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--color-sand)',
                color: 'var(--color-canopy)',
                fontSize: '0.8rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px auto'
              }}>
                {item.step}
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '4px', color: 'var(--color-canopy)' }}>{item.title}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={{
        background: 'var(--color-canopy)',
        color: 'var(--color-rice-paper)',
        padding: '48px 16px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-rice-paper)', marginBottom: '12px' }}>
            Ready to Connect Your Farm?
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: '24px', color: '#D2E5DA' }}>
            Join thousands of farmers and buyers using FarmSetu for direct trading, machinery sharing, and climate intelligence.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onOpenAuth('signup')}
              className="btn btn-cta btn-lg"
              style={{ background: 'var(--color-turmeric)', color: 'var(--color-turmeric-text)', borderRadius: '10px', padding: '12px 26px', fontWeight: 800 }}
            >
              Get Started Now <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => onNavigate('marketplace')}
              className="btn"
              style={{ background: 'rgba(250, 246, 236, 0.15)', color: 'var(--color-rice-paper)', borderRadius: '10px', padding: '12px 22px', fontWeight: 700 }}
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
