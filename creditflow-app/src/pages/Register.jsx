import React, { useState } from 'react';
import { Shield, Key, Mail, User, Landmark, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function Register({ onRegister, onNavigateToLogin, onNavigateToLanding }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Remedial Officer');
  const [branch, setBranch] = useState('Colombo Main Branch');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!fullName || !email || !username || !password || !role || !branch) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!agree) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    const res = await onRegister({
      fullName,
      email,
      username,
      password,
      role,
      branch
    });

    if (res && res.success) {
      setSuccess(true);
      setTimeout(() => {
        onNavigateToLogin();
      }, 1500);
    } else if (res) {
      setError(res.error);
    } else {
      setError('An error occurred during registration.');
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

      {/* Main Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <div className="glass-panel" style={{
          width: '480px',
          padding: '36px',
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
              marginBottom: '16px',
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
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--color-primary), #10b981)',
            boxShadow: '0 4px 15px var(--color-primary-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '16px'
          }}>
            <Shield size={24} />
          </div>

          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            CreditFlow
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Create New Account
          </p>

          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '6px',
                color: '#f87171',
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: 500
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '6px',
                color: '#34d399',
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: 500
              }}>
                Registration successful! Redirecting to login...
              </div>
            )}

            {/* Full Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Full Name <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Email Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Email Address <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@bank.lk"
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Username & Password row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Username <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="glass-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Password <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="glass-input"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Role selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Select Role <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <ShieldCheck size={15} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '38px', appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="Remedial Officer">Remedial Officer</option>
                  <option value="Credit Officer">Credit Officer</option>
                  <option value="Sales Officer">Sales Officer</option>
                  <option value="CCPU User">CCPU User</option>
                  <option value="Risk & Compliance">Risk & Compliance</option>
                </select>
              </div>
            </div>

            {/* Branch selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Branch Location <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Landmark size={15} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '38px', appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="Colombo Main Branch">Colombo Main Branch</option>
                  <option value="Negombo Branch">Negombo Branch</option>
                  <option value="Kandy Branch">Kandy Branch</option>
                  <option value="Gampaha Branch">Gampaha Branch</option>
                  <option value="Kurunegala Branch">Kurunegala Branch</option>
                  <option value="Matara Branch">Matara Branch</option>
                </select>
              </div>
            </div>

            {/* Agreement */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px' }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', marginTop: '2px' }}
              />
              <span>
                I agree to the <a href="#terms" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Terms of Service</a> and <a href="#privacy" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Privacy Policy</a>.
              </span>
            </label>

            {/* Submit */}
            <button type="submit" className="glass-button" style={{ width: '100%', height: '40px', fontSize: '0.9rem', marginTop: '6px' }}>
              REGISTER
            </button>
          </form>

          {/* Navigate back */}
          <div style={{ marginTop: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.8rem',
                textDecoration: 'underline'
              }}
            >
              Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
