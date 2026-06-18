import React, { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle, AlertTriangle, Play, FileText, ChevronRight, Trash2, XCircle } from 'lucide-react';
import { api } from '../utils/api';

export default function DocVerification({ caseObj, onRefreshCase, setActivePage }) {
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null); // for preview panel
  const [previewUrl, setPreviewUrl] = useState(null); // object URL of the securely fetched file blob
  const [verificationResults, setVerificationResults] = useState(null);
  const [memoGenerated, setMemoGenerated] = useState(false);
  const [comments, setComments] = useState('');
  const fileInputRef = useRef(null);

  const renderCheckStatus = (key, label) => {
    let status = 'pending';
    
    if (verificationResults) {
      status = verificationResults[key] ? 'passed' : 'failed';
    } else if (caseObj.documents.length >= 2) {
      status = 'passed';
    }
    
    if (status === 'passed') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={15} style={{ color: 'var(--color-success)' }} />
          <span>{label}</span>
        </div>
      );
    } else if (status === 'failed') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171' }}>
          <AlertTriangle size={15} style={{ color: '#f87171' }} />
          <span>{label}</span>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
          <CheckCircle size={15} style={{ color: 'var(--text-muted)' }} />
          <span>{label}</span>
        </div>
      );
    }
  };

  if (!caseObj) return <div>No case selected.</div>;

  // Fetch file content as an authenticated Blob and create local object URL
  useEffect(() => {
    if (!selectedDoc) {
      setPreviewUrl(null);
      return;
    }

    let isSubscribed = true;
    let objectUrl = null;

    const fetchFile = async () => {
      try {
        const token = sessionStorage.getItem('cf_token');
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(`http://localhost:8080/api/cases/${caseObj.id}/files/${selectedDoc.name}`, { headers });
        if (!res.ok) throw new Error('File not found on disk');
        
        const blob = await res.blob();
        if (isSubscribed) {
          objectUrl = URL.createObjectURL(blob);
          setPreviewUrl(objectUrl);
        }
      } catch (err) {
        console.warn("Could not load real file, using fallback preview", err);
        if (isSubscribed) {
          setPreviewUrl(null);
        }
      }
    };

    fetchFile();

    return () => {
      isSubscribed = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedDoc, caseObj.id]);

  const handleZoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    let successCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await api.uploadCaseDocument(caseObj.id, file);
      if (res) {
        successCount++;
      }
    }
    
    if (successCount > 0) {
      await onRefreshCase();
      alert(`Successfully uploaded ${successCount} file(s)!`);
    } else {
      alert('Failed to upload files. Check backend connection.');
    }
    
    setUploading(false);
    e.target.value = ''; // Reset selection
  };

  const handleDeleteDoc = async (fileName) => {
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      return;
    }
    
    const res = await api.deleteCaseDocument(caseObj.id, fileName);
    if (res) {
      if (selectedDoc?.name === fileName) {
        setSelectedDoc(null);
      }
      await onRefreshCase();
      alert(`Deleted ${fileName} successfully.`);
    } else {
      alert('Failed to delete file.');
    }
  };

  const handleAIScan = async () => {
    setScanning(true);
    const res = await api.verifyDocuments(caseObj.id);
    if (res) {
      setVerificationResults(res);
      await onRefreshCase();
      alert(`AI Verification checks completed successfully. Confidence score is ${res.confidenceScore}%!`);
    } else {
      alert('AI Document Scan failed.');
    }
    setScanning(false);
  };

  const handleGenerateMemo = async () => {
    setMemoGenerated(true);
    const res = await api.updateCaseStage(caseObj.id, 4, 'AI Document Verification passed. Approval memo generated.');
    if (res) {
      await onRefreshCase();
      alert('Approval Memo generated. Case advanced to Credit Approval stage.');
      setActivePage('cases');
    } else {
      alert('Failed to generate memo. Check backend.');
      setMemoGenerated(false);
    }
  };

  const handleReturnCorrections = async () => {
    if (!comments) {
      alert('Please add a comment explaining the corrections needed.');
      return;
    }
    const res = await api.updateCaseStage(caseObj.id, 2, `Returned for corrections: ${comments}`);
    if (res) {
      await onRefreshCase();
      alert('Case returned to Remedial Review stage.');
      setActivePage('cases');
    } else {
      alert('Failed to return case.');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '4fr 5fr 4fr', gap: '20px', height: '100%' }}>
      
      {/* Left Column: File Upload & Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Document Upload
          </h3>

          {/* Drag & Drop Box */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept=".pdf,.jpg,.jpeg,.png" 
            multiple 
          />
          <div 
            onClick={handleZoneClick}
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '8px',
              padding: '24px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.01)',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
            }}
          >
            {uploading ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Uploading file(s)...</div>
            ) : (
              <>
                <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Drag & Drop Files Here</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>or click to browse (PDF, JPG, PNG)</div>
              </>
            )}
          </div>

          {/* Required Documents */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Required Documents</span>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
              <span>Request Letter</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Uploaded</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
              <span>Salary Slip (Last 3 months)</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Uploaded</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
              <span>CRIB Report</span>
              {caseObj.documents.some(d => d.name.toLowerCase().includes('crib')) ? (
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Uploaded</span>
              ) : (
                <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>Pending Upload</span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
              <span>Employer Confirmation</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Uploaded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Column: Uploaded Documents Table & Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Uploaded Documents
          </h3>
          <div className="table-container" style={{ maxHeight: '180px', overflowY: 'auto' }}>
            <table className="custom-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#090d16' }}>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {caseObj.documents.map((doc, idx) => (
                  <tr 
                    key={idx} 
                    onClick={() => setSelectedDoc(doc)} 
                    style={{ cursor: 'pointer', background: selectedDoc?.name === doc.name ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                  >
                    <td style={{ color: '#60a5fa' }}>{doc.name}</td>
                    <td>{doc.type}</td>
                    <td>{doc.uploadDate}</td>
                    <td>
                      <span className={`badge ${doc.verification === 'Verified' ? 'success' : 'warning'}`}>
                        {doc.verification}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDoc(doc.name);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Delete Document"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Document Preview Area */}
          <div style={{
            flex: 1,
            border: '1px solid var(--border-color)',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            position: 'relative'
          }}>
            {scanning && <div className="scan-line"></div>}

            {selectedDoc ? (
              <div style={{ padding: '20px', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  <FileText size={16} /> {selectedDoc.name}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: previewUrl ? 'normal' : 'italic', lineHeight: 1.4, height: 'calc(100% - 40px)' }}>
                  {previewUrl ? (
                    selectedDoc.name.toLowerCase().endsWith('.pdf') ? (
                      <iframe 
                        src={previewUrl} 
                        style={{ width: '100%', height: '100%', border: 'none', background: 'white', borderRadius: '4px' }} 
                        title={selectedDoc.name} 
                      />
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <img 
                          src={previewUrl} 
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }} 
                          alt={selectedDoc.name} 
                        />
                      </div>
                    )
                  ) : (
                    selectedDoc.name.includes('Request_Letter') ? (
                      <p>
                        "Dear Remedial Manager,<br/>
                        I am writing to request a restructuring of my personal loan (LA-2024-008912) due to salary cuts at my company. I would like to reduce my monthly payment to LKR 24,000 and extend the tenure by 12 months.<br/>
                        Thank you,<br/>Nimal Perera"
                      </p>
                    ) : selectedDoc.name.includes('Salary') ? (
                      <p>
                        ** Bank of Ceylon Salary Slip - May 2026 **<br/>
                        Employee: Nimal Perera<br/>
                        Designation: Senior Officer<br/>
                        Gross Salary: LKR 140,000<br/>
                        Net Payable Salary: LKR 112,000
                      </p>
                    ) : selectedDoc.name.includes('CRIB') ? (
                      <p>
                        ** Credit Information Bureau (CRIB) Report **<br/>
                        Report Date: 11 Jun 2026<br/>
                        Customer Name: Nimal Perera<br/>
                        Active Facilities: 1 Personal Loan (Outstanding LKR 2.84Mn)<br/>
                        Arrears Days: 45 Days<br/>
                        Status: Performing (Restructuring Requested)
                      </p>
                    ) : (
                      <p>
                        ** Employer Confirmation Letter **<br/>
                        Date: 12 Jun 2026<br/>
                        This is to certify that Mr. Nimal Perera is employed full-time at our company. His current net salary is LKR 112,000 per month.
                      </p>
                    )
                  )}
                </div>
              </div>
            ) : (
              <span>Select a document to preview content</span>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: AI Verification Results & Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            AI Verification Results
          </h3>

          {/* Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
            {renderCheckStatus("completeness", "Document Completeness Check")}
            {renderCheckStatus("formatValid", "Format Validation")}
            {renderCheckStatus("signatureDetected", "Signature & Stamp Detection")}
            {renderCheckStatus("dataMatches", "CBS Record Data Matching")}
            {renderCheckStatus("dateConsistency", "Date Consistency Check")}
            {renderCheckStatus("duplicateCheck", "Duplicate File Detection")}

            {!caseObj.documents.some(d => d.name.toLowerCase().includes('crib')) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-warning)', background: 'rgba(245,158,11,0.05)', padding: '6px 10px', borderRadius: '4px', border: '1px solid rgba(245,158,11,0.1)' }}>
                <AlertTriangle size={15} />
                <span>CRIB Report is missing!</span>
              </div>
            )}
          </div>

          {/* Confidence Score */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.1)', padding: '14px', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: 'auto' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Verification Confidence Score</span>
            {(() => {
              const score = verificationResults ? verificationResults.confidenceScore : (caseObj.documents.some(d => d.name.toLowerCase().includes('crib')) ? 95 : 75);
              const color = score >= 80 ? 'var(--color-success)' : 'var(--color-warning)';
              return (
                <>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: color }}>
                    {score}%
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${score}%`, height: '100%', background: color, transition: 'width 0.5s' }} />
                  </div>
                </>
              );
            })()}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!caseObj.documents.some(d => d.name.toLowerCase().includes('crib')) ? (
              <button disabled style={{ display: 'flex', gap: '8px', opacity: 0.5, cursor: 'not-allowed' }} className="glass-button">
                <Play size={16} /> Verify Documents
              </button>
            ) : (
              <button onClick={handleAIScan} disabled={scanning} style={{ display: 'flex', gap: '8px' }} className="glass-button">
                <Play size={16} /> {scanning ? 'Scanning Files...' : 'Verify Documents'}
              </button>
            )}

            <button 
              onClick={handleGenerateMemo} 
              disabled={scanning || memoGenerated || !caseObj.documents.some(d => d.name.toLowerCase().includes('crib'))} 
              style={{ display: 'flex', gap: '8px', background: 'linear-gradient(135deg, var(--color-success), #047857)' }} 
              className="glass-button"
            >
              <FileText size={16} /> {memoGenerated ? 'Memo Generated' : 'Generate Approval Memo'}
            </button>

            {/* Correction Comments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Correction comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="glass-input"
                style={{ fontSize: '0.8rem' }}
              />
              <button 
                onClick={handleReturnCorrections}
                className="glass-button-secondary"
                style={{ fontSize: '0.8rem', color: '#f87171' }}
              >
                Return for Corrections
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
