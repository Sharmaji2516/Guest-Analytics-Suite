import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Phone, Mail, User, Calendar, Car, IndianRupee, Clock, Info, Home } from 'lucide-react';

const GuestDetailModal = ({ guest, onClose }) => {
  if (!guest) return null;

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
      <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', height: 'fit-content' }}>
        <Icon size={20} color="var(--primary)" />
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontWeight: 600, color: 'white' }}>{value || 'N/A'}</div>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{guest.name}</h2>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span className="badge badge-primary">{guest.caste}</span>
              <span className="badge badge-success">{guest.arrivalReason}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '2rem', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <DetailItem icon={Phone} label="Mobile Number" value={guest.mobile} />
          <DetailItem icon={Mail} label="Email Address" value={guest.email} />
          <DetailItem icon={Home} label="Native Place (Mul Niwas)" value={guest.nativePlace} />
          <DetailItem icon={MapPin} label="Full Address" value={guest.address} />
          <DetailItem icon={Calendar} label="Arrival Date" value={guest.arrivalDate} />
          <DetailItem icon={Clock} label="Arrival Time" value={guest.arrivalTime} />
          <DetailItem icon={Calendar} label="Departure Date" value={guest.departureDate} />
          <DetailItem icon={Clock} label="Duration of Stay" value={`${guest.duration} Days`} />
          <DetailItem icon={Info} label="Room Status" value={guest.roomStatus} />
          <DetailItem icon={MapPin} label="Route" value={<span>{guest.from} <span style={{color:'var(--primary)'}}>→ Chittorgarh →</span> {guest.to}</span>} />
          <DetailItem icon={Car} label="Vehicle Type" value={guest.vehicleType} />
          <DetailItem icon={User} label="Occupancy" value={`${(guest.males || 0)} Males, ${(guest.females || 0)} Females, ${(guest.children || 0)} Children`} />
          <DetailItem icon={User} label="Total Persons" value={guest.totalPersons} />
          <DetailItem icon={IndianRupee} label="Deposited Amount" value={`₹${guest.depositedAmount?.toLocaleString() || 0}`} />
          <DetailItem icon={IndianRupee} label="Normal Account" value={`₹${guest.normalAmount?.toLocaleString() || 0}`} />
          <DetailItem icon={IndianRupee} label="Total Expenses" value={`₹${guest.amountSpent?.toLocaleString() || 0}`} />
        </div>

        <div style={{ padding: '1.5rem 2rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            style={{ padding: '0.75rem 2rem', background: 'var(--primary)', color: 'white' }}
          >
            Close Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GuestDetailModal;
