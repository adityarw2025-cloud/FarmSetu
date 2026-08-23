import React from 'react';
import { 
  CloudRain, 
  Droplets, 
  TrendingUp, 
  Sprout
} from 'lucide-react';
import type { UserProfile } from '../../types';
import { WeatherWidget } from './WeatherWidget';

interface FarmIntelligenceProps {
  profile: UserProfile | null;
  onToggleHardware?: () => void;
}

export const FarmIntelligence: React.FC<FarmIntelligenceProps> = ({
  profile
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Header */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
        color: 'white',
        padding: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Satellite & OpenWeather Radar
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginTop: '4px' }}>
            Weather & Climate Intelligence Center
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginTop: '4px' }}>
            Location: <strong>{profile?.location || 'Nashik, Maharashtra'}</strong> • Role: <strong>{profile?.role || 'Visitor'}</strong>
          </p>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: '#86EFAC' }}>
          ✓ OpenWeather API Radar Active
        </div>
      </div>

      {/* Real-Time OpenWeather Radar Component */}
      <WeatherWidget currentUser={profile} />

      {/* Actionable Weather Insights Grid */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '14px' }}>
          Actionable Weather & Crop Insights
        </h3>

        <div className="grid-responsive">
          <div className="card" style={{ borderLeft: '4px solid #0284C7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CloudRain size={20} color="#0284C7" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>🌧️ Rain Alert</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Check the 5-day OpenWeather precipitation forecast above before scheduling pesticide application or crop harvesting.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #16A34A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Droplets size={20} color="#16A34A" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>💧 Irrigation Planning</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Monitor local humidity & rain probability to optimize drip irrigation schedules and save water resources.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #F59E0B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sprout size={20} color="#F59E0B" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>🌱 Crop Advisory</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              High humidity index increases risk of leaf blight for vegetables. Apply bio-fungicide spray if humidity exceeds 80%.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #8B5CF6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <TrendingUp size={20} color="#8B5CF6" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>📈 Market Premium</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Grade A FarmCheck verified produce receives a +12-15% price premium in regional buyer markets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
