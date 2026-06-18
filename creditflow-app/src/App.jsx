import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CaseCreation from './pages/CaseCreation';
import DocVerification from './pages/DocVerification';
import WorkflowManager from './pages/WorkflowManager';
import UserManagement from './pages/UserManagement';
import AuditLogs from './pages/AuditLogs';
import Reports from './pages/Reports';
import Landing from './pages/Landing';
import Settings from './pages/Settings';

import { api } from './utils/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('landing');
  
  // Page routing state
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  const [customAlert, setCustomAlert] = useState(null);

  // Override global alert system to display modern, professional toasts
  useEffect(() => {
    window.alert = (message) => {
      let type = 'success';
      const msg = message.toLowerCase();
      if (msg.includes('fail') || msg.includes('error') || msg.includes('invalid') || msg.includes('missing')) {
        type = 'danger';
      } else if (msg.includes('warning') || msg.includes('return') || msg.includes('pending') || msg.includes('draft')) {
        type = 'warning';
      }
      
      setCustomAlert({ message, type });
      
      // Auto close after 3.5 seconds
      setTimeout(() => {
        setCustomAlert(prev => (prev && prev.message === message) ? null : prev);
      }, 3500);
    };
  }, []);

  // Database synchronised states
  const [cases, setCases] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Load session on mount
  useEffect(() => {
    const userStr = sessionStorage.getItem('cf_current_user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
      refreshData();
    }
  }, []);

  // Poll or refresh data from backend
  const refreshData = async () => {
    const fetchedCases = await api.getCases();
    setCases(fetchedCases);
    
    // Simulate notifications & tasks matching active cases stages
    generateMockNotificationsAndTasks(fetchedCases);
  };

  const generateMockNotificationsAndTasks = (activeCases) => {
    const mockNotifs = [];
    const mockTasks = [];

    activeCases.forEach(c => {
      if (c.stage === 3) {
        mockNotifs.push({ role: 'Remedial Officer', message: `Case ${c.id} requires doc upload`, type: 'warning' });
        mockTasks.push({ role: 'Remedial Officer', text: `Review ${c.id} documents`, done: false });
      }
      if (c.stage === 4) {
        mockNotifs.push({ role: 'Credit Officer', message: `Case ${c.id} requires credit evaluation`, type: 'info' });
        mockTasks.push({ role: 'Credit Officer', text: `Approve ${c.id} pending request`, done: false });
      }
      if (c.stage === 5) {
        mockNotifs.push({ role: 'Sales Officer', message: `Case ${c.id} approved by Credit - collect signature`, type: 'success' });
        mockTasks.push({ role: 'Sales Officer', text: `Collect signatures for ${c.id}`, done: false });
      }
      if (c.stage === 6) {
        mockNotifs.push({ role: 'CCPU User', message: `${c.id} ready for execution in CBS`, type: 'info' });
        mockTasks.push({ role: 'CCPU User', text: `Sync ${c.id} terms with CBS`, done: false });
      }
      if (c.stage === 7) {
        mockNotifs.push({ role: 'Risk & Compliance', message: `${c.id} monitoring activated`, type: 'info' });
      }
    });

    setNotifications(mockNotifs);
    setTasks(mockTasks);
  };

  const handleLogin = async (username, password, role) => {
    const res = await api.login(username, password, role);
    if (res.success) {
      setCurrentUser(res.user);
      await refreshData();
      setActivePage('dashboard');
    }
    return res;
  };

  const handleRegister = async (userData) => {
    return await api.register(userData);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setAuthView('landing');
  };

  const handleToggleTask = (taskText) => {
    setTasks(tasks.map(t => t.text === taskText ? { ...t, done: !t.done } : t));
  };

  const handleNavigateToCase = (caseId) => {
    setSelectedCaseId(caseId);
    setActivePage('case-detail');
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'System Overview Dashboard';
      case 'cases': return 'Loan Restructuring Cases';
      case 'restructure': return 'Restructuring Case Management';
      case 'create-case': return 'Create Restructuring Case';
      case 'approvals': return 'Credit Approval Queue';
      case 'monitoring': return 'Compliance & Monitoring Tracker';
      case 'reports': return 'Reports & Analytics Insights';
      case 'audit': return 'Security Audit Trail Logs';
      case 'users': return 'Super Admin User Management';
      case 'settings': return 'System Parameters & Configurations';
      case 'case-detail': 
        const c = cases.find(item => item.id === selectedCaseId);
        return c ? `Case Detail: ${c.id} (${c.customerName})` : 'Case Workflow View';
      default: return 'CreditFlow';
    }
  };

  const renderPageContent = () => {
    const currentCase = cases.find(c => c.id === selectedCaseId);

    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard 
            cases={cases} 
            notifications={notifications} 
            tasks={tasks} 
            onToggleTask={handleToggleTask} 
            onNavigateToCase={handleNavigateToCase}
            user={currentUser}
          />
        );
      case 'cases':
      case 'restructure':
      case 'approvals':
      case 'monitoring':
        let visibleCases = cases;
        if (activePage === 'approvals') visibleCases = cases.filter(c => c.stage === 4);
        if (activePage === 'monitoring') visibleCases = cases.filter(c => c.stage === 7);

        return (
          <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.05rem' }}>Active Loan Portfolio</h3>
              {currentUser.role === 'Remedial Officer' && (
                <button onClick={() => setActivePage('create-case')} className="glass-button">
                  + Create New Case
                </button>
              )}
            </div>
            <div className="table-container" style={{ flex: 1 }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Customer</th>
                    <th>Account No</th>
                    <th>Loan Type</th>
                    <th>DPD Status</th>
                    <th>Current Stage</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleCases.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600, color: '#60a5fa' }}>{c.id}</td>
                      <td>{c.customerName}</td>
                      <td>{c.loanAccountNo}</td>
                      <td>{c.loanType}</td>
                      <td>
                        <span className={`badge ${c.dpd >= 90 ? 'danger' : 'warning'}`}>
                          {c.dpd} DPD
                        </span>
                      </td>
                      <td>Stage {c.stage}</td>
                      <td>
                        <span className={`badge ${c.status === 'Monitoring Active' ? 'success' : c.status.includes('Pending') ? 'warning' : 'primary'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleNavigateToCase(c.id)} className="glass-button" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                          Manage Case
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'create-case':
        return <CaseCreation setActivePage={setActivePage} setSelectedCaseId={setSelectedCaseId} onRefreshCases={refreshData} />;
      case 'case-detail':
        if (!currentCase) return <div>Case not found.</div>;
        if (currentCase.stage === 3 && (currentUser.role === 'Remedial Officer' || currentUser.role === 'Super Admin')) {
          return (
            <DocVerification 
              caseObj={currentCase} 
              onRefreshCase={refreshData} 
              setActivePage={setActivePage} 
            />
          );
        }
        return (
          <WorkflowManager 
            caseObj={currentCase} 
            onRefreshCase={refreshData} 
            setActivePage={setActivePage} 
            user={currentUser}
          />
        );
      case 'reports':
        return <Reports />;
      case 'audit':
        return <AuditLogs />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <div>Page not found.</div>;
    }
  };

  if (!currentUser) {
    if (authView === 'register') {
      return (
        <Register 
          onRegister={handleRegister} 
          onNavigateToLogin={() => setAuthView('login')} 
          onNavigateToLanding={() => setAuthView('landing')}
        />
      );
    }
    if (authView === 'login') {
      return (
        <Login 
          onLogin={handleLogin} 
          onNavigateToRegister={() => setAuthView('register')} 
          onNavigateToLanding={() => setAuthView('landing')}
        />
      );
    }
    return (
      <Landing 
        onNavigateToLogin={() => setAuthView('login')} 
        onNavigateToRegister={() => setAuthView('register')} 
      />
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        user={currentUser} 
        onLogout={handleLogout}
        notifications={notifications}
      />
      <div className="main-content">
        <Header 
          pageTitle={getPageTitle()} 
          user={currentUser} 
          notifications={notifications}
          onNotificationClick={(n) => {
            if (n.message.includes('CF-')) {
              const matches = n.message.match(/CF-\d+-\d+/);
              if (matches) handleNavigateToCase(matches[0]);
            }
          }}
        />
        <div className="page-container">
          {renderPageContent()}
        </div>
      </div>

      {/* Premium Custom Alert Toast */}
      {customAlert && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 24px',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(16px)',
          borderLeft: `4px solid ${
            customAlert.type === 'success' ? '#10b981' : 
            customAlert.type === 'danger' ? '#ef4444' : '#f59e0b'
          }`,
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          color: '#f8fafc',
          maxWidth: '380px',
          animation: 'slideIn 0.3s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {customAlert.type === 'success' && <CheckCircle size={20} color="#10b981" />}
            {customAlert.type === 'danger' && <AlertTriangle size={20} color="#ef4444" />}
            {customAlert.type === 'warning' && <AlertTriangle size={20} color="#f59e0b" />}
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.4, flex: 1 }}>
            {customAlert.message}
          </div>
          <button 
            onClick={() => setCustomAlert(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              marginLeft: '8px'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
