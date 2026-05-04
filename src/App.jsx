import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Search, LayoutDashboard, Table as TableIcon, FileSpreadsheet, LogIn, ChevronLeft, MapPin, Download, Calendar } from 'lucide-react';
import { fetchSheetData, mapGuestData } from './utils/googleSheets';
import Dashboard from './components/Dashboard';
import GuestTable from './components/GuestTable';
import GuestDetailModal from './components/GuestDetailModal';
import './App.css';

function App() {
  const [sheetUrl, setSheetUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);

  const handleFetchData = async (e) => {
    e.preventDefault();
    if (!sheetUrl) return;

    setLoading(true);
    setError(null);
    try {
      const rawData = await fetchSheetData(sheetUrl);
      const mappedData = mapGuestData(rawData);
      setData(mappedData);
      localStorage.setItem('lastSheetUrl', sheetUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUrl = localStorage.getItem('lastSheetUrl');
    if (savedUrl) {
      setSheetUrl(savedUrl);
    }
  }, []);

  const [selectedState, setSelectedState] = useState('All States');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const indianStates = [
    'All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 
    'Lakshadweep', 'Puducherry'
  ];

  const exportToCSV = () => {
    if (!filteredData || filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(g => 
      Object.values(g).map(v => `"${v?.toString().replace(/"/g, '""') || ''}"`).join(',')
    ).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Guest_Report_${selectedState}_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const filteredData = data?.filter(guest => {
    const matchesSearch = (guest.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (guest.mobile?.toString().includes(searchTerm)) ||
                         (guest.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesState = selectedState === 'All States' || 
                        guest.state?.trim().toLowerCase() === selectedState.trim().toLowerCase();

    const matchesStatus = selectedStatus === 'All Status' || 
      (selectedStatus === 'Booked Room' && guest.roomStatus?.toLowerCase().includes('booked')) ||
      (selectedStatus === 'Checkout' && guest.roomStatus?.toLowerCase().includes('checkout'));

    const guestDate = new Date(guest.arrivalDate);
    const matchesDate = (!dateRange.start || guestDate >= new Date(dateRange.start)) &&
                        (!dateRange.end || guestDate <= new Date(dateRange.end));

    return matchesSearch && matchesState && matchesStatus && matchesDate;
  });

  if (!data) {
    return (
      <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card" 
          style={{ padding: '3rem', maxWidth: '600px', width: '100%', textAlign: 'center' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '20px' }}>
              <Database size={48} color="var(--primary)" />
            </div>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Guest Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
            Professional Guest Data Management & Analysis Software
          </p>
          
          <form onSubmit={handleFetchData}>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <FileSpreadsheet style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
              <input 
                type="text" 
                placeholder="Paste Google Sheets URL" 
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                style={{ width: '100%', paddingLeft: '3rem', height: '56px', fontSize: '1.1rem' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                height: '56px', 
                background: 'var(--primary)', 
                color: 'white', 
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  Connect Spreadsheet
                </>
              )}
            </button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid var(--danger)', 
                borderRadius: '12px',
                padding: '1rem',
                marginTop: '1.5rem'
              }}
            >
              <p style={{ color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 600 }}>Connection Error</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{error}</p>
              <button 
                onClick={() => setError(null)}
                style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--danger)', background: 'transparent', textDecoration: 'underline' }}
              >
                Try Again
              </button>
            </motion.div>
          )}

          <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>QUICK GUIDE</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>1. Open your Google Sheet<br/>2. Click Share<br/>3. Set to "Anyone with link"</p>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>REQUIRED FIELDS</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Guest Name, Mobile, Amount Spent, Arrival Date, etc.</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
        <div style={{ minWidth: '200px' }}>
          <button 
            onClick={() => setData(null)}
            style={{ background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', padding: 0 }}
          >
            <ChevronLeft size={16} /> Back to Source
          </button>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Guest Insights</h1>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
          <div className="glass-card" style={{ padding: '0.4rem', display: 'flex', borderRadius: '14px', background: 'rgba(255,255,255,0.03)' }}>
            <button 
              onClick={() => setActiveTab('dashboard')}
              style={{ 
                padding: '0.5rem 1rem', 
                background: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'dashboard' ? 'white' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderRadius: '10px',
                fontSize: '0.9rem'
              }}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('table')}
              style={{ 
                padding: '0.5rem 1rem', 
                background: activeTab === 'table' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'table' ? 'white' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderRadius: '10px',
                fontSize: '0.9rem'
              }}
            >
              <TableIcon size={16} /> List
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '160px', height: '42px', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{ 
                appearance: 'none',
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px',
                padding: '0 2.5rem 0 1rem',
                color: 'white',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '160px',
                height: '42px',
                fontSize: '0.9rem'
              }}
            >
              {indianStates.map(state => (
                <option key={state} value={state} style={{ background: '#1e293b' }}>{state}</option>
              ))}
            </select>
            <MapPin size={16} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ 
                appearance: 'none',
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px',
                padding: '0 2.5rem 0 1rem',
                color: 'white',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '140px',
                height: '42px',
                fontSize: '0.9rem'
              }}
            >
              <option value="All Status" style={{ background: '#1e293b' }}>All Status</option>
              <option value="Booked Room" style={{ background: '#1e293b' }}>Booked Room</option>
              <option value="Checkout" style={{ background: '#1e293b' }}>Checkout</option>
            </select>
            <LayoutDashboard size={16} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.03)', padding: '0 0.8rem', borderRadius: '12px', border: '1px solid var(--glass-border)', height: '42px' }}>
            <Calendar size={14} color="var(--text-secondary)" />
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.8rem', width: '110px' }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>-</span>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.8rem', width: '110px' }}
            />
          </div>

          <button 
            onClick={exportToCSV}
            style={{ 
              background: 'rgba(16, 185, 129, 0.1)', 
              color: '#10b981', 
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0 1rem',
              height: '42px',
              fontSize: '0.9rem'
            }}
          >
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Dashboard 
              data={filteredData} 
              globalData={data} 
              selectedState={selectedState} 
              onSelectGuest={setSelectedGuest} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GuestTable 
              data={filteredData} 
              onSelectGuest={setSelectedGuest} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {selectedGuest && (
        <GuestDetailModal 
          guest={selectedGuest} 
          onClose={() => setSelectedGuest(null)} 
        />
      )}

      <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--glass-border)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <p>© 2024 ChittorTech Data Analysis Suite • Built for Premium Guest Management</p>
      </footer>
    </div>
  );
}

export default App;
