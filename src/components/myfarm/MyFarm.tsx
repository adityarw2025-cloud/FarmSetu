import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ShieldCheck, 
  Package, 
  TrendingUp, 
  Sprout, 
  AlertTriangle,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import type { Product, ProduceCategory, UserProfile } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { ImageUploader } from '../common/ImageUploader';

interface MyFarmProps {
  products: Product[];
  currentUser: UserProfile | null;
  onAddProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'farmerId' | 'farmerName' | 'farmerVerified'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onRemoveProduct: (id: string) => void;
  onRunFarmCheck: (product: Product) => void;
}

export const MyFarm: React.FC<MyFarmProps> = ({
  products,
  currentUser,
  onAddProduct,
  onUpdateProduct,
  onRemoveProduct,
  onRunFarmCheck
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables' as ProduceCategory,
    price: 35,
    unit: 'kg',
    quantity: 500,
    location: currentUser?.location || 'Nashik, Maharashtra',
    description: '',
    harvestDate: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
  });

  const myProducts = products.filter(p => currentUser && p.farmerId === currentUser.id);

  const openAddModal = () => {
    setFormData({
      name: '',
      category: 'Vegetables',
      price: 35,
      unit: 'kg',
      quantity: 500,
      location: currentUser?.location || '',
      description: '',
      harvestDate: new Date().toISOString().split('T')[0],
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      unit: prod.unit,
      quantity: prod.quantity,
      location: prod.location,
      description: prod.description,
      harvestDate: prod.harvestDate,
      image: prod.image
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, formData);
    } else {
      onAddProduct(formData);
    }
    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  const confirmDelete = () => {
    if (deletingProductId) {
      onRemoveProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Actions */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sprout size={24} color="#16A34A" />
            <span>My Farm Listings ({myProducts.length})</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage your produce inventory, prices, quantities, and run FarmCheck quality verification.
          </p>
        </div>

        <button 
          onClick={openAddModal}
          className="btn btn-emerald btn-lg"
          style={{ borderRadius: '24px' }}
        >
          <Plus size={20} />
          <span>Add New Product Listing</span>
        </button>
      </div>

      {/* Products Table / Grid */}
      {myProducts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Farm Products Listed Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            List your freshly harvested vegetables, grains, or fruits to reach buyers instantly.
          </p>
          <button onClick={openAddModal} className="btn btn-emerald">
            <Plus size={18} />
            <span>List Your First Crop</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {myProducts.map(prod => (
            <div key={prod.id} className="card card-interactive" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 20px' }}>
              {/* Product Thumbnail & Main Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 300px' }}>
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <StatusBadge status={prod.category} />
                    {prod.farmCheck ? (
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: '10px' }}>
                        {prod.farmCheck.overallScore}/100 • {prod.farmCheck.grade}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '10px' }}>
                        Pending Check
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{prod.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Harvested: {prod.harvestDate} • Location: {prod.location}
                  </div>
                </div>
              </div>

              {/* Price & Stock Stats */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Price</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{prod.price} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/ {prod.unit}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Available Stock</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {prod.quantity} {prod.unit}s
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => onRunFarmCheck(prod)}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: '20px' }}
                >
                  <ShieldCheck size={15} />
                  <span>{prod.farmCheck ? 'Re-Run FarmCheck' : 'Run FarmCheck'}</span>
                </button>

                <button 
                  onClick={() => openEditModal(prod)}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: '20px' }}
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>

                <button 
                  onClick={() => setDeletingProductId(prod.id)}
                  className="btn btn-danger btn-sm"
                  style={{ borderRadius: '20px' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title={editingProduct ? 'Edit Product Listing' : 'Add New Produce Listing'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Organic Red Tomatoes"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProduceCategory })}
                className="form-select"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Pulses">Pulses</option>
                <option value="Spices">Spices</option>
                <option value="Organic">Organic</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Unit</label>
              <select 
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="form-select"
              >
                <option value="kg">kg</option>
                <option value="quintal">quintal (100 kg)</option>
                <option value="ton">ton (1000 kg)</option>
                <option value="dozen">dozen</option>
                <option value="crate">crate</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} className="grid-2">
            <div className="form-group">
              <label className="form-label">Price per unit (₹)</label>
              <input 
                type="number" 
                required
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quantity Available</label>
              <input 
                type="number" 
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} className="grid-2">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input 
                type="text" 
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Harvest Date</label>
              <input 
                type="date" 
                required
                value={formData.harvestDate}
                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <ImageUploader 
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Produce Image"
            required
          />

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              rows={2}
              required
              placeholder="Describe crop quality, farming methods, shelf life..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button 
              type="button" 
              onClick={() => setIsAddModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-emerald"
            >
              {editingProduct ? 'Save Changes' : 'Publish Produce Listing'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={Boolean(deletingProductId)} 
        onClose={() => setDeletingProductId(null)} 
        title="Confirm Delete Listing"
        maxWidth="450px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <AlertTriangle size={24} />
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
            Are you sure you want to remove this product listing from the marketplace?
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => setDeletingProductId(null)} className="btn btn-outline">
              Cancel
            </button>
            <button onClick={confirmDelete} className="btn btn-danger">
              Remove Listing
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
