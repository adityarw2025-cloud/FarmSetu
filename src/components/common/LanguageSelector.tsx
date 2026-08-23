import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { i18n, type Language } from '../../lib/i18n';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const [currentLang, setCurrentLang] = useState<Language>(i18n.getLanguage());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsub = i18n.subscribe((lang) => setCurrentLang(lang));
    return unsub;
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी (Marathi)', flag: '🚩' }
  ];

  const currentObj = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline"
        style={{
          padding: compact ? '4px 8px' : '6px 12px',
          borderRadius: '12px',
          fontSize: compact ? '0.75rem' : '0.825rem',
          fontWeight: 700,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid var(--surface-border)',
          cursor: 'pointer'
        }}
        title="Switch Language / भाषा निवडा / भाषा चुनें"
      >
        <Globe size={compact ? 14 : 16} color="var(--primary)" />
        <span>{currentObj.flag} {currentObj.label}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '110%',
          right: 0,
          background: 'white',
          borderRadius: '14px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
          border: '1px solid var(--surface-border)',
          overflow: 'hidden',
          zIndex: 150,
          minWidth: '160px',
          padding: '4px'
        }}>
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                i18n.setLanguage(item.code);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                textAlign: 'left',
                border: 'none',
                background: currentLang === item.code ? '#DCFCE7' : 'transparent',
                color: currentLang === item.code ? '#14532D' : 'var(--text-main)',
                fontSize: '0.825rem',
                fontWeight: currentLang === item.code ? 800 : 600,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span>{item.flag}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
