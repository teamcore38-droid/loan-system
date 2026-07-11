import React, { useState } from 'react';
import { Search, Eye, Contact } from 'lucide-react';

export default function Customers({ cases, onNavigateToCase }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loanFilter, setLoanFilter] = useState('All');

  // Filter cases to get unique customer entries
  const filteredCustomers = cases.filter(c => {
    const matchesSearch = 
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nicNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.loanAccountNo.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesLoan = loanFilter === 'All' || c.loanType === loanFilter;
    
    return matchesSearch && matchesLoan;
  });

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header section with icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <Contact size={20} style={{ color: 'var(--color-primary)' }} />
          Customer Directory
        </h3>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Total Customers: <b>{filteredCustomers.length}</b>
        </span>
      </div>

      {/* Filter and search bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text"
            placeholder="Search by Name, Customer ID, NIC, or Account No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input"
            style={{ width: '100%', paddingLeft: '38px', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Loan Category:</span>
          <select 
            value={loanFilter}
            onChange={(e) => setLoanFilter(e.target.value)}
            className="glass-input"
            style={{ padding: '8px 12px', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <option value="All">All Categories</option>
            <option value="Personal Loan">Personal Loan</option>
            <option value="Housing Loan">Housing Loan</option>
          </select>
        </div>
      </div>

      {/* Table grid */}
      <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
        {filteredCustomers.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', color: 'var(--text-muted)' }}>
            <Contact size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
            <p style={{ fontSize: '0.9rem' }}>No customers found matching search criteria.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>NIC Number</th>
                <th>Contact Number</th>
                <th>Loan Account</th>
                <th>Loan Type</th>
                <th style={{ textAlign: 'right' }}>Outstanding Balance (LKR)</th>
                <th>DPD Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{c.customerId}</td>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.customerName}</td>
                  <td>{c.nicNumber}</td>
                  <td>{c.contactNumber}</td>
                  <td style={{ fontWeight: 500, color: '#60a5fa' }}>{c.loanAccountNo}</td>
                  <td>
                    <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {c.loanType}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#34d399' }}>
                    {c.outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span className={`badge ${c.dpd >= 90 ? 'danger' : 'warning'}`}>
                      {c.dpd} DPD
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => onNavigateToCase(c.id)}
                      className="glass-button"
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.78rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Eye size={12} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
