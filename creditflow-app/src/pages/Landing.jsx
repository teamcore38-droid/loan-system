import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Layers, Activity, FileText, CheckCircle, HelpCircle } from 'lucide-react';

export default function Landing({ onNavigateToLogin, onNavigateToRegister }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 100%)',
      color: '#f8fafc',
      fontFamily: 'var(--font-sans)',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 48px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #3b82f6, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={20} color="#fff" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            fontWeight: 700,
            background: 'linear-gradient(to right, #60a5fa, #34d399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CreditFlow
          </span>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', fontSize: '0.9rem', color: '#cbd5e1' }}>
          <a href="#features" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>Features</a>
          <a href="#workflow" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>Workflow</a>
          <a href="#stats" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>Impact</a>
          <button 
            onClick={onNavigateToLogin}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.03)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{
        padding: '100px 48px 80px 48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '20px',
          color: '#60a5fa',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '28px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <Activity size={14} /> CBSL Compliance & AI Automation
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '3.4rem',
          fontWeight: 800,
          lineHeight: '1.15',
          maxWidth: '850px',
          marginBottom: '20px',
          letterSpacing: '-1px'
        }}>
          Transforming Loan Restructuring with{' '}
          <span style={{
            background: 'linear-gradient(135deg, #60a5fa 30%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Intelligent Automation
          </span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: '#94a3b8',
          maxWidth: '680px',
          lineHeight: '1.6',
          marginBottom: '40px'
        }}>
          A unified enterprise banking platform that automates customer intake, performs smart repayment recalculations, validates documents with AI, and enforces CBSL-compliant tracking.
        </p>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={onNavigateToLogin}
            className="glass-button"
            style={{
              padding: '14px 28px',
              fontSize: '0.95rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #2563eb, #10b981)',
              border: 'none',
              boxShadow: '0 4px 20px rgba(37, 99, 235, 0.25)'
            }}
          >
            Launch Application <ArrowRight size={16} />
          </button>
          <button 
            onClick={onNavigateToRegister}
            style={{
              padding: '14px 28px',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.02)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Create Staff Account
          </button>
        </div>
      </header>

      {/* Feature Section */}
      <section id="features" style={{
        padding: '80px 48px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          marginBottom: '48px',
          fontWeight: 700
        }}>
          Intelligent Core Modules
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6'
            }}>
              <Cpu size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Document Verification</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
              Built-in Python Flask AI verification parser checks salary slips and CRIB reports, performing format checks, completeness diagnostics, and data consistency analysis.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>CBSL Rule Engine</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
              Enforces Central Bank of Sri Lanka directives by auto-classifying cases into Restructure (&lt;90 DPD) or Reschedule (&gt;90 DPD), minimizing human error.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              <FileText size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Automated Memo Generator</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
              Auto-drafts comprehensive credit evaluation memos combining client behavior history, proposed term comparisons, and financial impact savings charts.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" style={{
        background: 'rgba(30, 41, 59, 0.4)',
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
        padding: '60px 48px',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '30px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#60a5fa', marginBottom: '8px' }}>70%</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Reduction in Turnaround Time</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399', marginBottom: '8px' }}>100%</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>CBSL Regulatory Compliance</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#a78bfa', marginBottom: '8px' }}>98%</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>AI Document Verify Accuracy</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f43f5e', marginBottom: '8px' }}>&lt; 5min</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>From Request to Memo Draft</div>
          </div>
        </div>
      </section>

      {/* Role workflow preview */}
      <section id="workflow" style={{
        padding: '80px 48px',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          marginBottom: '16px',
          fontWeight: 700
        }}>
          Multi-Role Collaborative Pipeline
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', textAlign: 'center', marginBottom: '48px' }}>
          Enforces separation of duties and secure state transitions.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem' }}>1</div>
            <div style={{ flex: 1 }}>
              <strong style={{ color: '#fff' }}>Remedial Unit Review</strong>
              <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Fetches loan from Core Banking, runs calculation engine, and initiates document upload.</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.03)', paddingTop: '16px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem' }}>2</div>
            <div style={{ flex: 1 }}>
              <strong style={{ color: '#fff' }}>Credit Approval Panel</strong>
              <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Evaluates the system-compiled memorandum package, adds decision comments, and grants approval.</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.03)', paddingTop: '16px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem' }}>3</div>
            <div style={{ flex: 1 }}>
              <strong style={{ color: '#fff' }}>Sales Agreement & Signature Capture</strong>
              <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Explains the approved term changes to clients, prints forms, and uploads signed legal agreements.</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.03)', paddingTop: '16px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem' }}>4</div>
            <div style={{ flex: 1 }}>
              <strong style={{ color: '#fff' }}>CCPU Ledger Synchronization</strong>
              <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>CCPU unit executes ledger update to sync terms inside core banking system.</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.03)', paddingTop: '16px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ec4899', color: '#fff', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem' }}>5</div>
            <div style={{ flex: 1 }}>
              <strong style={{ color: '#fff' }}>Risk Compliance Monitoring</strong>
              <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Activates the 90 or 120-day compliance tracking window, recording repayment consistency.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '30px 48px',
        background: 'rgba(15, 23, 42, 0.8)',
        fontSize: '0.8rem',
        color: '#64748b',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>© 2026 CreditFlow. Enterprise Loan Restructuring System.</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Internal Use Only</span>
          <span>Security Level: Tier-1</span>
        </div>
      </footer>
    </div>
  );
}
