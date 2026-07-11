import React from 'react';
import { 
  FileText, 
  CheckSquare, 
  TrendingUp, 
  Layers, 
  Activity, 
  AlertOctagon, 
  Eye 
} from 'lucide-react';

export default function Dashboard({ cases, notifications, tasks, onToggleTask, onNavigateToCase, user }) {
  // Filter cases based on assignment
  const isManagement = user.role === 'Super Admin' || user.role === 'Risk & Compliance';
  const myCases = isManagement 
    ? cases 
    : cases.filter(c => {
        const officer = c.assignedOfficer || '';
        const nameParts = user.name.toLowerCase().split(' ');
        const assignedLower = officer.toLowerCase();
        if (nameParts.length > 0) {
          const lastName = nameParts[nameParts.length - 1];
          if (lastName.length > 2 && assignedLower.includes(lastName)) return true;
        }
        return assignedLower.includes(user.name.toLowerCase()) || 
               user.name.toLowerCase().includes(assignedLower);
      });

  const totalCasesBase = 1280;
  const pendingApprovalsBase = 43;
  const monitoringBase = 387;
  const complianceBase = 7;

  const totalCases = isManagement ? (totalCasesBase + cases.length) : myCases.length;
  const pendingApprovals = isManagement ? (pendingApprovalsBase + cases.filter(c => c.stage === 4).length) : myCases.filter(c => c.stage === 4).length;
  const housingLoans = isManagement ? (720 + cases.filter(c => c.loanType === 'Housing Loan').length) : myCases.filter(c => c.loanType === 'Housing Loan').length;
  const personalLoans = isManagement ? (560 + cases.filter(c => c.loanType === 'Personal Loan').length) : myCases.filter(c => c.loanType === 'Personal Loan').length;
  const activeMonitoring = isManagement ? (monitoringBase + cases.filter(c => c.stage === 7).length) : myCases.filter(c => c.stage === 7).length;
  const complianceAlerts = isManagement ? (complianceBase + cases.filter(c => c.stage === 7 && c.monitoringMissedPayments > 0).length) : myCases.filter(c => c.stage === 7 && c.monitoringMissedPayments > 0).length;

  const roleTasks = tasks.filter(t => t.role === user.role);
  const roleNotifications = notifications.filter(n => n.role === user.role);

  return (
    <div style={{ display: 'flex', gap: '20px', height: '100%', width: '100%' }}>
      {/* Left Column: Metrics, Charts, Recent Cases */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="glass-panel metric-card primary">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Cases</span>
              <FileText size={16} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="metric-val">{totalCases.toLocaleString()}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 500 }}>+12 this week</div>
          </div>

          <div className="glass-panel metric-card warning">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Approvals</span>
              <CheckSquare size={16} style={{ color: 'var(--color-warning)' }} />
            </div>
            <div className="metric-val">{pendingApprovals}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Requires attention</div>
          </div>

          <div className="glass-panel metric-card success">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Housing Loans</span>
              <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
            </div>
            <div className="metric-val">{housingLoans}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 500 }}>Active portfolio</div>
          </div>

          <div className="glass-panel metric-card primary">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Personal Loans</span>
              <Layers size={16} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="metric-val">{personalLoans}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 500 }}>Active portfolio</div>
          </div>

          <div className="glass-panel metric-card primary">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Monitoring</span>
              <Activity size={16} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="metric-val">{activeMonitoring}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>90/120-day trackers</div>
          </div>

          <div className="glass-panel metric-card danger">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Compliance Alerts</span>
              <AlertOctagon size={16} style={{ color: 'var(--color-danger)' }} />
            </div>
            <div className="metric-val">{complianceAlerts}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-danger)', fontWeight: 500 }}>Review needed</div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px' }}>
          {/* SVG Grouped Bar Chart */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Monthly Restructuring Requests</h3>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 150" style={{ overflow: 'visible' }}>
                {/* Y Axis Guide Lines */}
                <line x1="30" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                <line x1="30" y1="60" x2="380" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                <line x1="30" y1="100" x2="380" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                <line x1="30" y1="120" x2="380" y2="120" stroke="rgba(255,255,255,0.1)" />

                {/* Bars - Jan */}
                <rect x="50" y="50" width="10" height="70" fill="url(#blue-grad)" rx="2" />
                <rect x="62" y="70" width="10" height="50" fill="url(#green-grad)" rx="2" />
                <text x="61" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Jan</text>

                {/* Bars - Feb */}
                <rect x="110" y="40" width="10" height="80" fill="url(#blue-grad)" rx="2" />
                <rect x="122" y="65" width="10" height="55" fill="url(#green-grad)" rx="2" />
                <text x="121" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Feb</text>

                {/* Bars - Mar */}
                <rect x="170" y="30" width="10" height="90" fill="url(#blue-grad)" rx="2" />
                <rect x="182" y="50" width="10" height="70" fill="url(#green-grad)" rx="2" />
                <text x="181" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Mar</text>

                {/* Bars - Apr */}
                <rect x="230" y="45" width="10" height="75" fill="url(#blue-grad)" rx="2" />
                <rect x="242" y="60" width="10" height="60" fill="url(#green-grad)" rx="2" />
                <text x="241" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Apr</text>

                {/* Bars - May */}
                <rect x="290" y="25" width="10" height="95" fill="url(#blue-grad)" rx="2" />
                <rect x="302" y="40" width="10" height="80" fill="url(#green-grad)" rx="2" />
                <text x="301" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">May</text>

                {/* Bars - Jun */}
                <rect x="350" y="15" width="10" height="105" fill="url(#blue-grad)" rx="2" />
                <rect x="362" y="30" width="10" height="90" fill="url(#green-grad)" rx="2" />
                <text x="361" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Jun</text>

                {/* Gradients definition */}
                <defs>
                  <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="green-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '10px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--color-primary)' }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>Restructured</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--color-success)' }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>Rescheduled</span>
              </div>
            </div>
          </div>

          {/* SVG Pie Chart */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Approval Status</h3>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}>
              <svg width="120" height="120" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                {/* Pie segments (dasharray: stroke-dasharray="percentage gap") */}
                <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#1f2937" strokeWidth="4.2" />
                
                {/* Approved Segment (60%) */}
                <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="var(--color-success)" strokeWidth="4.2" strokeDasharray="60 40" strokeDashoffset="0" />
                
                {/* Pending Segment (25%) */}
                <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="var(--color-primary)" strokeWidth="4.2" strokeDasharray="25 75" strokeDashoffset="-60" />
                
                {/* Rejected/Clarification Segment (15%) */}
                <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="var(--color-warning)" strokeWidth="4.2" strokeDasharray="15 85" strokeDashoffset="-85" />
              </svg>
              {/* Center value overlay */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '20px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Approved (60%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Under Review (25%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-warning)' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Clarification (15%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Cases Table */}
        <div className="glass-panel" style={{ padding: '20px', flex: 1, minHeight: '260px' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Recent Cases</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Customer Name</th>
                  <th>Loan Type</th>
                  <th>DPD</th>
                  <th>Status</th>
                  <th>Assigned Officer</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myCases.slice(0, 4).map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600, color: '#60a5fa' }}>{c.id}</td>
                    <td>{c.customerName}</td>
                    <td>{c.loanType}</td>
                    <td>
                      <span className={`badge ${c.dpd >= 90 ? 'danger' : 'warning'}`}>
                        {c.dpd} DPD
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        c.status === 'Monitoring Active' ? 'success' : 
                        c.status === 'Approved' ? 'success' : 
                        c.status.includes('Pending') ? 'warning' : 'primary'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td>{c.assignedOfficer}</td>
                    <td>
                      <button
                        onClick={() => onNavigateToCase(c.id)}
                        className="glass-button-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: Notifications & Tasks */}
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
        {/* Recent Notifications */}
        <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Recent Notifications
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1 }}>
            {roleNotifications.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>
                No notifications for your role.
              </p>
            ) : (
              roleNotifications.map((notif, idx) => (
                <div key={idx} style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderLeft: `3px solid ${
                    notif.type === 'danger' ? 'var(--color-danger)' :
                    notif.type === 'warning' ? 'var(--color-warning)' :
                    notif.type === 'success' ? 'var(--color-success)' : 'var(--color-primary)'
                  }`,
                  fontSize: '0.8rem',
                  lineHeight: 1.3
                }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{notif.message}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '4px' }}>Just now</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="glass-panel" style={{ padding: '20px', height: '240px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Pending Tasks
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1 }}>
            {roleTasks.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>
                All tasks completed!
              </p>
            ) : (
              roleTasks.map((task, idx) => (
                <label key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  transition: 'background 0.2s',
                  fontSize: '0.82rem',
                  color: task.done ? 'var(--text-muted)' : 'var(--text-primary)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => onToggleTask(task.text)}
                    style={{ marginTop: '3px', accentColor: 'var(--color-primary)' }}
                  />
                  <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                    {task.text}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
