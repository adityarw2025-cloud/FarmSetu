import React, { useState } from 'react';
import { User, MapPin, CheckCircle2, Phone, Mail, Edit } from 'lucide-react';
import type { UserProfile as UserProfileType, Product, Equipment } from '../../types';
import { Modal } from '../common/Modal';
import { ImageUploader } from '../common/ImageUploader';
import { authService } from '../../services/authService';

interface UserProfileProps {
  profile: UserProfileType | null;
  products: Product[];
  equipment: Equipment[];
  onUpdateProfile: (updates: Partial<UserProfileType>) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const UserProfileView: React.FC<UserProfileProps> = ({
  profile,
  products,
  equipment,
  onUpdateProfile,
  onOpenAuth
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    farmSize: profile?.farmSize || '',
    avatar: profile?.avatar || ''
  });

  if (!profile) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <User size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
          Authentication Required
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Please log in or create an account to view and manage your profile.
        </p>
        <button onClick={() => onOpenAuth('login')} className="btn btn-emerald btn-lg" style={{ borderRadius: '24px' }}>
          Sign In Now
        </button>
      </div>
    );
  }

  const myProductsCount = products.filter(p => p.farmerId === profile.id).length;
  const myEquipCount = equipment.filter(e => e.ownerId === profile.id).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    authService.updateProfile(formData);
    onUpdateProfile(formData);
    setIsEditOpen(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Profile Header Card */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--emerald)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{profile.name}</h2>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: profile.role === 'Farmer' ? '#14532D' : '#0369A1',
                  background: profile.role === 'Farmer' ? '#DCFCE7' : '#E0F2FE',
                  padding: '2px 10px',
                  borderRadius: '12px'
                }}>
                  {profile.role} Account
                </span>
                {profile.isVerified && (
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <CheckCircle2 size={14} /> Verified
                  </span>
                )}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <MapPin size={15} color="var(--primary)" /> {profile.location} • <Mail size={15} /> {profile.email} • <Phone size={15} /> {profile.phone}
              </p>
            </div>
          </div>

          <button 
            onClick={() => { setFormData(profile); setIsEditOpen(true); }}
            className="btn btn-outline"
            style={{ borderRadius: '24px' }}
          >
            <Edit size={16} /> Edit Profile
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid-4" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--surface-border)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACCOUNT ROLE</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{profile.role}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>MEMBER SINCE</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{profile.joinedDate}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PRODUCTS LISTED</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{myProductsCount} Crops</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>EQUIPMENT LISTED</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{myEquipCount} Machinery</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile Details">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="grid-2">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="form-input" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="grid-2">
            <div className="form-group">
              <label className="form-label">Location / City</label>
              <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Farm Size</label>
              <input type="text" value={formData.farmSize} onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })} className="form-input" />
            </div>
          </div>

          <ImageUploader 
            value={formData.avatar}
            onChange={(url) => setFormData({ ...formData, avatar: url })}
            label="Profile Photo"
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsEditOpen(false)} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-emerald">Save Profile Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
