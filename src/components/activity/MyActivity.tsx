import React, { useState } from 'react';
import type { Order, RentalRequest, UserProfile } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface MyActivityProps {
  orders: Order[];
  rentals: RentalRequest[];
  currentUser: UserProfile | null;
}

export const MyActivity: React.FC<MyActivityProps> = ({ orders, rentals, currentUser }) => {
  const [tab, setTab] = useState<'orders' | 'sales' | 'rentals'>('orders');

  const myOrders = orders.filter(o => currentUser && o.buyerId === currentUser.id);
  const mySales = orders.filter(o => currentUser && o.sellerId === currentUser.id);
  const myRentals = rentals.filter(r => currentUser && (r.requesterId === currentUser.id || r.ownerId === currentUser.id));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>
          My Platform Activity Tracker
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Track your active produce purchases, harvest sales, and machinery rentals.
        </p>

        <div className="tabs-nav" style={{ marginTop: '16px' }}>
          <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            🛒 Orders Placed ({myOrders.length})
          </button>
          <button className={`tab-btn ${tab === 'sales' ? 'active' : ''}`} onClick={() => setTab('sales')}>
            📈 Harvest Sales ({mySales.length})
          </button>
          <button className={`tab-btn ${tab === 'rentals' ? 'active' : ''}`} onClick={() => setTab('rentals')}>
            🚜 Equipment Rentals ({myRentals.length})
          </button>
        </div>
      </div>

      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {myOrders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No orders placed yet. Explore the produce marketplace to buy directly from farmers.
            </div>
          ) : (
            myOrders.map(o => (
              <div key={o.id} className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <StatusBadge status={o.status} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order ID: {o.id} • Date: {o.date}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{o.productName}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Quantity: {o.quantity} {o.unit} • Seller: <strong>{o.sellerName}</strong>
                  </div>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{o.totalPrice.toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'sales' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mySales.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No produce sales recorded yet.
            </div>
          ) : (
            mySales.map(s => (
              <div key={s.id} className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <StatusBadge status={s.status} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sale ID: {s.id} • Date: {s.date}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{s.productName}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Quantity: {s.quantity} {s.unit} • Buyer: <strong>{s.buyerName}</strong>
                  </div>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--emerald)' }}>
                  +₹{s.totalPrice.toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'rentals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {myRentals.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No rental activity recorded yet.
            </div>
          ) : (
            myRentals.map(r => (
              <div key={r.id} className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <StatusBadge status={r.status} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rental ID: {r.id}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{r.equipmentName}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Dates: {r.startDate} to {r.endDate} ({r.durationDays} days) • Owner: <strong>{r.ownerName}</strong>
                  </div>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{r.totalPrice.toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
