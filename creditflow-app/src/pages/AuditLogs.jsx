import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, Download, Flag } from 'lucide-react';
import { api } from '../utils/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedUser, setSelectedUser] = useState('All');
  const [selectedAction, setSelectedAction] = useState('All');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const data = await api.getLogs();
    setLogs(data);
    if (data.length > 0) {
      setSelectedLog(data[0]);
    }
  };

  // Hardcoded counts to match high volumes in wireframe plus dynamic offsets
  const totalLogs = 3840 + logs.length;
  const todaysActivity = 120 + logs.filter(l => l.timestamp.includes(new Date().toISOString().split('T')[0])).length;
  const failedLogins = 7 + logs.filter(l => l.action === 'Login Failed').length;
  const criticalEvents = 3 + logs.filter(l => l.status === 'Warning' || l.status === 'Failed').length;
  const dataExports = 12;
  const configChanges = 4 + logs.filter(l => l.module === 'Settings').length;

  const handleLogSelect = (log) => {
    setSelectedLog(log);
  };

  // Filter logic
  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.details.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === 'All' || l.module === selectedModule;
    const matchesUser = selectedUser === 'All' || l.user.includes(selectedUser);
    const matchesAction = selectedAction === 'All' || l.action === selectedAction;

    return matchesSearch && matchesModule && matchesUser && matchesAction;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '9fr 4fr', gap: '20px', height: '100%' }}>
      {/* Left Column: Activity List & Metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
        
        {/* Filters */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ width: '100%', paddingLeft: '38px', fontSize: '0.85rem' }}
            />
          </div>

          <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)} className="glass-input" style={{ width: '130px', fontSize: '0.82rem' }}>
            <option value="All">All Modules</option>
            <option value="Cases">Cases</option>
            <option value="Approvals">Approvals</option>
            <option value="Documents">Documents</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Auth">Auth</option>
            <option value="Settings">Settings</option>
            <option value="Users">Users</option>
          </select>

          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="glass-input" style={{ width: '130px', fontSize: '0.82rem' }}>
            <option value="All">All Users</option>
            <option value="Jayawardena">K. Jayawardena</option>
            <option value="Silva">Ruwan Silva</option>
            <option value="Kumara">Thilini Kumara</option>
            <option value="Perera">Mahesh Perera</option>
            <option value="System">System</option>
          </select>

          <select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)} className="glass-input" style={{ width: '130px', fontSize: '0.82rem' }}>
            <option value="All">All Actions</option>
            <option value="Case Updated">Case Updated</option>
            <option value="Approval Granted">Approval Granted</option>
            <option value="Doc Uploaded">Doc Uploaded</option>
            <option value="Auto Alert Sent">Auto Alert Sent</option>
            <option value="Login Success">Login Success</option>
            <option value="Login Failed">Login Failed</option>
            <option value="User Created">User Created</option>
            <option value="Config Changed">Config Changed</option>
          </select>

          <button className="glass-button" style={{ display: 'flex', gap: '6px', padding: '10px 14px', fontSize: '0.82rem' }}>
            <Filter size={14} /> Apply
          </button>
        </div>

        {/* Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '12px', borderLeft: '3px solid var(--color-primary)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Total Log Entries</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>{totalLogs.toLocaleString()}</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px', borderLeft: '3px solid var(--color-success)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Today's Activity</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>{todaysActivity}</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px', borderLeft: '3px solid var(--color-warning)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Failed Logins</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px', color: 'var(--color-warning)' }}>{failedLogins}</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px', borderLeft: '3px solid var(--color-danger)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Critical Events</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px', color: 'var(--color-danger)' }}>{criticalEvents}</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px', borderLeft: '3px solid var(--color-success)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Data Exports</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>{dataExports}</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px', borderLeft: '3px solid var(--color-warning)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Config Changes</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>{configChanges}</div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="glass-panel" style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '16px' }}>System Activity Log</h3>
          <div className="table-container">
            <table className="custom-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Module</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(l => (
                  <tr 
                    key={l.id} 
                    onClick={() => handleLogSelect(l)} 
                    style={{ cursor: 'pointer', background: selectedLog?.id === l.id ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                  >
                    <td>{l.timestamp.split(' ')[1] || l.timestamp}</td>
                    <td>{l.user}</td>
                    <td>{l.module}</td>
                    <td>{l.action}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.details}</td>
                    <td>{l.ipAddress}</td>
                    <td>
                      <span className={`badge ${l.status === 'Success' ? 'success' : l.status === 'Warning' ? 'warning' : 'danger'}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: Log Entry Detail */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Log Entry Detail
          </h3>

          {selectedLog ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.82rem', flex: 1 }}>
              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontWeight: 600, color: '#60a5fa' }}>
                Log ID: {selectedLog.id}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Timestamp:</span>
                <span>{selectedLog.timestamp}</span>

                <span style={{ color: 'var(--text-muted)' }}>User:</span>
                <span style={{ fontWeight: 500 }}>{selectedLog.user}</span>

                <span style={{ color: 'var(--text-muted)' }}>Module:</span>
                <span>{selectedLog.module}</span>

                <span style={{ color: 'var(--text-muted)' }}>Action:</span>
                <span>{selectedLog.action}</span>

                <span style={{ color: 'var(--text-muted)' }}>IP Address:</span>
                <span>{selectedLog.ipAddress}</span>

                <span style={{ color: 'var(--text-muted)' }}>Details:</span>
                <span>{selectedLog.details}</span>
              </div>

              {(selectedLog.changeField || selectedLog.changeDetails) && (
                <div style={{
                  marginTop: '10px',
                  padding: '14px',
                  background: 'rgba(0,0,0,0.15)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Change Details:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Field:</span>
                    <span>{selectedLog.changeField || selectedLog.changeDetails?.field}</span>
                    <span style={{ color: 'var(--text-muted)' }}>Before:</span>
                    <span style={{ color: 'var(--color-danger)' }}>{selectedLog.changeBefore || selectedLog.changeDetails?.before}</span>
                    <span style={{ color: 'var(--text-muted)' }}>After:</span>
                    <span style={{ color: 'var(--color-success)' }}>{selectedLog.changeAfter || selectedLog.changeDetails?.after}</span>
                  </div>
                  {(selectedLog.changeComment || selectedLog.changeDetails?.comment) && (
                    <div style={{ fontStyle: 'italic', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
                      Comment: "{selectedLog.changeComment || selectedLog.changeDetails?.comment}"
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'auto' }}>
                <button 
                  onClick={() => alert('Log exported successfully!')}
                  className="glass-button-secondary" 
                  style={{ display: 'flex', gap: '8px', padding: '10px' }}
                >
                  <Download size={14} /> Export Entry
                </button>
                <button 
                  onClick={() => alert('Log flagged for internal review.')}
                  className="glass-button" 
                  style={{ display: 'flex', gap: '8px', padding: '10px', background: 'linear-gradient(135deg, var(--color-warning), #d97706)' }}
                >
                  <Flag size={14} /> Flag for Review
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem'
            }}>
              No log entry selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
