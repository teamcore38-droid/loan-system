import React, { useState, useRef } from 'react';
import { Check, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { api } from '../utils/api';

export default function WorkflowManager({ caseObj, onRefreshCase, setActivePage, user }) {
  const [comment, setComment] = useState('');
  const [signedFiles, setSignedFiles] = useState([]);
  const [uploadingSig, setUploadingSig] = useState(false);
  const sigInputRef = useRef(null);
  const [executingCbs, setExecutingCbs] = useState(false);
  const [recommendation, setRecommendation] = useState(caseObj.approvalRecommendation || '');

  if (!caseObj) return <div style={{ padding: '24px' }}>No case selected.</div>;

  const STAGES = [
    { id: 1, name: 'Request Submitted' },
    { id: 2, name: 'Remedial Review' },
    { id: 3, name: 'Doc Verification' },
    { id: 4, name: 'Credit Approval' },
    { id: 5, name: 'Sales Consent' },
    { id: 6, name: 'CCPU Execution' },
    { id: 7, name: 'Monitoring Active' }
  ];

  const handleCreditApproval = async (approved) => {
    let res;
    if (approved) {
      res = await api.updateCaseStage(caseObj.id, 5, comment || 'Approved by Credit Officer.');
      if (res) alert('Case approved and sent to Sales Unit for consent collection.');
    } else {
      res = await api.updateCaseStage(caseObj.id, 2, comment || 'Clarification requested by Credit Officer.');
      if (res) alert('Case returned to Remedial Unit for clarification.');
    }
    if (res) {
      await onRefreshCase();
      setActivePage('cases');
    } else {
      alert('Action failed. Check backend.');
    }
  };

  const handleSignedUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingSig(true);
    const uploaded = [];
    let allOk = true;
    for (const f of files) {
      const res = await api.uploadCaseDocument(caseObj.id, f);
      if (res) uploaded.push(f.name);
      else allOk = false;
    }
    setUploadingSig(false);
    if (e.target) e.target.value = '';
    if (uploaded.length > 0) {
      setSignedFiles(prev => [...prev, ...uploaded]);
      await onRefreshCase();
    }
    if (!allOk) alert('Some files failed to upload. Please check the backend and try again.');
  };

  const handleSalesConsent = async () => {
    if (signedFiles.length === 0) {
      alert('Please upload the signed customer documents first.');
      return;
    }

    const res = await api.updateCaseStage(
      caseObj.id,
      6,
      'Customer signed consent documents collected and uploaded: ' + signedFiles.join(', ')
    );
    if (res) {
      await onRefreshCase();
      alert('Consent confirmed. Case forwarded to CCPU for Core Banking System execution.');
      setActivePage('cases');
    } else {
      alert('Action failed. Check backend.');
    }
  };

  const handleCcpuExecution = async () => {
    setExecutingCbs(true);
    const res = await api.updateCaseStage(caseObj.id, 7, 'Restructured terms activated in CBS core ledger.');
    if (res) {
      await onRefreshCase();
      alert('Restructuring executed successfully in Core Banking System! Account is now in Active Monitoring.');
      setActivePage('cases');
    } else {
      alert('Execution failed.');
    }
    setExecutingCbs(false);
  };

  const handleRiskActivation = async () => {
    const updatedDetails = {
      monitoringActivated: true,
      monitoringDaysCompleted: 1,
      monitoringEmiStatus: 'Up to Date',
      monitoringComplianceStatus: 'Compliant'
    };
    const res = await api.updateCaseDetails(caseObj.id, updatedDetails);
    if (res) {
      await onRefreshCase();
      alert('Compliance monitoring tracker activated successfully.');
    } else {
      alert('Failed to activate monitoring.');
    }
  };

  const handleProceedToVerification = async () => {
    if (!recommendation.trim()) {
      alert('Please enter an approval recommendation note first.');
      return;
    }
    
    let res = await api.updateCaseDetails(caseObj.id, { approvalRecommendation: recommendation });
    if (res) {
      res = await api.updateCaseStage(caseObj.id, 3, 'Restructuring recommendation memo drafted. Proceeding to supporting document checks.');
      if (res) {
        await onRefreshCase();
        alert('Case memo generated! Advanced to Stage 3: Document Verification.');
        setActivePage('cases');
      }
    }
    if (!res) {
      alert('Action failed.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Workflow Visual Timeline */}
      <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {/* Horizontal connecting line */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '4%',
            right: '4%',
            height: '4px',
            background: 'rgba(255,255,255,0.06)',
            zIndex: 1
          }} />
          {/* Active progress color connecting line */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '4%',
            width: `${((caseObj.stage - 1) / 6) * 92}%`,
            height: '4px',
            background: 'linear-gradient(to right, var(--color-success), var(--color-primary))',
            zIndex: 2,
            transition: 'width 0.5s ease'
          }} />

          {STAGES.map(stage => {
            const isCompleted = stage.id < caseObj.stage;
            const isActive = stage.id === caseObj.stage;
            return (
              <div key={stage.id} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '12%',
                zIndex: 3,
                position: 'relative'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isCompleted ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : '#1f2937',
                  border: `2px solid ${isActive ? '#fff' : 'var(--border-color)'}`,
                  boxShadow: isActive ? '0 0 15px var(--color-primary-glow)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCompleted || isActive ? '#fff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s'
                }}>
                  {isCompleted ? <Check size={18} /> : stage.id}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  marginTop: '8px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  {stage.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Details (Left) & Alerts/History (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '9fr 4fr', gap: '20px', flex: 1, minHeight: 0 }}>
        
        {/* Left Area: Summary & Active Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
          
          {/* Case Summary */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Case Summary
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Customer Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Customer Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: '0.82rem', gap: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer ID:</span>
                  <span style={{ fontWeight: 500 }}>{caseObj.customerId}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
                  <span style={{ fontWeight: 500 }}>{caseObj.customerName}</span>
                  <span style={{ color: 'var(--text-muted)' }}>NIC Number:</span>
                  <span style={{ fontWeight: 500 }}>{caseObj.nicNumber}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Contact No:</span>
                  <span style={{ fontWeight: 500 }}>{caseObj.contactNumber}</span>
                </div>
              </div>

              {/* Loan Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Original Loan Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: '0.82rem', gap: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Loan Account:</span>
                  <span style={{ fontWeight: 500 }}>{caseObj.loanAccountNo}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Loan Type:</span>
                  <span style={{ fontWeight: 500 }}>{caseObj.loanType}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Original Interest:</span>
                  <span style={{ fontWeight: 500 }}>{caseObj.interestRate}% p.a.</span>
                  <span style={{ color: 'var(--text-muted)' }}>Current EMI:</span>
                  <span style={{ fontWeight: 500 }}>LKR {caseObj.currentEMI.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Financial summary metrics row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Revised EMI</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#60a5fa', marginTop: '4px' }}>LKR {caseObj.proposedEMI.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Revised Rate</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#60a5fa', marginTop: '4px' }}>{caseObj.revisedInterestRate}% p.a.</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Tenure Extension</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-warning)', marginTop: '4px' }}>+{(caseObj.proposedTenure - caseObj.remainingTenure)} Months</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Estimated Savings</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-success)', marginTop: '4px' }}>LKR {(caseObj.currentEMI - caseObj.proposedEMI).toLocaleString()}</div>
              </div>
            </div>

            {/* Recommendation */}
            <div style={{ marginTop: '20px', fontSize: '0.82rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Approval Recommendation:</div>
              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', fontStyle: 'italic', borderLeft: '3px solid var(--color-primary)' }}>
                {caseObj.approvalRecommendation || 'Recommendation note not generated yet.'}
              </div>
            </div>
          </div>

          {/* Role Actions Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Workflow Actions Required ({STAGES.find(s => s.id === caseObj.stage)?.name})
            </h3>

            {/* Remedial Officer: Stage 2 Remedial Review */}
            {caseObj.stage === 2 && (user.role === 'Remedial Officer' || user.role === 'Super Admin') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Review the case details and write the restructuring recommendation note. This recommendation note will be included in the Credit Approval Memo.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Approval Recommendation Note</label>
                  <textarea
                    rows="3"
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="glass-input"
                    placeholder="Enter the justification and recommendation for this restructure request..."
                  />
                </div>
                <button onClick={handleProceedToVerification} className="glass-button">
                  Generate Memo & Proceed to Doc Verification
                </button>
              </div>
            )}

            {/* Credit Officer: Stage 4 Approvals */}
            {caseObj.stage === 4 && user.role === 'Credit Officer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Comments / Approval Notes</label>
                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="glass-input"
                    placeholder="Enter approval details or clarification queries..."
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleCreditApproval(true)} className="glass-button" style={{ background: 'linear-gradient(135deg, var(--color-success), #047857)' }}>
                    Approve Case
                  </button>
                  <button onClick={() => handleCreditApproval(false)} className="glass-button-secondary" style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                    Request Clarification
                  </button>
                </div>
              </div>
            )}

            {/* Sales Officer: Stage 5 Consent */}
            {caseObj.stage === 5 && user.role === 'Sales Officer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Customer agreement forms must be printed, signed, and scanned back into the system to confirm legal consent.
                </p>
                <input
                  ref={sigInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  style={{ display: 'none' }}
                  onChange={handleSignedUpload}
                />
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => sigInputRef.current && sigInputRef.current.click()}
                    disabled={uploadingSig}
                    className="glass-button-secondary"
                    style={{ opacity: uploadingSig ? 0.6 : 1 }}
                  >
                    {uploadingSig ? 'Uploading…' : 'Upload Signed Customer Docs'}
                  </button>
                  {signedFiles.length > 0 && (
                    <span style={{ color: 'var(--color-success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> {signedFiles.length} file{signedFiles.length > 1 ? 's' : ''} uploaded: {signedFiles.join(', ')}
                    </span>
                  )}
                </div>
                <button onClick={handleSalesConsent} className="glass-button">
                  Confirm Customer Consent Agreement
                </button>
              </div>
            )}

            {/* CCPU User: Stage 6 Execution */}
            {caseObj.stage === 6 && user.role === 'CCPU User' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Confirm execution of loan restructuring. This will synchronize the new repayment terms into the Core Banking System core ledger.
                </p>
                <button onClick={handleCcpuExecution} disabled={executingCbs} className="glass-button">
                  {executingCbs ? 'Processing Core Sync...' : 'Execute Restructuring in CBS'}
                </button>
              </div>
            )}

            {/* Risk & Compliance: Activate Monitoring */}
            {caseObj.stage === 7 && !caseObj.monitoringActivated && user.role === 'Risk & Compliance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  The case is executed in CBS. Activate compliance tracking to monitor the required period (90/120 days).
                </p>
                <button onClick={handleRiskActivation} className="glass-button">
                  Activate Monitoring Tracker
                </button>
              </div>
            )}

            {/* Fallback info when role doesn't match action */}
            {((caseObj.stage === 2 && user.role !== 'Remedial Officer' && user.role !== 'Super Admin') ||
              (caseObj.stage === 4 && user.role !== 'Credit Officer') ||
              (caseObj.stage === 5 && user.role !== 'Sales Officer') ||
              (caseObj.stage === 6 && user.role !== 'CCPU User')) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <Clock size={20} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Awaiting action from: <strong style={{ color: 'var(--text-primary)' }}>
                    {caseObj.stage === 2 ? 'Remedial Officer' : caseObj.stage === 4 ? 'Credit Officer' : caseObj.stage === 5 ? 'Sales Officer' : 'CCPU User'}
                  </strong>
                </span>
              </div>
            )}

            {/* Active Monitoring tracker details (Visible to all when active) */}
            {caseObj.stage === 7 && caseObj.monitoringActivated && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Compliance Tracking (CBSL Guidelines)</h4>
                
                {/* Progress bars */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      <span>90-Day Monitoring Period</span>
                      <span>{caseObj.classification.includes('Restructure') ? `${caseObj.monitoringDaysCompleted}/90 days` : 'N/A (Reschedule)'}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: caseObj.classification.includes('Restructure') ? `${(caseObj.monitoringDaysCompleted / 90) * 100}%` : '0%',
                        height: '100%',
                        background: 'var(--color-primary)'
                      }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      <span>120-Day Monitoring Period</span>
                      <span>{caseObj.classification.includes('Reschedule') ? `${caseObj.monitoringDaysCompleted}/120 days` : 'N/A (Restructure)'}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: caseObj.classification.includes('Reschedule') ? `${(caseObj.monitoringDaysCompleted / 120) * 100}%` : '0%',
                        height: '100%',
                        background: 'var(--color-primary)'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Info Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '10px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Current EMI Status</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '4px', color: 'var(--color-success)' }}>{caseObj.monitoringEmiStatus}</div>
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Last Payment Received</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '4px' }}>{caseObj.monitoringLastPayment}</div>
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Missed Payments</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '4px', color: caseObj.monitoringMissedPayments > 0 ? 'var(--color-danger)' : 'var(--text-primary)' }}>
                      {caseObj.monitoringMissedPayments}
                    </div>
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Compliance Status</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '4px', color: 'var(--color-success)' }}>{caseObj.monitoringComplianceStatus}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Alerts & Communication History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
          
          {/* Notifications & Alerts */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Compliance Alerts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', background: 'rgba(16,185,129,0.04)', padding: '8px 12px', borderRadius: '4px' }}>
                <Check size={14} /> EMI received on schedule
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', background: 'rgba(16,185,129,0.04)', padding: '8px 12px', borderRadius: '4px' }}>
                <Check size={14} /> Insurance policy active
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', background: 'rgba(245,158,11,0.04)', padding: '8px 12px', borderRadius: '4px' }}>
                <AlertTriangle size={14} /> CRIB report renewal due
              </div>
            </div>
          </div>

          {/* Communication History */}
          <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Communication History
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1 }}>
              {caseObj.communications.map((comm, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                  {/* Vertical history indicator bar */}
                  {idx !== caseObj.communications.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '8px',
                      top: '16px',
                      bottom: '-16px',
                      width: '2px',
                      background: 'rgba(255,255,255,0.05)'
                    }} />
                  )}

                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: comm.type === 'SMS' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: comm.type === 'SMS' ? '#60a5fa' : 'var(--text-secondary)',
                    flexShrink: 0
                  }}>
                    <Clock size={10} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{comm.type}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{comm.date}</span>
                    </div>
                    <span style={{ color: 'var(--text-secondary)', lineHeight: 1.3 }}>{comm.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
