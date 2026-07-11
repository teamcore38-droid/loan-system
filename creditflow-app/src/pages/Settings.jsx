import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';

export default function Settings() {
  // Config States
  const [dpdRule, setDpdRule] = useState('90');
  const [aiThreshold, setAiThreshold] = useState('80');

  // CBS Loan Seeder States
  const [accountNo, setAccountNo] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [nicNumber, setNicNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loanType, setLoanType] = useState('Personal Loan');
  const [currentEmi, setCurrentEmi] = useState('');
  const [outstandingBalance, setOutstandingBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [remainingTenure, setRemainingTenure] = useState('');
  const [dpd, setDpd] = useState('');

  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [savingCfg, setSavingCfg] = useState(false);

  // Load persisted system parameters on mount.
  useEffect(() => {
    let active = true;
    api.getConfig().then(cfg => {
      if (!active || !cfg) return;
      if (cfg.dpdCutoff) setDpdRule(String(cfg.dpdCutoff));
      if (cfg.aiConfidenceThreshold) setAiThreshold(String(cfg.aiConfidenceThreshold));
    });
    return () => { active = false; };
  }, []);

  const handleSaveConfigs = async () => {
    setSavingCfg(true);
    setStatusMsg({ text: '', type: '' });
    const res = await api.saveConfig({ dpdCutoff: dpdRule, aiConfidenceThreshold: aiThreshold });
    setSavingCfg(false);
    if (res && res.success) {
      setStatusMsg({ text: 'System parameters saved to the database.', type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    } else {
      setStatusMsg({ text: (res && res.error) || 'Failed to save system parameters.', type: 'error' });
    }
  };

  const handleSeedLoan = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', type: '' });

    if (!accountNo || !customerId || !customerName || !nicNumber || !contactNumber || !loanType || !currentEmi || !outstandingBalance || !interestRate || !remainingTenure || !dpd) {
      setStatusMsg({ text: 'Please fill in all loan details.', type: 'error' });
      return;
    }

    const payload = {
      accountNo,
      customerId,
      customerName,
      nicNumber,
      contactNumber,
      loanType,
      currentEMI: parseFloat(currentEmi),
      outstandingBalance: parseFloat(outstandingBalance),
      interestRate: parseFloat(interestRate),
      remainingTenure: parseInt(remainingTenure),
      dpd: parseInt(dpd)
    };

    const res = await api.createLoan(payload);
    if (res.success) {
      setStatusMsg({ text: `Success! Loan Account ${accountNo} seeded in Core Banking.`, type: 'success' });
      // Reset form fields
      setAccountNo('');
      setCustomerId('');
      setCustomerName('');
      setNicNumber('');
      setContactNumber('');
      setLoanType('Personal Loan');
      setCurrentEmi('');
      setOutstandingBalance('');
      setInterestRate('');
      setRemainingTenure('');
      setDpd('');
    } else {
      setStatusMsg({ text: res.error || 'Failed to seed loan profile.', type: 'error' });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100%' }}>
      
      {/* Left Column: System Configurations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{
            fontSize: '1rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <SettingsIcon size={18} /> System Settings & Rules Setup
          </h3>

          {statusMsg.text && statusMsg.type === 'success' && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '6px',
              color: '#34d399',
              padding: '10px 14px',
              fontSize: '0.82rem',
              fontWeight: 500,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle size={14} /> {statusMsg.text}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>CBSL DPD Cutoff Rules</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
                  Define DPD threshold for restructure vs reschedule classification
                </div>
              </div>
              <select 
                value={dpdRule}
                onChange={(e) => setDpdRule(e.target.value)}
                className="glass-input" 
                style={{ width: '120px', padding: '6px 12px' }}
              >
                <option value="90">90 Days</option>
                <option value="120">120 Days</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '14px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>AI Document Confidence Threshold</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
                  Minimum score required to automatically proceed to approval
                </div>
              </div>
              <select 
                value={aiThreshold}
                onChange={(e) => setAiThreshold(e.target.value)}
                className="glass-input" 
                style={{ width: '120px', padding: '6px 12px' }}
              >
                <option value="75">75%</option>
                <option value="80">80%</option>
                <option value="85">85%</option>
              </select>
            </div>

            <button onClick={handleSaveConfigs} disabled={savingCfg} className="glass-button" style={{ marginTop: '10px', alignSelf: 'flex-start', opacity: savingCfg ? 0.6 : 1 }}>
              {savingCfg ? 'Saving…' : 'Save Configurations'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: CBS Loan Account Seeder */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{
            fontSize: '1rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Database size={18} /> CBS Simulator: Mock Loan Seeder
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Simulate importing a loan file or inserting an active bank customer record into Core Banking. Once seeded, you can retrieve it during case intake using the account number.
          </p>

          {statusMsg.text && statusMsg.type !== 'success' && (
            <div style={{
              background: statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: statusMsg.type === 'error' ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '6px',
              color: statusMsg.type === 'error' ? '#f87171' : '#34d399',
              padding: '10px 14px',
              fontSize: '0.82rem',
              fontWeight: 500,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {statusMsg.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSeedLoan} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Loan Account No.</label>
                <input 
                  type="text" 
                  value={accountNo} 
                  onChange={(e) => setAccountNo(e.target.value)} 
                  placeholder="e.g. LA-2024-001234"
                  className="glass-input" 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Customer ID</label>
                <input 
                  type="text" 
                  value={customerId} 
                  onChange={(e) => setCustomerId(e.target.value)} 
                  placeholder="e.g. CUST-00999"
                  className="glass-input" 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Customer Name</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  placeholder="e.g. John Silva"
                  className="glass-input" 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>NIC Number</label>
                <input 
                  type="text" 
                  value={nicNumber} 
                  onChange={(e) => setNicNumber(e.target.value)} 
                  placeholder="e.g. 198001245678V"
                  className="glass-input" 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Contact Number</label>
                <input 
                  type="text" 
                  value={contactNumber} 
                  onChange={(e) => setContactNumber(e.target.value)} 
                  placeholder="e.g. +94 77 123 4567"
                  className="glass-input" 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Loan Type</label>
                <select 
                  value={loanType} 
                  onChange={(e) => setLoanType(e.target.value)} 
                  className="glass-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Housing Loan">Housing Loan</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Current EMI (LKR)</label>
                <input 
                  type="number" 
                  value={currentEmi} 
                  onChange={(e) => setCurrentEmi(e.target.value)} 
                  placeholder="72000"
                  className="glass-input" 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Outstanding (LKR)</label>
                <input 
                  type="number" 
                  value={outstandingBalance} 
                  onChange={(e) => setOutstandingBalance(e.target.value)} 
                  placeholder="6000000"
                  className="glass-input" 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Interest Rate (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={interestRate} 
                  onChange={(e) => setInterestRate(e.target.value)} 
                  placeholder="12.0"
                  className="glass-input" 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Tenure (Months)</label>
                <input 
                  type="number" 
                  value={remainingTenure} 
                  onChange={(e) => setRemainingTenure(e.target.value)} 
                  placeholder="120"
                  className="glass-input" 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Days Past Due (DPD)</label>
                <input 
                  type="number" 
                  value={dpd} 
                  onChange={(e) => setDpd(e.target.value)} 
                  placeholder="45"
                  className="glass-input" 
                />
              </div>
            </div>

            <button type="submit" className="glass-button" style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start', marginTop: '10px' }}>
              <Database size={16} /> Seed CBS Loan Profile
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
