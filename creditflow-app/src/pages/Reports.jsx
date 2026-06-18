import React, { useState, useEffect } from 'react';
import { FileText, Download, BarChart3, PieChart } from 'lucide-react';
import { api } from '../utils/api';

const PIE_COLORS = ['#3b82f6', '#10b981', '#fbbf24', '#ef4444', '#8b5cf6', '#64748b'];

function formatLKR(n) {
  if (n == null || isNaN(n)) return '—';
  if (n >= 1e9) return `LKR ${(n / 1e9).toFixed(1)}Bn`;
  if (n >= 1e6) return `LKR ${(n / 1e6).toFixed(1)}Mn`;
  if (n >= 1e3) return `LKR ${(n / 1e3).toFixed(1)}K`;
  return `LKR ${Math.round(n)}`;
}

export default function Reports() {
  const [filters, setFilters] = useState({
    type: 'Restructuring Summary',
    range: 'Jun 2026 - Jun 2026',
    branch: 'All Branches',
    loanType: 'All Types'
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  const savedReports = [
    { id: 'RPT-2026-06-001', name: 'Monthly Restructuring Summary — Jun 2026', format: 'PDF', generated: '13 Jun 2026' },
    { id: 'RPT-2026-05-031', name: 'DPD Analysis Report — May 2026', format: 'XLSX', generated: '01 Jun 2026' },
    { id: 'RPT-2026-05-020', name: 'Officer Performance Q2 2026', format: 'PDF', generated: '15 May 2026' }
  ];

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getReportAnalytics({ loanType: filters.loanType, range: filters.range, branch: filters.branch })
      .then(data => {
        if (!active) return;
        setAnalytics(data);
        setLoading(false);
      });
    return () => { active = false; };
  }, [filters.loanType, filters.range, filters.branch]);

  const setField = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const handleGenerate = async () => {
    setBusy(true);
    setStatus(null);
    const res = await api.exportReport({ type: filters.type, loanType: filters.loanType, range: filters.range });
    setBusy(false);
    setStatus(res && res.success
      ? `Report generated and downloaded: ${res.filename}`
      : 'Report generation failed. Make sure the backend is running.');
  };

  const handleExport = async () => {
    setBusy(true);
    setStatus(null);
    const res = await api.exportReport({ type: 'Restructuring Summary', loanType: filters.loanType, range: filters.range });
    setBusy(false);
    setStatus(res && res.success
      ? `CSV exported: ${res.filename}`
      : 'CSV export failed. Make sure the backend is running.');
  };

  const a = analytics || {};
  const dist = (a.loanTypeDistribution || []).slice(0, 6);
  const monthly = a.monthlyVolume || [];
  const officers = a.officerPerformance || [];
  const show = v => (loading || v == null ? '—' : v);

  // Build pie segments with cumulative offsets (percentage based).
  let acc = 0;
  const pieSegments = dist.map((d, i) => {
    const seg = {
      label: d.label,
      percent: d.percent,
      color: PIE_COLORS[i % PIE_COLORS.length],
      offset: -acc
    };
    acc += d.percent || 0;
    return seg;
  });

  // Scale bar heights for the monthly volume chart.
  const maxVol = Math.max(1, ...monthly.map(m => Math.max(m.restructured || 0, m.rescheduled || 0)));
  const barH = v => Math.max(2, ((v || 0) / maxVol) * 110);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>

      {/* Top Filters */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Report Type</span>
          <select className="glass-input" value={filters.type} onChange={e => setField('type', e.target.value)} style={{ width: '180px', padding: '8px 12px', fontSize: '0.85rem' }}>
            <option>Restructuring Summary</option>
            <option>Compliance Report</option>
            <option>DPD Classification Report</option>
            <option>Officer Productivity Report</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Date Range</span>
          <select className="glass-input" value={filters.range} onChange={e => setField('range', e.target.value)} style={{ width: '180px', padding: '8px 12px', fontSize: '0.85rem' }}>
            <option>Jun 2026 - Jun 2026</option>
            <option>May 2026 - Jun 2026</option>
            <option>Last 90 Days</option>
            <option>Full Year 2026</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Branch</span>
          <select className="glass-input" value={filters.branch} onChange={e => setField('branch', e.target.value)} style={{ width: '160px', padding: '8px 12px', fontSize: '0.85rem' }}>
            <option>All Branches</option>
            <option>Colombo Main Branch</option>
            <option>Negombo Branch</option>
            <option>Kandy Branch</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Loan Type</span>
          <select className="glass-input" value={filters.loanType} onChange={e => setField('loanType', e.target.value)} style={{ width: '160px', padding: '8px 12px', fontSize: '0.85rem' }}>
            <option>All Types</option>
            <option>Personal Loan</option>
            <option>Home Loan</option>
            <option>SME Loan</option>
            <option>Vehicle Loan</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', alignSelf: 'flex-end', marginLeft: 'auto' }}>
          {status && (
            <span style={{ fontSize: '0.75rem', color: status.includes('failed') ? 'var(--color-danger)' : 'var(--color-success)' }}>
              {status}
            </span>
          )}
          <button onClick={handleGenerate} disabled={busy} className="glass-button" style={{ padding: '9px 16px', fontSize: '0.85rem', opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Working…' : 'Generate Report'}
          </button>
          <button onClick={handleExport} disabled={busy} className="glass-button-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', gap: '6px', opacity: busy ? 0.6 : 1 }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Total Restructured</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px' }}>{show(a.totalRestructured)} Cases</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Total Rescheduled</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px' }}>{show(a.totalRescheduled)} Cases</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Success Rate</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px', color: 'var(--color-success)' }}>{show(a.successRate)}%</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Avg. DPD at Entry</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px', color: 'var(--color-warning)' }}>{show(a.avgDpd)} Days</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Total Portfolio</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px' }}>{loading ? '—' : formatLKR(a.totalPortfolio)}</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Compliance Rate</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px', color: 'var(--color-success)' }}>{show(a.complianceRate)}%</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Trend Volume Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} /> Monthly Restructuring vs Rescheduling Volume
          </h3>
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="100%" height="100%" viewBox="0 0 420 160" style={{ overflow: 'visible' }}>
              <line x1="30" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
              <line x1="30" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
              <line x1="30" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
              <line x1="30" y1="130" x2="400" y2="130" stroke="rgba(255,255,255,0.1)" />

              {monthly.map((m, i) => {
                const groupX = 50 + i * 58;
                const h1 = barH(m.restructured);
                const h2 = barH(m.rescheduled);
                return (
                  <g key={i}>
                    <rect x={groupX} y={130 - h1} width="12" height={h1} fill="url(#b-grad)" rx="2" />
                    <rect x={groupX + 14} y={130 - h2} width="12" height={h2} fill="url(#g-grad)" rx="2" />
                    <text x={groupX + 13} y="145" fill="var(--text-muted)" fontSize="8" textAnchor="middle">{m.month}</text>
                  </g>
                );
              })}

              <defs>
                <linearGradient id="b-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="g-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', background: '#3b82f6', marginRight: '6px' }}></span>Restructured</span>
            <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', background: '#10b981', marginRight: '6px' }}></span>Rescheduled</span>
          </div>
        </div>

        {/* Loan Distribution Pie */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={16} /> Loan Type Distribution
          </h3>
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="150" height="150" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1f2937" strokeWidth="4.2" />
              {pieSegments.map((s, i) => (
                <circle key={i} cx="18" cy="18" r="15.915" fill="transparent"
                  stroke={s.color} strokeWidth="4.2"
                  strokeDasharray={`${s.percent} ${100 - s.percent}`}
                  strokeDashoffset={s.offset} />
              ))}
            </svg>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '30px', fontSize: '0.8rem' }}>
              {pieSegments.length === 0 && (
                <span style={{ color: 'var(--text-muted)' }}>{loading ? 'Loading…' : 'No data'}</span>
              )}
              {pieSegments.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>{s.label} — {s.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Officer Productivity Table (Left) & Saved Reports (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px' }}>

        {/* Officer performance table */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Officer Performance Summary</h3>
          <div className="table-container">
            <table className="custom-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Officer</th>
                  <th>Cases Handled</th>
                  <th>Approved</th>
                  <th>Rejected</th>
                  <th>Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {officers.length === 0 && (
                  <tr><td colSpan="5" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>{loading ? 'Loading…' : 'No case data available'}</td></tr>
                )}
                {officers.map((off, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 500 }}>{off.name}</td>
                    <td>{off.cases}</td>
                    <td style={{ color: 'var(--color-success)' }}>{off.approved}</td>
                    <td style={{ color: 'var(--color-danger)' }}>{off.rejected}</td>
                    <td style={{ fontWeight: 600 }}>{off.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Saved Reports */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Saved Reports</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {savedReports.map(rep => (
              <div
                key={rep.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={18} style={{ color: 'var(--color-primary)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }}>{rep.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Generated: {rep.generated} | {rep.format}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleExport()}
                  className="glass-button-secondary"
                  style={{ padding: '6px', borderRadius: '4px' }}
                >
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
