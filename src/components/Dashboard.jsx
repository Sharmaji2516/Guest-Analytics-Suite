import React, { useState } from 'react';
import { User, IndianRupee, Clock, MapPin, UserCheck, TrendingUp, PieChart as PieIcon, ExternalLink } from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const Dashboard = ({ data, globalData, selectedState, onSelectGuest }) => {
  const [expandedCard, setExpandedCard] = useState(null); // 'occupants', 'checkins', 'checkouts'

  if (!globalData || globalData.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
        <h3>No guest data available to analyze.</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Make sure your Google Sheet has data and the columns are correctly named.</p>
      </div>
    );
  }

  const isFiltered = selectedState !== 'All States';
  const displayData = isFiltered ? data : globalData;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Live Stay Monitor Logic
  const checkinsToday = displayData.filter(g => {
    const d = new Date(g.arrivalDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  const checkoutsToday = displayData.filter(g => {
    const d = new Date(g.departureDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  const currentOccupants = displayData.filter(g => {
    const arr = new Date(g.arrivalDate);
    const dep = new Date(g.departureDate);
    arr.setHours(0, 0, 0, 0);
    dep.setHours(0, 0, 0, 0);
    return arr <= today && (dep > today || !g.departureDate);
  });

  const totalGuests = displayData.length;
  const totalSpent = displayData.reduce((sum, item) => sum + (item.amountSpent || 0), 0);
  const totalDays = displayData.reduce((sum, item) => sum + (item.duration || 0), 0);
  const avgStay = totalGuests > 0 ? (totalDays / totalGuests).toFixed(1) : 0;
  
  const maleCount = displayData.reduce((sum, item) => sum + (item.males || 0), 0);
  const femaleCount = displayData.reduce((sum, item) => sum + (item.females || 0), 0);
  const childCount = displayData.reduce((sum, item) => sum + (item.children || 0), 0);
  const totalPeople = maleCount + femaleCount + childCount;

  const topReason = [...displayData].reduce((acc, item) => {
    const r = (item.arrivalReason || 'Other').toString();
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});
  const topReasonName = Object.entries(topReason).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const metrics = [
    { label: isFiltered ? `${selectedState} Records` : 'Total Records', value: totalGuests, icon: User, color: '#6366f1' },
    { label: isFiltered ? `${selectedState} Revenue` : 'Total Revenue', value: `₹${totalSpent.toLocaleString()}`, icon: IndianRupee, color: '#10b981' },
    { label: 'Avg Stay (Days)', value: avgStay, icon: Clock, color: '#f59e0b' },
    { label: 'Top Reason', value: topReasonName, icon: TrendingUp, color: '#ec4899' },
  ];

  const toggleExpand = (card) => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  const getExpandedList = () => {
    if (expandedCard === 'occupants') return currentOccupants;
    if (expandedCard === 'checkins') return checkinsToday;
    if (expandedCard === 'checkouts') return checkoutsToday;
    return [];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Live Monitor Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div 
          onClick={() => toggleExpand('occupants')}
          className={`glass-card ${expandedCard === 'occupants' ? 'active-card' : ''}`} 
          style={{ padding: '1.5rem', cursor: 'pointer', border: `1px solid ${expandedCard === 'occupants' ? '#10b981' : 'rgba(16, 185, 129, 0.2)'}`, background: 'rgba(16, 185, 129, 0.05)', transition: 'all 0.3s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
              <UserCheck size={24} color="#10b981" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Current Occupants</h4>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>{currentOccupants.length} Guests</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{expandedCard === 'occupants' ? 'Click to close list' : 'Click to see guest list'}</p>
        </div>

        <div 
          onClick={() => toggleExpand('checkins')}
          className={`glass-card ${expandedCard === 'checkins' ? 'active-card' : ''}`} 
          style={{ padding: '1.5rem', cursor: 'pointer', border: `1px solid ${expandedCard === 'checkins' ? 'var(--primary)' : 'rgba(99, 102, 241, 0.2)'}`, background: 'rgba(99, 102, 241, 0.05)', transition: 'all 0.3s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
              <TrendingUp size={24} color="var(--primary)" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Today's Check-ins</h4>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{checkinsToday.length} Arrivals</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{expandedCard === 'checkins' ? 'Click to close list' : 'Click to see guest list'}</p>
        </div>

        <div 
          onClick={() => toggleExpand('checkouts')}
          className={`glass-card ${expandedCard === 'checkouts' ? 'active-card' : ''}`} 
          style={{ padding: '1.5rem', cursor: 'pointer', border: `1px solid ${expandedCard === 'checkouts' ? '#f59e0b' : 'rgba(245, 158, 11, 0.2)'}`, background: 'rgba(245, 158, 11, 0.05)', transition: 'all 0.3s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
              <Clock size={24} color="#f59e0b" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Today's Check-outs</h4>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>{checkoutsToday.length} Departures</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{expandedCard === 'checkouts' ? 'Click to close list' : 'Click to see guest list'}</p>
        </div>
      </div>

      {/* Expanded List Panel */}
      {expandedCard && (
        <div className="glass-card" style={{ padding: '2rem', border: `1px solid var(--glass-border)`, background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {expandedCard === 'occupants' ? <UserCheck size={20} /> : expandedCard === 'checkins' ? <TrendingUp size={20} /> : <Clock size={20} />}
              {expandedCard === 'occupants' ? 'Current Occupants' : expandedCard === 'checkins' ? "Today's Arrivals" : "Today's Departures"}
            </h3>
            <span className="badge badge-primary">{getExpandedList().length} Guests Found</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
            {getExpandedList().map((guest, i) => (
              <div key={i} style={{ 
                padding: '1.25rem', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{guest.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{guest.from} • {guest.roomStatus}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.25rem' }}>{guest.mobile}</div>
                </div>
                <button 
                  onClick={() => onSelectGuest(guest)}
                  style={{ 
                    padding: '0.6rem 1rem', 
                    background: 'rgba(255,255,255,0.05)', 
                    color: 'white', 
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <ExternalLink size={14} /> Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {metrics.map((m, i) => (
          <div key={i} className="glass-card metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="metric-label">{m.label}</span>
              <div style={{ padding: '0.75rem', background: `${m.color}15`, borderRadius: '12px' }}>
                <m.icon size={20} color={m.color} />
              </div>
            </div>
            <span className="metric-value">{m.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
        {/* Demographic Distribution Visual */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UserCheck size={20} /> Demographic Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Males</span>
                <span style={{ fontWeight: 600 }}>{maleCount} ({totalPeople > 0 ? ((maleCount/totalPeople)*100).toFixed(1) : 0}%)</span>
              </div>
              <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${totalPeople > 0 ? (maleCount/totalPeople)*100 : 0}%`, height: '100%', background: 'var(--primary)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Females</span>
                <span style={{ fontWeight: 600 }}>{femaleCount} ({totalPeople > 0 ? ((femaleCount/totalPeople)*100).toFixed(1) : 0}%)</span>
              </div>
              <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${totalPeople > 0 ? (femaleCount/totalPeople)*100 : 0}%`, height: '100%', background: '#ec4899' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Children</span>
                <span style={{ fontWeight: 600 }}>{childCount} ({totalPeople > 0 ? ((childCount/totalPeople)*100).toFixed(1) : 0}%)</span>
              </div>
              <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${totalPeople > 0 ? (childCount/totalPeople)*100 : 0}%`, height: '100%', background: '#f59e0b' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Origin Cities */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={20} /> {isFiltered ? `Cities in ${selectedState}` : 'Origin Cities'}
            </h3>
            <span className="badge badge-primary">{Object.keys(displayData.reduce((acc, item) => {
              const city = item.from || 'Not Specified';
              acc[city] = (acc[city] || 0) + 1;
              return acc;
            }, {})).length} Cities</span>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '200px', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
            {Object.entries(
              displayData.reduce((acc, item) => {
                const city = item.from || 'Not Specified';
                acc[city] = (acc[city] || 0) + 1;
                return acc;
              }, {})
            )
            .sort((a, b) => b[1] - a[1])
            .map(([city, count], i) => (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '0.85rem 1rem', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: '20px' }}>{i + 1}.</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{city}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${(count/displayData.length)*100}%`, height: '100%', background: 'var(--primary)' }}></div>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', minWidth: '40px', textAlign: 'right' }}>{count}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Accounted for: <strong>{displayData.length}</strong> records from {isFiltered ? selectedState : 'all states'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
