import React, { useState } from 'react';
import { Shield, Key, UserCheck, ArrowLeft } from 'lucide-react';

export default function Login({ onLogin, onNavigateToRegister, onNavigateToLanding }) {
  const [username, setUsername] = useState('remedial'); // default for easy testing
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState('Remedial Officer');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const res = await onLogin(username, password, role);
    if (res && !res.success) {
      setError(res.error);
    }
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    onLogin('', '', role, true);
  };

  // Quick helper to fill credentials based on role selection
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    switch (selectedRole) {
      case 'Super Admin':
        setUsername('admin');
        break;
      case 'Remedial Officer':
        setUsername('remedial');
        break;
      case 'Credit Officer':
        setUsername('credit');
        break;
      case 'Sales Officer':
        setUsername('sales');
        break;
      case 'CCPU User':
        setUsername('ccpu');
        break;
      case 'Risk & Compliance':
        setUsername('risk');
        break;
      default:
        setUsername('');
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(circle at 50% 50%, rgba(17, 24, 39, 1) 0%, rgba(8, 10, 18, 1) 100%)',
    }}>
      {/* Top Header */}
      <div style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(11, 15, 25, 0.4)'
      }}>
        <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          CreditFlow – Automated Loan Restructuring System
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          v2.4.1 | Secure Banking Platform
        </div>
      </div>

      {/* Main Login Card Body */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="glass-panel" style={{
          width: '440px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <button
            onClick={onNavigateToLanding}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              alignSelf: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              marginBottom: '20px',
              padding: 0,
              transition: 'color 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            <ArrowLeft size={14} /> Back to Home
          </button>

          {/* Logo */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--color-primary), #10b981)',
            boxShadow: '0 8px 20px var(--color-primary-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '20px'
          }}>
            <Shield size={32} />
          </div>

          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            CreditFlow
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Automated Loan Restructuring System
          </p>

          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '6px',
                color: '#f87171',
                padding: '10px 14px',
                fontSize: '0.82rem',
                fontWeight: 500
              }}>
                {error}
              </div>
            )}

            {/* Role selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                User Role
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <UserCheck size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '38px', appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Remedial Officer">Remedial Officer</option>
                  <option value="Credit Officer">Credit Officer</option>
                  <option value="Sales Officer">Sales Officer</option>
                  <option value="CCPU User">CCPU User</option>
                  <option value="Risk & Compliance">Risk & Compliance</option>
                </select>
              </div>
            </div>

            {/* Username */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="glass-input"
                style={{ width: '100%' }}
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Key size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                Remember Me
              </label>
              <a href="#forgot" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
                Forgot Password?
              </a>
            </div>

            {/* Submit */}
            <button type="submit" className="glass-button" style={{ width: '100%', height: '44px', fontSize: '0.95rem', marginTop: '10px' }}>
              LOGIN
            </button>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="glass-button demo-login-btn"
              style={{
                width: '100%',
                height: '44px',
                fontSize: '0.95rem',
                marginTop: '10px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(5, 150, 105, 0.4) 100%)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
              }}
            >
              DEMO LOGIN
            </button>
          </form>

          {/* Create account */}
          <div style={{ marginTop: '24px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button
              onClick={onNavigateToRegister}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.82rem',
                textDecoration: 'underline'
              }}
            >
              Register here
            </button>
          </div>

          {/* Footer lock note */}
          <div style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-color)',
            width: '100%',
            textAlign: 'center',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <Shield size={12} />
            This system is for authorized users only. All activity is monitored.
          </div>
        </div>
      </div>
    </div>
  );
}
