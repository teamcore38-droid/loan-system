// LocalStorage Database Simulation for CreditFlow

const DEFAULT_USERS = [
  { username: 'admin', password: 'password', name: 'Amali Dissanayake', role: 'Super Admin', employeeId: 'EMP-0012', branch: 'Colombo Main Branch', status: 'Active', permissions: ['Manage Users', 'Audit Access', 'System Settings'] },
  { username: 'remedial', password: 'password', name: 'Kanchana Jayawardena', role: 'Remedial Officer', employeeId: 'EMP-0042', branch: 'Colombo Main Branch', status: 'Active', permissions: ['Create Cases', 'Upload Documents'] },
  { username: 'credit', password: 'password', name: 'Ruwan Silva', role: 'Credit Officer', employeeId: 'EMP-0038', branch: 'Kandy Branch', status: 'Active', permissions: ['Approve Cases', 'Finalize Parameters'] },
  { username: 'sales', password: 'password', name: 'Thilini Kumara', role: 'Sales Officer', employeeId: 'EMP-0055', branch: 'Gampaha Branch', status: 'Active', permissions: ['Capture Consent'] },
  { username: 'ccpu', password: 'password', name: 'Mahesh Perera', role: 'CCPU User', employeeId: 'EMP-0021', branch: 'Colombo Main Branch', status: 'Active', permissions: ['Execute CBS Update'] },
  { username: 'risk', password: 'password', name: 'Sanduni Bandara', role: 'Risk & Compliance', employeeId: 'EMP-0061', branch: 'Colombo Main Branch', status: 'Active', permissions: ['Audit Access', 'Generate Reports'] },
  { username: 'officer2', password: 'password', name: 'Nirosha Fernando', role: 'Remedial Officer', employeeId: 'EMP-0033', branch: 'Matara Branch', status: 'Inactive', permissions: ['Create Cases'] },
  { username: 'sales2', password: 'password', name: 'Chaminda Wickrama', role: 'Sales Officer', employeeId: 'EMP-0047', branch: 'Kurunegala Branch', status: 'Locked', permissions: ['Capture Consent'] }
];

// Core Banking System (CBS) Mock Loans
const MOCK_LOANS = {
  'LA-2024-008912': {
    accountNo: 'LA-2024-008912',
    customerId: 'CUST-00421',
    customerName: 'Nimal Perera',
    nicNumber: '198801245678V',
    contactNumber: '+94 77 123 4567',
    loanType: 'Personal Loan',
    currentEMI: 32450,
    outstandingBalance: 2840000,
    interestRate: 14.5,
    remainingTenure: 48, // months
    dpd: 45 // Days Past Due (Restructure)
  },
  'LA-2024-007890': {
    accountNo: 'LA-2024-007890',
    customerId: 'CUST-00210',
    customerName: 'Sunil Fernando',
    nicNumber: '197548962314V',
    contactNumber: '+94 71 456 7890',
    loanType: 'Home Loan',
    currentEMI: 85000,
    outstandingBalance: 8500000,
    interestRate: 12.0,
    remainingTenure: 120,
    dpd: 102 // Days Past Due (Reschedule)
  },
  'LA-2024-009988': {
    accountNo: 'LA-2024-009988',
    customerId: 'CUST-00654',
    customerName: 'Amara Wijesinghe',
    nicNumber: '198256123478V',
    contactNumber: '+94 72 789 0123',
    loanType: 'SME Loan',
    currentEMI: 150000,
    outstandingBalance: 12000000,
    interestRate: 15.0,
    remainingTenure: 60,
    dpd: 78 // Days Past Due (Restructure)
  },
  'LA-2024-006655': {
    accountNo: 'LA-2024-006655',
    customerId: 'CUST-00991',
    customerName: 'Gayan Madushanka',
    nicNumber: '199145236789V',
    contactNumber: '+94 76 321 6549',
    loanType: 'Vehicle Loan',
    currentEMI: 45000,
    outstandingBalance: 1500000,
    interestRate: 13.5,
    remainingTenure: 36,
    dpd: 31 // Days Past Due (Restructure)
  }
};

const DEFAULT_CASES = [
  {
    id: 'CF-2025-0891',
    customerId: 'CUST-00421',
    customerName: 'Nimal Perera',
    nicNumber: '198801245678V',
    contactNumber: '+94 77 123 4567',
    loanAccountNo: 'LA-2024-008912',
    loanType: 'Personal Loan',
    currentEMI: 32450,
    outstandingBalance: 2840000,
    interestRate: 14.5,
    remainingTenure: 48,
    dpd: 45,
    classification: 'Restructure (<90 Days)',
    proposedEMI: 24000,
    proposedTenure: 60,
    revisedInterestRate: 12.5,
    financialSummary: {
      currentEMI: 32450,
      proposedEMI: 24000,
      tenureExtension: 12,
      estimatedSavings: 8450
    },
    stage: 4, // Credit Approval (1: Request Submitted, 2: Remedial Review, 3: Doc Verification, 4: Credit Approval, 5: Sales Consent, 6: CCPU Execution, 7: Monitoring Active)
    assignedOfficer: 'K. Jayawardena',
    status: 'Pending Approval',
    creationDate: '2026-06-12',
    documents: [
      { name: 'Request_Letter.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Verified' },
      { name: 'Salary_Slip_May.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Verified' },
      { name: 'Salary_Slip_Apr.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Verified' },
      { name: 'Employer_Conf.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Verified' },
      { name: 'CRIB_Report.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Pending' }
    ],
    aiVerification: {
      completeness: true,
      formatValid: true,
      signatureDetected: true,
      dataMatches: true,
      dateConsistency: true,
      duplicateCheck: true,
      cribReportMissing: false,
      confidenceScore: 95
    },
    approvalRecommendation: 'Based on DPD analysis and financial profile, this case qualifies for RESTRUCTURING under Policy Ref. CR-2024-04.',
    comments: [],
    monitoring: {
      activated: false,
      periodDays: 90,
      daysCompleted: 0,
      emiStatus: 'Pending Activation',
      lastPayment: 'N/A',
      missedPayments: 0,
      complianceStatus: 'Pending'
    },
    communications: [
      { date: '12 Jun 2026', type: 'System', details: 'Restructuring offer letter sent' },
      { date: '10 Jun 2026', type: 'SMS', details: 'EMI reminder SMS sent' },
      { date: '05 Jun 2026', type: 'In-person', details: 'In-person counseling session completed' },
      { date: '01 Jun 2026', type: 'Call', details: 'Initial case intake call' }
    ]
  },
  {
    id: 'CF-2025-0890',
    customerId: 'CUST-00210',
    customerName: 'Sunil Fernando',
    nicNumber: '197548962314V',
    contactNumber: '+94 71 456 7890',
    loanAccountNo: 'LA-2024-007890',
    loanType: 'Home Loan',
    currentEMI: 85000,
    outstandingBalance: 8500000,
    interestRate: 12.0,
    remainingTenure: 120,
    dpd: 102,
    classification: 'Reschedule (>90 Days)',
    proposedEMI: 65000,
    proposedTenure: 156,
    revisedInterestRate: 11.5,
    financialSummary: {
      currentEMI: 85000,
      proposedEMI: 65000,
      tenureExtension: 36,
      estimatedSavings: 20000
    },
    stage: 7, // Monitoring Active
    assignedOfficer: 'R. Silva',
    status: 'Monitoring Active',
    creationDate: '2026-05-10',
    documents: [
      { name: 'Request_Letter.pdf', type: 'PDF', uploadDate: '10 May 2026', verification: 'Verified' },
      { name: 'CRIB_Report.pdf', type: 'PDF', uploadDate: '10 May 2026', verification: 'Verified' },
      { name: 'Signed_Reschedule_Agreement.pdf', type: 'PDF', uploadDate: '18 May 2026', verification: 'Verified' }
    ],
    aiVerification: {
      completeness: true,
      formatValid: true,
      signatureDetected: true,
      dataMatches: true,
      dateConsistency: true,
      duplicateCheck: true,
      cribReportMissing: false,
      confidenceScore: 98
    },
    approvalRecommendation: 'Customer DPD is 102. Under CBSL directives, account is rescheduled with a 120-day monitoring period.',
    comments: [{ author: 'Ruwan Silva', date: '2026-05-15', text: 'Approved based on core collateral values and repayment justification.' }],
    monitoring: {
      activated: true,
      periodDays: 120,
      daysCompleted: 30,
      emiStatus: 'Up to Date',
      lastPayment: '10 Jun 2026',
      missedPayments: 0,
      complianceStatus: 'Compliant'
    },
    communications: [
      { date: '10 Jun 2026', type: 'System', details: 'EMI payment of LKR 65,000 received on schedule' },
      { date: '25 May 2026', type: 'System', details: 'Rescheduling activated in CBS' },
      { date: '18 May 2026', type: 'Sales', details: 'Reschedule Agreement and Loan Amendment signed' }
    ]
  },
  {
    id: 'CF-2025-0889',
    customerId: 'CUST-00654',
    customerName: 'Amara Wijesinghe',
    nicNumber: '198256123478V',
    contactNumber: '+94 72 789 0123',
    loanAccountNo: 'LA-2024-009988',
    loanType: 'SME Loan',
    currentEMI: 150000,
    outstandingBalance: 12000000,
    interestRate: 15.0,
    remainingTenure: 60,
    dpd: 78,
    classification: 'Restructure (<90 Days)',
    proposedEMI: 110000,
    proposedTenure: 84,
    revisedInterestRate: 13.0,
    financialSummary: {
      currentEMI: 150000,
      proposedEMI: 110000,
      tenureExtension: 24,
      estimatedSavings: 40000
    },
    stage: 2, // Remedial Review
    assignedOfficer: 'T. Kumara',
    status: 'Under Review',
    creationDate: '2026-06-15',
    documents: [
      { name: 'Request_Letter.pdf', type: 'PDF', uploadDate: '15 Jun 2026', verification: 'Verified' }
    ],
    aiVerification: {
      completeness: false,
      formatValid: true,
      signatureDetected: true,
      dataMatches: false,
      dateConsistency: true,
      duplicateCheck: true,
      cribReportMissing: true,
      confidenceScore: 60
    },
    approvalRecommendation: '',
    comments: [],
    monitoring: {
      activated: false,
      periodDays: 90,
      daysCompleted: 0,
      emiStatus: 'Pending Activation',
      lastPayment: 'N/A',
      missedPayments: 0,
      complianceStatus: 'Pending'
    },
    communications: [
      { date: '15 Jun 2026', type: 'Call', details: 'Customer requested business income verification call' }
    ]
  },
  {
    id: 'CF-2025-0888',
    customerId: 'CUST-00991',
    customerName: 'Gayan Madushanka',
    nicNumber: '199145236789V',
    contactNumber: '+94 76 321 6549',
    loanAccountNo: 'LA-2024-006655',
    loanType: 'Vehicle Loan',
    currentEMI: 45000,
    outstandingBalance: 1500000,
    interestRate: 13.5,
    remainingTenure: 36,
    dpd: 31,
    classification: 'Restructure (<90 Days)',
    proposedEMI: 35000,
    proposedTenure: 48,
    revisedInterestRate: 12.0,
    financialSummary: {
      currentEMI: 45000,
      proposedEMI: 35000,
      tenureExtension: 12,
      estimatedSavings: 10000
    },
    stage: 6, // CCPU Execution
    assignedOfficer: 'M. Perera',
    status: 'Approved',
    creationDate: '2026-06-08',
    documents: [
      { name: 'Request_Letter.pdf', type: 'PDF', uploadDate: '08 Jun 2026', verification: 'Verified' },
      { name: 'Salary_Slip.pdf', type: 'PDF', uploadDate: '08 Jun 2026', verification: 'Verified' },
      { name: 'Signed_Restructure_App.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Verified' },
      { name: 'Signed_Loan_Amendment.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Verified' }
    ],
    aiVerification: {
      completeness: true,
      formatValid: true,
      signatureDetected: true,
      dataMatches: true,
      dateConsistency: true,
      duplicateCheck: true,
      cribReportMissing: false,
      confidenceScore: 97
    },
    approvalRecommendation: 'Vehicle loan restructure approved to match reduced transport contract income.',
    comments: [{ author: 'Ruwan Silva', date: '2026-06-10', text: 'Approve restructure, extend tenure by 12 months.' }],
    monitoring: {
      activated: false,
      periodDays: 90,
      daysCompleted: 0,
      emiStatus: 'Pending Activation',
      lastPayment: 'N/A',
      missedPayments: 0,
      complianceStatus: 'Pending'
    },
    communications: [
      { date: '12 Jun 2026', type: 'Sales', details: 'Customer signed applications collected and uploaded' },
      { date: '10 Jun 2026', type: 'System', details: 'Approval notice sent to sales unit' }
    ]
  }
];

const DEFAULT_LOGS = [
  { id: 'AUD-20260617-00101', timestamp: '2026-06-17 11:42:05', user: 'K. Jayawardena', module: 'Cases', action: 'Case Updated', details: 'CF-2025-0891 status changed', ipAddress: '192.168.1.42', status: 'Success', changeDetails: { field: 'Status', before: 'Under Review', after: 'Pending Approval', comment: 'Uploaded supporting documents' } },
  { id: 'AUD-20260617-00102', timestamp: '2026-06-17 11:38:14', user: 'Ruwan Silva', module: 'Approvals', action: 'Approval Granted', details: 'CF-2025-0888 approved', ipAddress: '192.168.1.18', status: 'Success', changeDetails: { field: 'Stage', before: 'Credit Approval', after: 'Sales Consent', comment: 'Recommended with +12m extension' } },
  { id: 'AUD-20260617-00103', timestamp: '2026-06-17 11:15:03', user: 'Thilini Kumara', module: 'Documents', action: 'Doc Uploaded', details: 'Signed forms uploaded for CF-2025-0888', ipAddress: '192.168.1.55', status: 'Success', changeDetails: { field: 'Documents', before: '2 documents', after: '4 documents', comment: 'Restructure & Amendment signed' } },
  { id: 'AUD-20260617-00104', timestamp: '2026-06-17 10:52:30', user: 'System', module: 'Monitoring', action: 'Auto Alert Sent', details: 'Compliance alert created for CF-0841', ipAddress: '—', status: 'Success', changeDetails: { field: 'Missed Payment', before: '0', after: '1', comment: 'System auto-recalculation' } },
  { id: 'AUD-20260617-00105', timestamp: '2026-06-17 10:44:10', user: 'Mahesh Perera', module: 'Cases', action: 'Case Viewed', details: 'CF-2025-0888 accessed', ipAddress: '192.168.1.21', status: 'Success', changeDetails: null },
  { id: 'AUD-20260617-00106', timestamp: '2026-06-17 10:31:55', user: 'Unknown', module: 'Auth', action: 'Login Failed', details: '3 consecutive failures', ipAddress: '210.18.5.32', status: 'Failed', changeDetails: { field: 'Login attempt', before: 'None', after: 'Locked', comment: 'IP blocked for 30 minutes' } },
  { id: 'AUD-20260617-00107', timestamp: '2026-06-17 09:58:47', user: 'Amali Dissanayake', module: 'Users', action: 'User Created', details: 'EMP-0079 account activated', ipAddress: '192.168.1.10', status: 'Success', changeDetails: { field: 'User list', before: '23 users', after: '24 users', comment: 'New Credit Processing Officer added' } },
  { id: 'AUD-20260617-00108', timestamp: '2026-06-17 09:10:14', user: 'K. Jayawardena', module: 'Settings', action: 'Config Changed', details: 'Email alert threshold updated', ipAddress: '192.168.1.42', status: 'Warning', changeDetails: { field: 'Notification offset', before: '5 days', after: '3 days', comment: 'Approved by Remedial Head' } }
];

const DEFAULT_NOTIFICATIONS = [
  { role: 'Remedial Officer', message: 'Case CF-2025-0891 requires doc upload', type: 'warning' },
  { role: 'Credit Officer', message: 'Case CF-2025-0891 requires credit evaluation', type: 'info' },
  { role: 'Sales Officer', message: 'CF-2025-0888 approved by Credit Officer - collect signature', type: 'success' },
  { role: 'Risk & Compliance', message: 'CF-2025-0890 monitoring activated', type: 'info' },
  { role: 'Risk & Compliance', message: '3 compliance alerts pending review', type: 'warning' },
  { role: 'CCPU User', message: 'CF-2025-0888 ready for execution in CBS', type: 'info' }
];

const DEFAULT_TASKS = [
  { role: 'Remedial Officer', text: 'Review CF-2025-0891 documents', done: false },
  { role: 'Credit Officer', text: 'Approve 3 pending requests', done: false },
  { role: 'Risk & Compliance', text: 'Update monitoring compliance tracker', done: false },
  { role: 'CCPU User', text: 'Sync CF-2025-0888 terms with CBS', done: false }
];

// Initialize database
export const initDB = (force = false) => {
  if (force || !localStorage.getItem('cf_users')) {
    localStorage.setItem('cf_users', JSON.stringify(DEFAULT_USERS));
    localStorage.setItem('cf_loans', JSON.stringify(MOCK_LOANS));
    localStorage.setItem('cf_cases', JSON.stringify(DEFAULT_CASES));
    localStorage.setItem('cf_logs', JSON.stringify(DEFAULT_LOGS));
    localStorage.setItem('cf_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
    localStorage.setItem('cf_tasks', JSON.stringify(DEFAULT_TASKS));
    localStorage.setItem('cf_initialized', 'true');
    console.log('Mock database initialized successfully.');
  }
};

// Users functions
export const getUsers = () => {
  initDB();
  return JSON.parse(localStorage.getItem('cf_users'));
};

export const saveUsers = (users) => {
  localStorage.setItem('cf_users', JSON.stringify(users));
};

export const loginUser = (username, password, role) => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return { success: false, error: 'Invalid username or password.' };
  if (user.status === 'Locked') return { success: false, error: 'Account is locked. Contact Super Admin.' };
  if (user.status === 'Inactive') return { success: false, error: 'Account is inactive.' };
  if (user.role !== role) return { success: false, error: `User is not registered under role: ${role}` };
  
  // Save active session
  sessionStorage.setItem('cf_current_user', JSON.stringify(user));
  addLog(user.name, 'Auth', 'Login Success', `${user.name} logged in as ${role}`, 'Success');
  return { success: true, user };
};

export const getCurrentUser = () => {
  const userStr = sessionStorage.getItem('cf_current_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const logoutUser = () => {
  const user = getCurrentUser();
  if (user) {
    addLog(user.name, 'Auth', 'Logout', `${user.name} logged out`, 'Success');
  }
  sessionStorage.removeItem('cf_current_user');
};

// Loans functions
export const getLoans = () => {
  initDB();
  return JSON.parse(localStorage.getItem('cf_loans'));
};

export const getLoanByAccount = (accountNo) => {
  const loans = getLoans();
  return loans[accountNo] || null;
};

// Cases functions
export const getCases = () => {
  initDB();
  return JSON.parse(localStorage.getItem('cf_cases'));
};

export const saveCases = (cases) => {
  localStorage.setItem('cf_cases', JSON.stringify(cases));
};

export const getCaseById = (id) => {
  const cases = getCases();
  return cases.find(c => c.id === id) || null;
};

export const createCase = (caseData) => {
  const cases = getCases();
  const newId = `CF-2025-0${892 + (cases.length - 4)}`;
  const newCase = {
    id: newId,
    stage: 2, // Remedial Review
    status: 'Under Review',
    creationDate: new Date().toISOString().split('T')[0],
    documents: [
      { name: 'Request_Letter.pdf', type: 'PDF', uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), verification: 'Verified' }
    ],
    aiVerification: {
      completeness: false,
      formatValid: true,
      signatureDetected: true,
      dataMatches: false,
      dateConsistency: false,
      duplicateCheck: true,
      cribReportMissing: true,
      confidenceScore: 0
    },
    comments: [],
    monitoring: {
      activated: false,
      periodDays: caseData.dpd < 90 ? 90 : 120,
      daysCompleted: 0,
      emiStatus: 'Pending Activation',
      lastPayment: 'N/A',
      missedPayments: 0,
      complianceStatus: 'Pending'
    },
    communications: [
      { date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), type: 'System', details: 'Case initialized and request letter uploaded' }
    ],
    ...caseData
  };
  
  cases.unshift(newCase);
  saveCases(cases);
  
  const user = getCurrentUser();
  addLog(user ? user.name : 'System', 'Cases', 'Case Created', `Created case ${newId} for ${caseData.customerName}`, 'Success', {
    field: 'Case Creation',
    before: 'None',
    after: newId,
    comment: 'Case automatically generated'
  });
  
  // Add notifications
  addNotification('Credit Officer', `New case ${newId} submitted for review`, 'info');
  return newCase;
};

export const updateCaseStage = (caseId, newStage, comment = '') => {
  const cases = getCases();
  const caseIndex = cases.findIndex(c => c.id === caseId);
  if (caseIndex === -1) return null;
  
  const oldStage = cases[caseIndex].stage;
  cases[caseIndex].stage = newStage;
  
  // Update status based on stage
  let statusText = '';
  switch (newStage) {
    case 2: statusText = 'Under Review'; break;
    case 3: statusText = 'Pending Doc Verification'; break;
    case 4: statusText = 'Pending Approval'; break;
    case 5: statusText = 'Pending Customer Consent'; break;
    case 6: statusText = 'Pending Execution'; break;
    case 7: statusText = 'Monitoring Active'; break;
    default: statusText = 'Under Review';
  }
  
  cases[caseIndex].status = statusText;
  
  if (newStage === 7) {
    cases[caseIndex].monitoring.activated = true;
    cases[caseIndex].monitoring.emiStatus = 'Up to Date';
    cases[caseIndex].monitoring.complianceStatus = 'Compliant';
  }
  
  const user = getCurrentUser();
  const userName = user ? user.name : 'System';
  
  if (comment) {
    cases[caseIndex].comments.push({
      author: userName,
      date: new Date().toISOString().split('T')[0],
      text: comment
    });
  }
  
  cases[caseIndex].communications.unshift({
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    type: 'System',
    details: `Case stage updated from ${getStageName(oldStage)} to ${getStageName(newStage)}`
  });
  
  saveCases(cases);
  
  addLog(userName, 'Cases', 'Case Updated', `${caseId} stage advanced to ${getStageName(newStage)}`, 'Success', {
    field: 'Stage',
    before: getStageName(oldStage),
    after: getStageName(newStage),
    comment: comment || 'Stage advanced'
  });
  
  // Notify other roles
  let notifyRole = '';
  if (newStage === 3) notifyRole = 'Remedial Officer';
  else if (newStage === 4) notifyRole = 'Credit Officer';
  else if (newStage === 5) notifyRole = 'Sales Officer';
  else if (newStage === 6) notifyRole = 'CCPU User';
  else if (newStage === 7) notifyRole = 'Risk & Compliance';
  
  if (notifyRole) {
    addNotification(notifyRole, `Case ${caseId} requires attention in ${getStageName(newStage)}`, 'info');
  }
  
  return cases[caseIndex];
};

export const updateCaseDetails = (caseId, updatedDetails) => {
  const cases = getCases();
  const caseIndex = cases.findIndex(c => c.id === caseId);
  if (caseIndex === -1) return null;
  
  cases[caseIndex] = { ...cases[caseIndex], ...updatedDetails };
  saveCases(cases);
  return cases[caseIndex];
};

const getStageName = (stageNum) => {
  switch (stageNum) {
    case 1: return 'Request Submitted';
    case 2: return 'Remedial Review';
    case 3: return 'Doc Verification';
    case 4: return 'Credit Approval';
    case 5: return 'Sales Consent';
    case 6: return 'CCPU Execution';
    case 7: return 'Monitoring Active';
    default: return 'Unknown';
  }
};

// Logs functions
export const getLogs = () => {
  initDB();
  return JSON.parse(localStorage.getItem('cf_logs')) || [];
};

export const addLog = (user, module, action, details, status = 'Success', changeDetails = null) => {
  const logs = getLogs();
  const idNum = logs.length + 101;
  const newId = `AUD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${idNum}`;
  const newLog = {
    id: newId,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    user,
    module,
    action,
    details,
    ipAddress: '192.168.1.' + Math.floor(Math.random() * 90 + 10),
    status,
    changeDetails
  };
  logs.unshift(newLog);
  localStorage.setItem('cf_logs', JSON.stringify(logs));
  return newLog;
};

// Notifications functions
export const getNotifications = (role) => {
  initDB();
  const notifications = JSON.parse(localStorage.getItem('cf_notifications')) || [];
  return role ? notifications.filter(n => n.role === role) : notifications;
};

export const addNotification = (role, message, type = 'info') => {
  initDB();
  const notifications = JSON.parse(localStorage.getItem('cf_notifications')) || [];
  notifications.unshift({ role, message, type });
  localStorage.setItem('cf_notifications', JSON.stringify(notifications));
};

// Tasks functions
export const getTasks = (role) => {
  initDB();
  const tasks = JSON.parse(localStorage.getItem('cf_tasks')) || [];
  return role ? tasks.filter(t => t.role === role) : tasks;
};

export const toggleTask = (text) => {
  initDB();
  const tasks = JSON.parse(localStorage.getItem('cf_tasks')) || [];
  const taskIndex = tasks.findIndex(t => t.text === text);
  if (taskIndex !== -1) {
    tasks[taskIndex].done = !tasks[taskIndex].done;
    localStorage.setItem('cf_tasks', JSON.stringify(tasks));
  }
};

export const addTask = (role, text) => {
  initDB();
  const tasks = JSON.parse(localStorage.getItem('cf_tasks')) || [];
  tasks.push({ role, text, done: false });
  localStorage.setItem('cf_tasks', JSON.stringify(tasks));
};
