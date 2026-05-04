import React, { useState } from 'react';
import { Eye, MapPin, Phone, Calendar, Car, Info } from 'lucide-react';
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
              <th>Guest Name</th>
              <th>Caste</th>
              <th>Contact</th>
              <th>Travel Info</th>
              <th>Stay Details</th>
              <th>Expenses</th>
              <th>Actions</th>
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
                  <span className="badge badge-primary">{guest.caste || 'N/A'}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <Phone size={12} color="var(--text-secondary)" /> {guest.mobile}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{guest.email}</div>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <Calendar size={12} color="var(--text-secondary)" /> {guest.arrivalDate}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {guest.duration} Days • {(guest.males || 0) + (guest.females || 0)} People
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{(guest.amountSpent || 0).toLocaleString()}</span>
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
