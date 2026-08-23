import React, { useState } from 'react';
import { 
  Tractor, 
  Plus, 
  Search, 
  MapPin, 
  Star, 
  Package, 
  Trash2,
  Check,
  X
} from 'lucide-react';
import type { Equipment, EquipmentCategory, RentalRequest, UserProfile } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { ImageUploader } from '../common/ImageUploader';

interface EquipmentHubProps {
  equipment: Equipment[];
  rentals: RentalRequest[];
  currentUser: UserProfile | null;
  activeSubTab?: 'find' | 'my-equipment' | 'rentals';
  onAddEquipment: (data: Omit<Equipment, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'rating'>) => void;
  onUpdateEquipment: (id: string, updates: Partial<Equipment>) => void;
  onRemoveEquipment: (id: string) => void;
  onRequestRental: (req: { equipmentId: string; startDate: string; endDate: string; durationDays: number; totalPrice: number; message?: string }) => void;
  onUpdateRentalStatus: (id: string, status: RentalRequest['status']) => void;
}

export const EquipmentHub: React.FC<EquipmentHubProps> = ({
  equipment,
  rentals,
  currentUser,
  activeSubTab = 'find',
  onAddEquipment,
  onUpdateEquipment,
  onRemoveEquipment,
  onRequestRental,
  onUpdateRentalStatus
}) => {
  const [subTab, setSubTab] = useState<'find' | 'my-equipment' | 'rentals'>(activeSubTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal States
  const [rentingEquipment, setRentingEquipment] = useState<Equipment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  // Rental Form State
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [rentalMessage, setRentalMessage] = useState('');
  const [rentalSubmitted, setRentalSubmitted] = useState(false);

  // Add Equipment Form State
  const [equipForm, setEquipForm] = useState({
    name: '',
    category: 'Tractors' as EquipmentCategory,
    dailyPrice: 1200,
    weeklyPrice: 7500,
    monthlyPrice: 28000,
    location: currentUser?.location || 'Nashik, Maharashtra',
    description: '',
    condition: 'Excellent' as 'Excellent' | 'Good' | 'Fair',
    year: 2024,
    availability: 'Available' as 'Available' | 'Rented' | 'Maintenance',
    image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'
  });

  // Calculate rental duration in days
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 3600 * 24)));
  const estimatedPrice = rentingEquipment
    ? durationDays >= 7 
      ? Math.ceil(durationDays / 7) * rentingEquipment.weeklyPrice
      : durationDays * rentingEquipment.dailyPrice
    : 0;

  const handleRentalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rentingEquipment) return;
    onRequestRental({
      equipmentId: rentingEquipment.id,
      startDate,
      endDate,
      durationDays,
      totalPrice: estimatedPrice,
      message: rentalMessage
    });
    setRentalSubmitted(true);
    setTimeout(() => {
      setRentalSubmitted(false);
      setRentingEquipment(null);
    }, 1800);
  };

  const handleEquipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEquipment) {
      onUpdateEquipment(editingEquipment.id, equipForm);
    } else {
      onAddEquipment(equipForm);
    }
    setIsAddModalOpen(false);
    setEditingEquipment(null);
  };

  const openAddEquipModal = () => {
    setEquipForm({
      name: '',
      category: 'Tractors',
      dailyPrice: 1200,
      weeklyPrice: 7500,
      monthlyPrice: 28000,
      location: currentUser?.location || 'Nashik, Maharashtra',
      description: '',
      condition: 'Excellent',
      year: 2024,
      availability: 'Available',
      image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'
    });
    setEditingEquipment(null);
    setIsAddModalOpen(true);
  };

  const myEquipmentList = equipment.filter(e => currentUser && e.ownerId === currentUser.id);

  const filteredEquipment = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner Header */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '24px', borderLeft: '4px solid var(--color-terracotta)' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-terracotta)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Tractor size={24} color="var(--color-terracotta)" />
            <span>Equipment Marketplace & Rental Hub</span>
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
            Find, rent, or list tractors, rotavators, sprayers, and pumps. Connect directly with owners.
          </p>
        </div>

        <button 
          onClick={openAddEquipModal}
          className="btn btn-terracotta btn-lg"
          style={{ borderRadius: '10px', fontWeight: 800 }}
        >
          <Plus size={20} />
          <span>List Equipment for Rent</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="tabs-nav">
        <button 
          className={`tab-btn ${subTab === 'find' ? 'active' : ''}`}
          onClick={() => setSubTab('find')}
          style={{ color: subTab === 'find' ? 'var(--color-terracotta)' : undefined, borderBottomColor: subTab === 'find' ? 'var(--color-terracotta)' : undefined }}
        >
          🚜 Find Equipment
        </button>
        <button 
          className={`tab-btn ${subTab === 'my-equipment' ? 'active' : ''}`}
          onClick={() => setSubTab('my-equipment')}
          style={{ color: subTab === 'my-equipment' ? 'var(--color-terracotta)' : undefined, borderBottomColor: subTab === 'my-equipment' ? 'var(--color-terracotta)' : undefined }}
        >
          📦 My Equipment ({myEquipmentList.length})
        </button>
        <button 
          className={`tab-btn ${subTab === 'rentals' ? 'active' : ''}`}
          onClick={() => setSubTab('rentals')}
          style={{ color: subTab === 'rentals' ? 'var(--color-terracotta)' : undefined, borderBottomColor: subTab === 'rentals' ? 'var(--color-terracotta)' : undefined }}
        >
          📋 Rental Requests ({rentals.length})
        </button>
      </div>

      {/* SUBTAB 1: FIND EQUIPMENT */}
      {subTab === 'find' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} color="var(--color-ink-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder="Search tractors, rotavators, sprayers, pumps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '42px', borderRadius: '10px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {['All', 'Tractors', 'Rotavators', 'Pumps', 'Sprayers', 'Harvesters'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn ${selectedCategory === cat ? 'btn-terracotta' : 'btn-outline'} btn-sm`}
                  style={{ borderRadius: '20px' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid-responsive">
            {filteredEquipment.map(eq => (
              <div key={eq.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <div className="grid-card-img" style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                  <img src={eq.image} alt={eq.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(255, 255, 255, 0.95)', padding: '3px 6px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Star size={11} fill="#F59E0B" color="#F59E0B" />
                    <span>{eq.rating}</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '6px', left: '6px' }}>
                    <StatusBadge status={eq.availability} />
                  </div>
                </div>

                <div className="grid-card-body" style={{ padding: '12px 10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{eq.category} • Year {eq.year}</div>
                    <h3 className="grid-card-title" style={{ fontSize: '0.95rem', fontWeight: 700, margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{eq.name}</h3>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                      <div className="grid-card-price" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>₹{eq.dailyPrice} <span style={{ fontSize: '0.65rem', fontWeight: 500 }}>/day</span></div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <MapPin size={11} color="var(--primary)" />
                      <span>{eq.location}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setRentingEquipment(eq)}
                    className="btn btn-emerald grid-card-btn"
                    style={{ width: '100%', borderRadius: '8px', justifyContent: 'center' }}
                  >
                    <Tractor size={13} />
                    <span>Rent Machine</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: MY EQUIPMENT */}
      {subTab === 'my-equipment' && (
        <div>
          {myEquipmentList.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
              <Package size={42} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No Equipment Listed Yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                Earn rental income from your idle tractor, rotavator, or sprayers.
              </p>
              <button onClick={openAddEquipModal} className="btn btn-emerald">
                <Plus size={18} />
                <span>List Your Equipment</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {myEquipmentList.map(eq => (
                <div key={eq.id} className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={eq.image} alt={eq.name} style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <StatusBadge status={eq.availability} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{eq.category}</span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{eq.name}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location: {eq.location}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Daily Rate</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>₹{eq.dailyPrice}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Weekly Rate</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--emerald)' }}>₹{eq.weeklyPrice}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => onUpdateEquipment(eq.id, { availability: eq.availability === 'Available' ? 'Rented' : 'Available' })}
                      className="btn btn-outline btn-sm"
                    >
                      Toggle Availability
                    </button>
                    <button onClick={() => onRemoveEquipment(eq.id)} className="btn btn-danger btn-sm">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: RENTAL REQUESTS */}
      {subTab === 'rentals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {rentals.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No rental booking requests found.
            </div>
          ) : (
            rentals.map(r => {
              const isOwner = currentUser ? r.ownerId === currentUser.id : false;
              return (
                <div key={r.id} className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={r.equipmentImage} alt={r.equipmentName} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <StatusBadge status={r.status} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {r.id}</span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{r.equipmentName}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Dates: {r.startDate} to {r.endDate} ({r.durationDays} Days) • Requester: <strong>{r.requesterName}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{r.totalPrice.toLocaleString('en-IN')}
                  </div>

                  {/* Owner Accept / Decline Controls */}
                  {isOwner && r.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => onUpdateRentalStatus(r.id, 'Confirmed')} className="btn btn-emerald btn-sm">
                        <Check size={14} /> Accept
                      </button>
                      <button onClick={() => onUpdateRentalStatus(r.id, 'Declined')} className="btn btn-danger btn-sm">
                        <X size={14} /> Decline
                      </button>
                    </div>
                  ) : (
                    <StatusBadge status={r.status} />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Rent Equipment Booking Modal */}
      <Modal 
        isOpen={Boolean(rentingEquipment)} 
        onClose={() => setRentingEquipment(null)} 
        title={`Request Rental - ${rentingEquipment?.name}`}
      >
        {rentalSubmitted ? (
          <div style={{ background: '#DCFCE7', color: '#14532D', padding: '20px', borderRadius: '14px', textAlign: 'center', fontWeight: 700 }}>
            ✓ Rental Request Sent Successfully! The equipment owner has been notified.
          </div>
        ) : (
          <form onSubmit={handleRentalSubmit}>
            <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', background: 'var(--surface-hover)', padding: '12px', borderRadius: '12px' }}>
              <img src={rentingEquipment?.image} alt={rentingEquipment?.name} style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{rentingEquipment?.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Rate: ₹{rentingEquipment?.dailyPrice}/day • ₹{rentingEquipment?.weeklyPrice}/week
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="grid-2">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Rental Purpose / Note to Owner</label>
              <textarea rows={2} placeholder="Specify field work required (e.g., 3 days plowing before monsoon sowing)" value={rentalMessage} onChange={(e) => setRentalMessage(e.target.value)} className="form-textarea" />
            </div>

            <div style={{ padding: '14px', background: 'var(--emerald-light)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--emerald-dark)', fontWeight: 700 }}>ESTIMATED TOTAL RENTAL PRICE</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--emerald-dark)' }}>Duration: {durationDays} Days</div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald-dark)' }}>
                ₹{estimatedPrice.toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setRentingEquipment(null)} className="btn btn-outline">Cancel</button>
              <button type="submit" className="btn btn-emerald">Submit Rental Booking</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add / Edit Equipment Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={editingEquipment ? 'Edit Equipment' : 'List Equipment for Rental'}>
        <form onSubmit={handleEquipSubmit}>
          <div className="form-group">
            <label className="form-label">Equipment Name</label>
            <input type="text" required placeholder="e.g. Mahindra 575 DI Tractor (45 HP)" value={equipForm.name} onChange={(e) => setEquipForm({ ...equipForm, name: e.target.value })} className="form-input" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select value={equipForm.category} onChange={(e) => setEquipForm({ ...equipForm, category: e.target.value as EquipmentCategory })} className="form-select">
                <option value="Tractors">Tractors</option>
                <option value="Rotavators">Rotavators</option>
                <option value="Pumps">Pumps</option>
                <option value="Sprayers">Sprayers</option>
                <option value="Harvesters">Harvesters</option>
                <option value="Tillers">Tillers</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Condition</label>
              <select value={equipForm.condition} onChange={(e) => setEquipForm({ ...equipForm, condition: e.target.value as 'Excellent' | 'Good' | 'Fair' })} className="form-select">
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="grid-2">
            <div className="form-group">
              <label className="form-label">Daily Price (₹)</label>
              <input type="number" required min="1" value={equipForm.dailyPrice} onChange={(e) => setEquipForm({ ...equipForm, dailyPrice: Number(e.target.value) })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Weekly Price (₹)</label>
              <input type="number" required min="1" value={equipForm.weeklyPrice} onChange={(e) => setEquipForm({ ...equipForm, weeklyPrice: Number(e.target.value) })} className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" required value={equipForm.location} onChange={(e) => setEquipForm({ ...equipForm, location: e.target.value })} className="form-input" />
          </div>

          <ImageUploader 
            value={equipForm.image}
            onChange={(url) => setEquipForm({ ...equipForm, image: url })}
            label="Equipment Photo"
            required
          />

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea rows={2} required placeholder="State HP rating, blade condition, attachments included..." value={equipForm.description} onChange={(e) => setEquipForm({ ...equipForm, description: e.target.value })} className="form-textarea" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-emerald">Publish Equipment Listing</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
