import React, { useState } from 'react';
import { Eye, MapPin, Phone, Calendar, Car, Info, Clock } from 'lucide-react';
import GuestDetailModal from './GuestDetailModal';

const GuestTable = ({ data }) => {
  const [selectedGuest, setSelectedGuest] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
        <Info size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ color: 'var(--text-secondary)' }}>No records found matching your search.</h3>
      </div>
    );
  }

  return (
    <>
      <div className="table-scroll-container">
        <table className="data-table">
          <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#0f172a' }}>
            <tr>
              <th style={{ width: '20%' }}>Guest Name</th>
              <th style={{ width: '15%' }}>Contact</th>
              <th style={{ width: '25%' }}>Travel Info</th>
              <th style={{ width: '25%' }}>Stay Details</th>
              <th style={{ width: '10%' }}>Expenses</th>
              <th style={{ width: '5%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((guest, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{guest.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>f: {guest.fatherName}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <Phone size={12} color="var(--text-secondary)" /> {guest.mobile}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>{guest.email}</div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <MapPin size={12} color="var(--text-secondary)" /> 
                      {guest.from} <span style={{ color: 'var(--primary)', fontWeight: 700 }}>→ Chittorgarh →</span> {guest.to}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <Car size={12} /> {guest.vehicleType}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                      <Calendar size={14} color="var(--primary)" /> {guest.arrivalDate}
                    </div>
                    {guest.arrivalTime && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <Clock size={12} /> {guest.arrivalTime}
                      </div>
                    )}
                    <div style={{ fontSize: '0.8rem', color: 'white', marginTop: '0.25rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', width: 'fit-content' }}>
                      {guest.duration} Days • {(guest.males || 0) + (guest.females || 0) + (guest.children || 0)} Total People
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.1rem' }}>₹{(guest.amountSpent || 0).toLocaleString()}</div>
                </td>
                <td>
                  <button 
                    onClick={() => setSelectedGuest(guest)}
                    style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}
                  >
                    <Eye size={18} color="var(--primary)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedGuest && (
        <GuestDetailModal 
          guest={selectedGuest} 
          onClose={() => setSelectedGuest(null)} 
        />
      )}
    </>
  );
};

export default GuestTable;
