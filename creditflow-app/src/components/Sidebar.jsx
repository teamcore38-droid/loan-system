import React from 'react';
import { 
  LayoutDashboard, 
  FolderLock, 
  GitBranch, 
  CheckSquare, 
  Activity, 
  BarChart3, 
  ShieldAlert, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, user, onLogout, notifications }) {
  if (!user) return null;

  // Filter menu items based on role
  const getMenuItems = () => {
    const allItems = [
      { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Remedial Officer', 'Credit Officer', 'Sales Officer', 'CCPU User', 'Risk & Compliance'] },
      { id: 'cases', name: 'Cases', icon: FolderLock, roles: ['Super Admin', 'Remedial Officer', 'Credit Officer', 'Sales Officer', 'CCPU User', 'Risk & Compliance'] },
      { id: 'restructure', name: 'Restructure Requests', icon: GitBranch, roles: ['Super Admin', 'Remedial Officer', 'Sales Officer'] },
      { id: 'approvals', name: 'Approvals', icon: CheckSquare, roles: ['Super Admin', 'Credit Officer'] },
      { id: 'monitoring', name: 'Monitoring', icon: Activity, roles: ['Super Admin', 'Risk & Compliance', 'Remedial Officer'] },
      { id: 'reports', name: 'Reports', icon: BarChart3, roles: ['Super Admin', 'Risk & Compliance'] },
      { id: 'audit', name: 'Audit Logs', icon: ShieldAlert, roles: ['Super Admin', 'Risk & Compliance'] },
      { id: 'users', name: 'User Mgmt', icon: Users, roles: ['Super Admin'] },
      { id: 'settings', name: 'Settings', icon: Settings, roles: ['Super Admin', 'Remedial Officer', 'Credit Officer', 'Sales Officer', 'CCPU User', 'Risk & Compliance'] }
    ];

    return allItems.filter(item => item.roles.includes(user.role));
  };

  const menuItems = getMenuItems();

  const getBadgeCount = (itemId) => {
    if (itemId === 'approvals' && user.role === 'Credit Officer') {
      return notifications.filter(n => n.role === 'Credit Officer' && n.message.includes('evaluation')).length;
    }
    if (itemId === 'restructure' && user.role === 'Sales Officer') {
      return notifications.filter(n => n.role === 'Sales Officer' && n.message.includes('collect')).length;
    }
    if (itemId === 'monitoring' && user.role === 'Risk & Compliance') {
      return notifications.filter(n => n.role === 'Risk & Compliance' && n.message.includes('alerts')).length;
    }
    return 0;
  };

  return (
    <div className="glass-panel" style={{
      width: 'var(--sidebar-width)',
      height: '100%',
      borderRadius: '0',
      borderRight: '1px solid var(--border-color)',
      borderTop: 'none',
      borderBottom: 'none',
      borderLeft: 'none',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10
    }}>
      {/* Brand Header */}
      <div style={{
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          background: 'linear-gradient(to right, #60a5fa, #34d399)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          CreditFlow
        </h2>
      </div>

      {/* User profile brief */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
          {user.role}
        </div>
        <div style={{ fontWeight: 500, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {user.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {user.branch}
        </div>
      </div>

      {/* Navigation List */}
      <div style={{
        flex: 1,
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto'
      }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          const badgeCount = getBadgeCount(item.id);

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: isActive ? '#60a5fa' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if(!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if(!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={18} style={{ color: isActive ? '#60a5fa' : 'inherit' }} />
              <span style={{ flex: 1 }}>{item.name}</span>
              {badgeCount > 0 && (
                <span className="badge danger" style={{
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '0.7rem'
                }}>
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout button */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid var(--border-color)'
      }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '8px',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontWeight: 500,
            fontSize: '0.92rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            e.currentTarget.style.color = '#f87171';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
