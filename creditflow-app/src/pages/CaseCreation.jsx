import React, { useState } from 'react';
import { Search, Calculator, Check, AlertTriangle, Save, Send } from 'lucide-react';
import { api } from '../utils/api';

export default function CaseCreation({ setActivePage, setSelectedCaseId, onRefreshCases }) {
  // Inputs
  const [loanAccountNo, setLoanAccountNo] = useState('LA-2024-008912');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [nicNumber, setNicNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // Loaded Details
  const [loanDetails, setLoanDetails] = useState(null);
  const [cbsError, setCbsError] = useState('');

  // Proposed changes
  const [proposedEMI, setProposedEMI] = useState('');
  const [proposedTenure, setProposedTenure] = useState('');
  const [revisedInterestRate, setRevisedInterestRate] = useState('');

  // Calculated Results
  const [calculationResult, setCalculationResult] = useState(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  // Retrieve details
  const handleRetrieve = async () => {
    setCbsError('');
    setLoanDetails(null);
    setCalculationResult(null);

    const loan = await api.getLoanByAccount(loanAccountNo);
    if (!loan) {
      setCbsError('Loan Account No. not found in Core Banking System.');
      return;
    }

    setLoanDetails(loan);
    setCustomerId(loan.customerId);
    setCustomerName(loan.customerName);
    setNicNumber(loan.nicNumber);
    setContactNumber(loan.contactNumber);

    setRevisedInterestRate((loan.interestRate - 2).toFixed(1));
    setProposedTenure(loan.remainingTenure + 12);
  };

  // Run calculation
  const handleCalculate = () => {
    if (!loanDetails) return;

    const principal = loanDetails.outstandingBalance;
    const rate = parseFloat(revisedInterestRate) / 100 / 12;
    const months = parseInt(proposedTenure);

    if (isNaN(rate) || isNaN(months) || months <= 0) {
      alert('Please enter valid proposed terms.');
      return;
    }

    let calculatedEmi = 0;
    if (rate === 0) {
      calculatedEmi = principal / months;
    } else {
      calculatedEmi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    }

    const emi = Math.round(calculatedEmi);
    setProposedEMI(emi);

    let balance = principal;
    const schedule = [];
    for (let i = 1; i <= Math.min(months, 12); i++) {
      const interest = Math.round(balance * rate);
      const principalPaid = Math.round(emi - interest);
      balance = Math.max(0, balance - principalPaid);
      
      schedule.push({
        month: i,
        payment: emi,
        principal: principalPaid,
        interest: interest,
        balance: balance
      });
    }

    setAmortizationSchedule(schedule);
    
    setCalculationResult({
      currentEMI: loanDetails.currentEMI,
      proposedEMI: emi,
      tenureExtension: months - loanDetails.remainingTenure,
      estimatedSavings: loanDetails.currentEMI - emi
    });
  };

  const handleSubmit = async () => {
    if (!loanDetails || !calculationResult) {
      alert('Please retrieve details and calculate the schedule first.');
      return;
    }

    const newCaseData = {
      customerId,
      customerName,
      nicNumber,
      contactNumber,
      loanAccountNo,
      loanType: loanDetails.loanType,
      currentEMI: loanDetails.currentEMI,
      outstandingBalance: loanDetails.outstandingBalance,
      interestRate: loanDetails.interestRate,
      remainingTenure: loanDetails.remainingTenure,
      dpd: loanDetails.dpd,
      classification: loanDetails.dpd < 90 ? 'Restructure (<90 Days)' : 'Reschedule (>90 Days)',
      proposedEMI: proposedEMI,
      proposedTenure: parseInt(proposedTenure),
      revisedInterestRate: parseFloat(revisedInterestRate),
      financialSummary: {
        currentEMI: loanDetails.currentEMI,
        proposedEMI: proposedEMI,
        tenureExtension: calculationResult.tenureExtension,
        estimatedSavings: calculationResult.estimatedSavings
      }
    };

    const created = await api.createCase(newCaseData);
    if (created) {
      alert(`Case ${created.id} submitted for review successfully!`);
      await onRefreshCases();
      setSelectedCaseId(created.id);
      setActivePage('cases');
    } else {
      alert('Failed to submit case. Please check connection.');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Section 1: Customer Information
          </h3>
          {cbsError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '6px',
              color: '#f87171',
              padding: '10px 14px',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              {cbsError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Loan Account No.</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={loanAccountNo}
                  onChange={(e) => setLoanAccountNo(e.target.value)}
                  className="glass-input"
                  style={{ flex: 1 }}
                  placeholder="LA-2024-000000"
                />
                <button onClick={handleRetrieve} className="glass-button" style={{ padding: '10px 16px' }}>
                  <Search size={16} /> Retrieve
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customer ID</label>
              <input type="text" readOnly value={customerId} className="glass-input" style={{ background: 'rgba(255,255,255,0.02)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customer Name</label>
              <input type="text" readOnly value={customerName} className="glass-input" style={{ background: 'rgba(255,255,255,0.02)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>NIC Number</label>
              <input type="text" readOnly value={nicNumber} className="glass-input" style={{ background: 'rgba(255,255,255,0.02)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Contact Number</label>
              <input type="text" readOnly value={contactNumber} className="glass-input" style={{ background: 'rgba(255,255,255,0.02)' }} />
            </div>
          </div>
        </div>

        {loanDetails && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Section 2: Loan Details (Core Banking System)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Current EMI</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>LKR {loanDetails.currentEMI.toLocaleString()}</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Outstanding Bal.</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>LKR {loanDetails.outstandingBalance.toLocaleString()}</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Interest Rate</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{loanDetails.interestRate}% p.a.</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Remaining Tenure</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{loanDetails.remainingTenure} months</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Days Past Due</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px', color: loanDetails.dpd >= 90 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                  {loanDetails.dpd} days
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>Classification:</span>
              <span className={`badge ${loanDetails.dpd >= 90 ? 'danger' : 'warning'}`} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                STATUS: {loanDetails.dpd < 90 ? 'Restructure (<90 Days)' : 'Reschedule (>90 Days)'}
              </span>
            </div>
          </div>
        )}

        {loanDetails && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Section 3: Proposed Changes
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Proposed Tenure (months)</label>
                <input
                  type="number"
                  value={proposedTenure}
                  onChange={(e) => setProposedTenure(e.target.value)}
                  className="glass-input"
                  placeholder="e.g. 60"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Revised Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={revisedInterestRate}
                  onChange={(e) => setRevisedInterestRate(e.target.value)}
                  className="glass-input"
                  placeholder="e.g. 12.5"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Proposed EMI (Calculated)</label>
                <input
                  type="text"
                  readOnly
                  value={proposedEMI ? `LKR ${proposedEMI.toLocaleString()}` : 'Click Calculate'}
                  className="glass-input"
                  style={{ background: 'rgba(255,255,255,0.02)', fontWeight: 600 }}
                />
              </div>
            </div>

            <button onClick={handleCalculate} className="glass-button" style={{ display: 'flex', gap: '8px' }}>
              <Calculator size={16} /> Calculate New Schedule
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Section 4: Financial Summary
          </h3>

          {!calculationResult ? (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              textAlign: 'center',
              padding: '40px'
            }}>
              Enter customer details and click "Calculate New Schedule" to generate comparison metrics.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current EMI:</span>
                  <span style={{ fontWeight: 600 }}>LKR {calculationResult.currentEMI.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '6px', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#60a5fa' }}>Proposed EMI:</span>
                  <span style={{ fontWeight: 600, color: '#60a5fa' }}>LKR {calculationResult.proposedEMI.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tenure Extension:</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>+{calculationResult.tenureExtension} months</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.1)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#34d399' }}>Estimated Savings:</span>
                  <span style={{ fontWeight: 600, color: '#34d399' }}>LKR {calculationResult.estimatedSavings.toLocaleString()} / mo</span>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '180px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  New Repayment Schedule (First 12 Months)
                </span>
                <div className="table-container" style={{ flex: 1, background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', borderRadius: '6px', overflowY: 'auto', maxHeight: '160px' }}>
                  <table className="custom-table" style={{ fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ background: '#090d16' }}>
                        <th style={{ padding: '6px 10px' }}>Mth</th>
                        <th style={{ padding: '6px 10px' }}>Principal</th>
                        <th style={{ padding: '6px 10px' }}>Interest</th>
                        <th style={{ padding: '6px 10px' }}>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationSchedule.map(s => (
                        <tr key={s.month}>
                          <td style={{ padding: '6px 10px' }}>{s.month}</td>
                          <td style={{ padding: '6px 10px' }}>LKR {s.principal.toLocaleString()}</td>
                          <td style={{ padding: '6px 10px' }}>LKR {s.interest.toLocaleString()}</td>
                          <td style={{ padding: '6px 10px' }}>LKR {s.balance.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'auto' }}>
                <button
                  onClick={() => {
                    alert('Draft saved successfully!');
                    setActivePage('dashboard');
                  }}
                  className="glass-button-secondary"
                  style={{ display: 'flex', gap: '8px', padding: '12px' }}
                  type="button"
                >
                  <Save size={16} /> Save Draft
                </button>
                <button
                  onClick={handleSubmit}
                  className="glass-button"
                  style={{ display: 'flex', gap: '8px', padding: '12px' }}
                  type="button"
                >
                  <Send size={16} /> Submit for Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
