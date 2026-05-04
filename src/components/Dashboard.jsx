import React from 'react';
import { User, IndianRupee, Clock, MapPin, UserCheck, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const Dashboard = ({ data, globalData, selectedState }) => {
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

  const totalGuests = displayData.length;
  const totalSpent = displayData.reduce((sum, item) => sum + (item.amountSpent || 0), 0);
  const totalDays = displayData.reduce((sum, item) => sum + (item.duration || 0), 0);
  const avgStay = totalGuests > 0 ? (totalDays / totalGuests).toFixed(1) : 0;
  
  const maleCount = displayData.reduce((sum, item) => sum + (item.males || 0), 0);
  const femaleCount = displayData.reduce((sum, item) => sum + (item.females || 0), 0);
  const childCount = displayData.reduce((sum, item) => sum + (item.children || 0), 0);
  const totalPeople = maleCount + femaleCount + childCount;

  // Financial Breakdown
  const totalDeposited = displayData.reduce((sum, item) => sum + (item.depositedAmount || 0), 0);
  const totalNormal = displayData.reduce((sum, item) => sum + (item.normalAmount || 0), 0);

  // VIP Guests (Top 5 spenders)
  const vipGuests = [...displayData]
    .sort((a, b) => (b.amountSpent || 0) - (a.amountSpent || 0))
    .slice(0, 5);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* VIP Guests & Financial Insights - FULL WIDTH */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
                <UserCheck size={24} color="var(--primary)" /> VIP Guests & Financial Insights
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Top contributing clients and overall financial health</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Business Intelligence Panel</span>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {vipGuests.map((guest, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.5rem', 
                background: 'rgba(255,255,255,0.02)', 
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'transform 0.2s',
                cursor: 'default'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>
                    {guest.name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{guest.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{guest.from}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Stay Duration</div>
                    <div style={{ fontWeight: 600 }}>{guest.duration} Days</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Billing</div>
                    <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.2rem' }}>₹{guest.amountSpent?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--glass-border)' }}>
            <div style={{ padding: '2rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Deposits Collected</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>₹{totalDeposited.toLocaleString()}</div>
              </div>
              <div style={{ width: '60px', height: '60px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IndianRupee size={28} color="#10b981" />
              </div>
            </div>
            <div style={{ padding: '2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Normal Account Balance</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{totalNormal.toLocaleString()}</div>
              </div>
              <div style={{ width: '60px', height: '60px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={28} color="var(--primary)" />
              </div>
            </div>
          </div>
        </div>
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
