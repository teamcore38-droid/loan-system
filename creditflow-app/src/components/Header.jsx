import React, { useState } from 'react';
import { Bell, Search, User, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function Header({ pageTitle, user, notifications, onNotificationClick }) {
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return null;

  // Filter notifications for active user's role
  const userNotifications = notifications.filter(n => n.role === user.role);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />;
      case 'warning':
        return <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />;
      default:
        return <Info size={16} style={{ color: 'var(--color-primary)' }} />;
    }
  };

  return (
    <div className="glass-panel" style={{
      height: 'var(--header-height)',
      borderRadius: '0',
      borderBottom: '1px solid var(--border-color)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 9
    }}>
      {/* Title */}
      <div>
        <h1 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)'
        }}>
          {pageTitle}
        </h1>
      </div>

      {/* Action Area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            placeholder="Search cases, customers..."
            className="glass-input"
            style={{
              paddingLeft: '38px',
              width: '260px',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: showNotifications ? '#60a5fa' : 'var(--text-secondary)',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Bell size={20} />
            {userNotifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--color-danger)',
                boxShadow: '0 0 6px var(--color-danger)'
              }} />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              width: '320px',
              maxHeight: '380px',
              overflowY: 'auto',
              zIndex: 100,
              padding: '12px 0',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                padding: '0 16px 8px 16px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Recent Notifications</span>
                <span className="badge primary" style={{ fontSize: '0.7rem' }}>
                  {userNotifications.length} New
                </span>
              </div>

              {userNotifications.length === 0 ? (
                <div style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}>
                  No new notifications.
                </div>
              ) : (
                userNotifications.map((notif, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (onNotificationClick) onNotificationClick(notif);
                      setShowNotifications(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                      display: 'flex',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ marginTop: '2px' }}>
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                        {notif.message}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Just now
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User profile dropdown badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderLeft: '1px solid var(--border-color)',
          paddingLeft: '20px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}>
            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.employeeId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
