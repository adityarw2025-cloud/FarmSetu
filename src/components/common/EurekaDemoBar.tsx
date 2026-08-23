import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import type { NavTab } from './Sidebar';

interface EurekaDemoBarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenProductModal?: () => void;
  onOpenEquipmentModal?: () => void;
}

export const EurekaDemoBar: React.FC<EurekaDemoBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProductModal,
  onOpenEquipmentModal
}) => {
  const steps: { id: NavTab; label: string; action?: () => void }[] = [
    { id: 'landing', label: '1. Landing' },
    { id: 'marketplace', label: '2. Marketplace' },
    { id: 'marketplace', label: '3. Produce Details', action: onOpenProductModal },
    { id: 'farmcheck', label: '4. FarmCheck Verification' },
    { id: 'myfarm', label: '5. My Farm CRUD' },
    { id: 'intelligence', label: '6. Weather Center' },
    { id: 'farmAI', label: '7. FarmAI Assistant' },
    { id: 'equipment', label: '8. Equipment Hub' },
    { id: 'equipment', label: '9. Equipment Details & Rental', action: onOpenEquipmentModal },
    { id: 'activity', label: '10. My Activity & Rentals' }
  ];

  return (
    <div className="eureka-pipeline-bar">
      <div className="eureka-pipeline-title">
        <Sparkles size={14} />
        <span>Eureka Demo Flow:</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {steps.map((s, idx) => {
          const isActive = activeTab === s.id;
          return (
            <React.Fragment key={idx}>
              <button
                className={`eureka-step-chip ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(s.id);
                  if (s.action) s.action();
                }}
              >
                {s.label}
              </button>
              {idx < steps.length - 1 && (
                <ChevronRight size={12} color="#6B7280" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
