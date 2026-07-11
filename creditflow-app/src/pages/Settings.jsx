import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';

export default function Settings() {
  // Config States
  const [dpdRule, setDpdRule] = useState('90');
  const [aiThreshold, setAiThreshold] = useState('80');

  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [savingCfg, setSavingCfg] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const SAMPLE_LOANS = [
    { accountNo: 'LA-2024-001001', customerId: 'CUST-01001', customerName: 'K. L. Rahal Cooray', nicNumber: '198522304912V', contactNumber: '+94 77 220 1199', loanType: 'Personal Loan', currentEMI: 25000, outstandingBalance: 1200000, interestRate: 14.0, remainingTenure: 36, dpd: 45 },
    { accountNo: 'LA-2024-001002', customerId: 'CUST-01002', customerName: 'Dilani Wickramasinghe', nicNumber: '199065403211V', contactNumber: '+94 71 889 0022', loanType: 'Housing Loan', currentEMI: 90000, outstandingBalance: 8000000, interestRate: 11.5, remainingTenure: 144, dpd: 92 },
    { accountNo: 'LA-2024-001003', customerId: 'CUST-01003', customerName: 'Tharindu Jayasekara', nicNumber: '198211204859V', contactNumber: '+94 76 443 1122', loanType: 'Personal Loan', currentEMI: 45000, outstandingBalance: 3000000, interestRate: 15.0, remainingTenure: 48, dpd: 62 },
    { accountNo: 'LA-2024-001004', customerId: 'CUST-01004', customerName: 'Priyantha Herath', nicNumber: '197808904561V', contactNumber: '+94 72 990 8877', loanType: 'Housing Loan', currentEMI: 120000, outstandingBalance: 11000000, interestRate: 12.0, remainingTenure: 120, dpd: 105 },
    { accountNo: 'LA-2024-001005', customerId: 'CUST-01005', customerName: 'Nilanthi Rajapakse', nicNumber: '198455601248V', contactNumber: '+94 77 334 5566', loanType: 'Personal Loan', currentEMI: 18000, outstandingBalance: 800000, interestRate: 14.5, remainingTenure: 24, dpd: 32 },
    { accountNo: 'LA-2024-001006', customerId: 'CUST-01006', customerName: 'Ruwan Fernando', nicNumber: '198912408933V', contactNumber: '+94 71 556 7788', loanType: 'Housing Loan', currentEMI: 65000, outstandingBalance: 5500000, interestRate: 11.0, remainingTenure: 96, dpd: 42 },
    { accountNo: 'LA-2024-001007', customerId: 'CUST-01007', customerName: 'Anura Kumara Senanayake', nicNumber: '197022301149V', contactNumber: '+94 76 990 1122', loanType: 'Personal Loan', currentEMI: 50000, outstandingBalance: 4000000, interestRate: 15.5, remainingTenure: 60, dpd: 95 },
    { accountNo: 'LA-2024-001008', customerId: 'CUST-01008', customerName: 'Harshani Gunawardena', nicNumber: '199277801244V', contactNumber: '+94 77 889 2233', loanType: 'Housing Loan', currentEMI: 80000, outstandingBalance: 7000000, interestRate: 11.8, remainingTenure: 180, dpd: 38 },
    { accountNo: 'LA-2024-001009', customerId: 'CUST-01009', customerName: 'Manjula Peiris', nicNumber: '198009204481V', contactNumber: '+94 71 332 4455', loanType: 'Personal Loan', currentEMI: 30000, outstandingBalance: 1500000, interestRate: 14.2, remainingTenure: 36, dpd: 58 },
    { accountNo: 'LA-2024-001010', customerId: 'CUST-01010', customerName: 'Shalika Gunasekara', nicNumber: '198755409988V', contactNumber: '+94 76 112 3344', loanType: 'Housing Loan', currentEMI: 110000, outstandingBalance: 9500000, interestRate: 12.2, remainingTenure: 144, dpd: 112 },
    { accountNo: 'LA-2024-001011', customerId: 'CUST-01011', customerName: 'Buddhika Ratnayake', nicNumber: '198612903342V', contactNumber: '+94 77 667 8899', loanType: 'Personal Loan', currentEMI: 28000, outstandingBalance: 1800000, interestRate: 14.8, remainingTenure: 48, dpd: 41 },
    { accountNo: 'LA-2024-001012', customerId: 'CUST-01012', customerName: 'Sanduni Alwis', nicNumber: '199388701239V', contactNumber: '+94 71 998 0011', loanType: 'Housing Loan', currentEMI: 75000, outstandingBalance: 6500000, interestRate: 11.2, remainingTenure: 120, dpd: 84 },
    { accountNo: 'LA-2024-001013', customerId: 'CUST-01013', customerName: 'Kasun Jayawardena', nicNumber: '199102403259V', contactNumber: '+94 76 887 9900', loanType: 'Personal Loan', currentEMI: 35000, outstandingBalance: 2200000, interestRate: 15.0, remainingTenure: 36, dpd: 47 },
    { accountNo: 'LA-2024-001014', customerId: 'CUST-01014', customerName: 'Duminda Silva', nicNumber: '197734901248V', contactNumber: '+94 72 334 9988', loanType: 'Housing Loan', currentEMI: 130000, outstandingBalance: 12000000, interestRate: 12.5, remainingTenure: 180, dpd: 108 },
    { accountNo: 'LA-2024-001015', customerId: 'CUST-01015', customerName: 'Oshadi Fernando', nicNumber: '199566708891V', contactNumber: '+94 77 443 6677', loanType: 'Personal Loan', currentEMI: 15000, outstandingBalance: 600000, interestRate: 14.0, remainingTenure: 24, dpd: 35 },
    { accountNo: 'LA-2024-001016', customerId: 'CUST-01016', customerName: 'Isuru Perera', nicNumber: '198829402219V', contactNumber: '+94 71 667 9988', loanType: 'Housing Loan', currentEMI: 95000, outstandingBalance: 8500000, interestRate: 11.9, remainingTenure: 144, dpd: 76 },
    { accountNo: 'LA-2024-001017', customerId: 'CUST-01017', customerName: 'Chathurika Jayasinghe', nicNumber: '198356701149V', contactNumber: '+94 76 554 8877', loanType: 'Personal Loan', currentEMI: 40000, outstandingBalance: 2500000, interestRate: 15.2, remainingTenure: 48, dpd: 52 },
    { accountNo: 'LA-2024-001018', customerId: 'CUST-01018', customerName: 'Nalin de Silva', nicNumber: '197412304899V', contactNumber: '+94 77 112 0099', loanType: 'Housing Loan', currentEMI: 140000, outstandingBalance: 13000000, interestRate: 12.8, remainingTenure: 168, dpd: 115 },
    { accountNo: 'LA-2024-001019', customerId: 'CUST-01019', customerName: 'Hansani Wijewardene', nicNumber: '199467803321V', contactNumber: '+94 71 889 4433', loanType: 'Personal Loan', currentEMI: 22000, outstandingBalance: 1100000, interestRate: 14.5, remainingTenure: 36, dpd: 43 },
    { accountNo: 'LA-2024-001020', customerId: 'CUST-01020', customerName: 'Samantha Dissanayake', nicNumber: '197902409981V', contactNumber: '+94 76 998 1133', loanType: 'Housing Loan', currentEMI: 105000, outstandingBalance: 9000000, interestRate: 12.1, remainingTenure: 120, dpd: 98 }
  ];

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

  const handleSeedSampleData = async () => {
    setSeeding(true);
    setStatusMsg({ text: 'Seeding 20 sample loans into Core Banking...', type: 'info' });
    let successCount = 0;
    try {
      for (const loan of SAMPLE_LOANS) {
        const res = await api.createLoan(loan);
        if (res && res.success) {
          successCount++;
        }
      }
      if (successCount > 0) {
        setStatusMsg({ text: `Successfully seeded ${successCount} sample loans in Core Banking!`, type: 'success' });
      } else {
        setStatusMsg({ text: 'Failed to seed sample loans.', type: 'error' });
      }
    } catch (e) {
      setStatusMsg({ text: 'Error seeding sample data.', type: 'error' });
    } finally {
      setSeeding(false);
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
            Simulate importing active bank customer records into the Core Banking System. Once seeded, you can retrieve them during case intake using their account number.
          </p>

          {statusMsg.text && (
            <div style={{
              background: 
                statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.12)' : 
                statusMsg.type === 'info' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: 
                statusMsg.type === 'error' ? '1px solid rgba(239, 68, 68, 0.25)' : 
                statusMsg.type === 'info' ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '6px',
              color: 
                statusMsg.type === 'error' ? '#f87171' : 
                statusMsg.type === 'info' ? '#60a5fa' : '#34d399',
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

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '200px', 
            border: '1px dashed rgba(255,255,255,0.08)', 
            borderRadius: '8px', 
            padding: '30px' 
          }}>
            <Database size={48} style={{ color: 'var(--color-primary)', opacity: 0.8 }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>Automated Dataset Loader</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', maxWidth: '280px', lineHeight: 1.3 }}>
                Click below to insert a pre-configured profile set containing 20 Sri Lankan active bank customer loans into the Core Banking System.
              </div>
            </div>
            <button 
              onClick={handleSeedSampleData} 
              disabled={seeding} 
              className="glass-button" 
              style={{ display: 'flex', gap: '8px', opacity: seeding ? 0.6 : 1, padding: '10px 20px', fontSize: '0.85rem' }}
            >
              <Database size={16} /> {seeding ? 'Seeding Data…' : 'Seed 20 Sample Loans'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
