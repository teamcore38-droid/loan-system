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
  'LA-2024-001001': {'accountNo': 'LA-2024-001001', 'customerId': 'CUST-01001', 'customerName': 'K. L. Rahal Cooray', 'nicNumber': '198522304912V', 'contactNumber': '+94 77 220 1199', 'loanType': 'Personal Loan', 'currentEMI': 25000.0, 'outstandingBalance': 1200000.0, 'interestRate': 14.0, 'remainingTenure': 36, 'dpd': 45},
  'LA-2024-001002': {'accountNo': 'LA-2024-001002', 'customerId': 'CUST-01002', 'customerName': 'Dilani Wickramasinghe', 'nicNumber': '199065403211V', 'contactNumber': '+94 71 889 0022', 'loanType': 'Housing Loan', 'currentEMI': 90000.0, 'outstandingBalance': 8000000.0, 'interestRate': 11.5, 'remainingTenure': 144, 'dpd': 92},
  'LA-2024-001003': {'accountNo': 'LA-2024-001003', 'customerId': 'CUST-01003', 'customerName': 'Tharindu Jayasekara', 'nicNumber': '198211204859V', 'contactNumber': '+94 76 443 1122', 'loanType': 'Personal Loan', 'currentEMI': 45000.0, 'outstandingBalance': 3000000.0, 'interestRate': 15.0, 'remainingTenure': 48, 'dpd': 62},
  'LA-2024-001004': {'accountNo': 'LA-2024-001004', 'customerId': 'CUST-01004', 'customerName': 'Priyantha Herath', 'nicNumber': '197808904561V', 'contactNumber': '+94 72 990 8877', 'loanType': 'Housing Loan', 'currentEMI': 120000.0, 'outstandingBalance': 11000000.0, 'interestRate': 12.0, 'remainingTenure': 120, 'dpd': 105},
  'LA-2024-001005': {'accountNo': 'LA-2024-001005', 'customerId': 'CUST-01005', 'customerName': 'Nilanthi Rajapakse', 'nicNumber': '198455601248V', 'contactNumber': '+94 77 334 5566', 'loanType': 'Personal Loan', 'currentEMI': 18000.0, 'outstandingBalance': 800000.0, 'interestRate': 14.5, 'remainingTenure': 24, 'dpd': 32},
  'LA-2024-001006': {'accountNo': 'LA-2024-001006', 'customerId': 'CUST-01006', 'customerName': 'Ruwan Fernando', 'nicNumber': '198912408933V', 'contactNumber': '+94 71 556 7788', 'loanType': 'Housing Loan', 'currentEMI': 65000.0, 'outstandingBalance': 5500000.0, 'interestRate': 11.0, 'remainingTenure': 96, 'dpd': 42},
  'LA-2024-001007': {'accountNo': 'LA-2024-001007', 'customerId': 'CUST-01007', 'customerName': 'Anura Kumara Senanayake', 'nicNumber': '197022301149V', 'contactNumber': '+94 76 990 1122', 'loanType': 'Personal Loan', 'currentEMI': 50000.0, 'outstandingBalance': 4000000.0, 'interestRate': 15.5, 'remainingTenure': 60, 'dpd': 95},
  'LA-2024-001008': {'accountNo': 'LA-2024-001008', 'customerId': 'CUST-01008', 'customerName': 'Harshani Gunawardena', 'nicNumber': '199277801244V', 'contactNumber': '+94 77 889 2233', 'loanType': 'Housing Loan', 'currentEMI': 80000.0, 'outstandingBalance': 7000000.0, 'interestRate': 11.8, 'remainingTenure': 180, 'dpd': 38},
  'LA-2024-001009': {'accountNo': 'LA-2024-001009', 'customerId': 'CUST-01009', 'customerName': 'Manjula Peiris', 'nicNumber': '198009204481V', 'contactNumber': '+94 71 332 4455', 'loanType': 'Personal Loan', 'currentEMI': 30000.0, 'outstandingBalance': 1500000.0, 'interestRate': 14.2, 'remainingTenure': 36, 'dpd': 58},
  'LA-2024-001010': {'accountNo': 'LA-2024-001010', 'customerId': 'CUST-01010', 'customerName': 'Shalika Gunasekara', 'nicNumber': '198755409988V', 'contactNumber': '+94 76 112 3344', 'loanType': 'Housing Loan', 'currentEMI': 110000.0, 'outstandingBalance': 9500000.0, 'interestRate': 12.2, 'remainingTenure': 144, 'dpd': 112},
  'LA-2024-001011': {'accountNo': 'LA-2024-001011', 'customerId': 'CUST-01011', 'customerName': 'Buddhika Ratnayake', 'nicNumber': '198612903342V', 'contactNumber': '+94 77 667 8899', 'loanType': 'Personal Loan', 'currentEMI': 28000.0, 'outstandingBalance': 1800000.0, 'interestRate': 14.8, 'remainingTenure': 48, 'dpd': 41},
  'LA-2024-001012': {'accountNo': 'LA-2024-001012', 'customerId': 'CUST-01012', 'customerName': 'Sanduni Alwis', 'nicNumber': '199388701239V', 'contactNumber': '+94 71 998 0011', 'loanType': 'Housing Loan', 'currentEMI': 75000.0, 'outstandingBalance': 6500000.0, 'interestRate': 11.2, 'remainingTenure': 120, 'dpd': 84},
  'LA-2024-001013': {'accountNo': 'LA-2024-001013', 'customerId': 'CUST-01013', 'customerName': 'Kasun Jayawardena', 'nicNumber': '199102403259V', 'contactNumber': '+94 76 887 9900', 'loanType': 'Personal Loan', 'currentEMI': 35000.0, 'outstandingBalance': 2200000.0, 'interestRate': 15.0, 'remainingTenure': 36, 'dpd': 47},
  'LA-2024-001014': {'accountNo': 'LA-2024-001014', 'customerId': 'CUST-01014', 'customerName': 'Duminda Silva', 'nicNumber': '197734901248V', 'contactNumber': '+94 72 334 9988', 'loanType': 'Housing Loan', 'currentEMI': 130000.0, 'outstandingBalance': 12000000.0, 'interestRate': 12.5, 'remainingTenure': 180, 'dpd': 108},
  'LA-2024-001015': {'accountNo': 'LA-2024-001015', 'customerId': 'CUST-01015', 'customerName': 'Oshadi Fernando', 'nicNumber': '199566708891V', 'contactNumber': '+94 77 443 6677', 'loanType': 'Personal Loan', 'currentEMI': 15000.0, 'outstandingBalance': 600000.0, 'interestRate': 14.0, 'remainingTenure': 24, 'dpd': 35},
  'LA-2024-001016': {'accountNo': 'LA-2024-001016', 'customerId': 'CUST-01016', 'customerName': 'Isuru Perera', 'nicNumber': '198829402219V', 'contactNumber': '+94 71 667 9988', 'loanType': 'Housing Loan', 'currentEMI': 95000.0, 'outstandingBalance': 8500000.0, 'interestRate': 11.9, 'remainingTenure': 144, 'dpd': 76},
  'LA-2024-001017': {'accountNo': 'LA-2024-001017', 'customerId': 'CUST-01017', 'customerName': 'Chathurika Jayasinghe', 'nicNumber': '198356701149V', 'contactNumber': '+94 76 554 8877', 'loanType': 'Personal Loan', 'currentEMI': 40000.0, 'outstandingBalance': 2500000.0, 'interestRate': 15.2, 'remainingTenure': 48, 'dpd': 52},
  'LA-2024-001018': {'accountNo': 'LA-2024-001018', 'customerId': 'CUST-01018', 'customerName': 'Nalin de Silva', 'nicNumber': '197412304899V', 'contactNumber': '+94 77 112 0099', 'loanType': 'Housing Loan', 'currentEMI': 140000.0, 'outstandingBalance': 13000000.0, 'interestRate': 12.8, 'remainingTenure': 168, 'dpd': 115},
  'LA-2024-001019': {'accountNo': 'LA-2024-001019', 'customerId': 'CUST-01019', 'customerName': 'Hansani Wijewardene', 'nicNumber': '199467803321V', 'contactNumber': '+94 71 889 4433', 'loanType': 'Personal Loan', 'currentEMI': 22000.0, 'outstandingBalance': 1100000.0, 'interestRate': 14.5, 'remainingTenure': 36, 'dpd': 43},
  'LA-2024-001020': {'accountNo': 'LA-2024-001020', 'customerId': 'CUST-01020', 'customerName': 'Samantha Dissanayake', 'nicNumber': '197902409981V', 'contactNumber': '+94 76 998 1133', 'loanType': 'Housing Loan', 'currentEMI': 105000.0, 'outstandingBalance': 9000000.0, 'interestRate': 12.1, 'remainingTenure': 120, 'dpd': 98},

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
    loanType: 'Housing Loan',
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
    loanType: 'Housing Loan',
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
    loanType: 'Personal Loan',
    currentEMI: 45000,
    outstandingBalance: 1500000,
    interestRate: 13.5,
    remainingTenure: 36,
    dpd: 31 // Days Past Due (Restructure)
  }
};

const DEFAULT_CASES = [
  {'id': 'CF-2025-1001', 'customerId': 'CUST-01001', 'customerName': 'K. L. Rahal Cooray', 'nicNumber': '198522304912V', 'contactNumber': '+94 77 220 1199', 'loanAccountNo': 'LA-2024-001001', 'loanType': 'Personal Loan', 'currentEMI': 25000.0, 'outstandingBalance': 1200000.0, 'interestRate': 14.0, 'remainingTenure': 36, 'dpd': 45, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 18750, 'proposedTenure': 48, 'revisedInterestRate': 12.0, 'stage': 1, 'assignedOfficer': 'K. Jayawardena', 'status': 'Under Review', 'creationDate': '2026-06-10', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer K. L. Rahal Cooray.', 'financialSummary': {'currentEMI': 25000.0, 'proposedEMI': 18750, 'tenureExtension': 12, 'estimatedSavings': 6250.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-10', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-10', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1002', 'customerId': 'CUST-01002', 'customerName': 'Dilani Wickramasinghe', 'nicNumber': '199065403211V', 'contactNumber': '+94 71 889 0022', 'loanAccountNo': 'LA-2024-001002', 'loanType': 'Housing Loan', 'currentEMI': 90000.0, 'outstandingBalance': 8000000.0, 'interestRate': 11.5, 'remainingTenure': 144, 'dpd': 92, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 67500, 'proposedTenure': 180, 'revisedInterestRate': 9.5, 'stage': 2, 'assignedOfficer': 'Ruwan Silva', 'status': 'Under Review', 'creationDate': '2026-06-11', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Dilani Wickramasinghe.', 'financialSummary': {'currentEMI': 90000.0, 'proposedEMI': 67500, 'tenureExtension': 36, 'estimatedSavings': 22500.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-11', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 120, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-11', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1003', 'customerId': 'CUST-01003', 'customerName': 'Tharindu Jayasekara', 'nicNumber': '198211204859V', 'contactNumber': '+94 76 443 1122', 'loanAccountNo': 'LA-2024-001003', 'loanType': 'Personal Loan', 'currentEMI': 45000.0, 'outstandingBalance': 3000000.0, 'interestRate': 15.0, 'remainingTenure': 48, 'dpd': 62, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 33750, 'proposedTenure': 60, 'revisedInterestRate': 13.0, 'stage': 3, 'assignedOfficer': 'Thilini Kumara', 'status': 'Under Review', 'creationDate': '2026-06-12', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Tharindu Jayasekara.', 'financialSummary': {'currentEMI': 45000.0, 'proposedEMI': 33750, 'tenureExtension': 12, 'estimatedSavings': 11250.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-12', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-12', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1004', 'customerId': 'CUST-01004', 'customerName': 'Priyantha Herath', 'nicNumber': '197808904561V', 'contactNumber': '+94 72 990 8877', 'loanAccountNo': 'LA-2024-001004', 'loanType': 'Housing Loan', 'currentEMI': 120000.0, 'outstandingBalance': 11000000.0, 'interestRate': 12.0, 'remainingTenure': 120, 'dpd': 105, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 90000, 'proposedTenure': 156, 'revisedInterestRate': 10.0, 'stage': 4, 'assignedOfficer': 'Mahesh Perera', 'status': 'Pending Approval', 'creationDate': '2026-06-13', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Priyantha Herath.', 'financialSummary': {'currentEMI': 120000.0, 'proposedEMI': 90000, 'tenureExtension': 36, 'estimatedSavings': 30000.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-13', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 120, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-13', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1005', 'customerId': 'CUST-01005', 'customerName': 'Nilanthi Rajapakse', 'nicNumber': '198455601248V', 'contactNumber': '+94 77 334 5566', 'loanAccountNo': 'LA-2024-001005', 'loanType': 'Personal Loan', 'currentEMI': 18000.0, 'outstandingBalance': 800000.0, 'interestRate': 14.5, 'remainingTenure': 24, 'dpd': 32, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 13500, 'proposedTenure': 36, 'revisedInterestRate': 12.5, 'stage': 5, 'assignedOfficer': 'Nirosha Fernando', 'status': 'Under Review', 'creationDate': '2026-06-14', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Nilanthi Rajapakse.', 'financialSummary': {'currentEMI': 18000.0, 'proposedEMI': 13500, 'tenureExtension': 12, 'estimatedSavings': 4500.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-14', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-14', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1006', 'customerId': 'CUST-01006', 'customerName': 'Ruwan Fernando', 'nicNumber': '198912408933V', 'contactNumber': '+94 71 556 7788', 'loanAccountNo': 'LA-2024-001006', 'loanType': 'Housing Loan', 'currentEMI': 65000.0, 'outstandingBalance': 5500000.0, 'interestRate': 11.0, 'remainingTenure': 96, 'dpd': 42, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 48750, 'proposedTenure': 108, 'revisedInterestRate': 9.0, 'stage': 6, 'assignedOfficer': 'K. Jayawardena', 'status': 'Approved', 'creationDate': '2026-06-15', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Ruwan Fernando.', 'financialSummary': {'currentEMI': 65000.0, 'proposedEMI': 48750, 'tenureExtension': 12, 'estimatedSavings': 16250.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-15', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-15', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1007', 'customerId': 'CUST-01007', 'customerName': 'Anura Kumara Senanayake', 'nicNumber': '197022301149V', 'contactNumber': '+94 76 990 1122', 'loanAccountNo': 'LA-2024-001007', 'loanType': 'Personal Loan', 'currentEMI': 50000.0, 'outstandingBalance': 4000000.0, 'interestRate': 15.5, 'remainingTenure': 60, 'dpd': 95, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 37500, 'proposedTenure': 96, 'revisedInterestRate': 13.5, 'stage': 7, 'assignedOfficer': 'Ruwan Silva', 'status': 'Monitoring Active', 'creationDate': '2026-06-16', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Anura Kumara Senanayake.', 'financialSummary': {'currentEMI': 50000.0, 'proposedEMI': 37500, 'tenureExtension': 36, 'estimatedSavings': 12500.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-16', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': true, 'periodDays': 120, 'daysCompleted': 15, 'emiStatus': 'Up to Date', 'lastPayment': '10 Jun 2026', 'missedPayments': 0, 'complianceStatus': 'Compliant'}, 'communications': [{'date': '2026-06-16', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1008', 'customerId': 'CUST-01008', 'customerName': 'Harshani Gunawardena', 'nicNumber': '199277801244V', 'contactNumber': '+94 77 889 2233', 'loanAccountNo': 'LA-2024-001008', 'loanType': 'Housing Loan', 'currentEMI': 80000.0, 'outstandingBalance': 7000000.0, 'interestRate': 11.8, 'remainingTenure': 180, 'dpd': 38, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 60000, 'proposedTenure': 192, 'revisedInterestRate': 9.8, 'stage': 1, 'assignedOfficer': 'Thilini Kumara', 'status': 'Under Review', 'creationDate': '2026-06-17', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Harshani Gunawardena.', 'financialSummary': {'currentEMI': 80000.0, 'proposedEMI': 60000, 'tenureExtension': 12, 'estimatedSavings': 20000.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-17', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-17', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1009', 'customerId': 'CUST-01009', 'customerName': 'Manjula Peiris', 'nicNumber': '198009204481V', 'contactNumber': '+94 71 332 4455', 'loanAccountNo': 'LA-2024-001009', 'loanType': 'Personal Loan', 'currentEMI': 30000.0, 'outstandingBalance': 1500000.0, 'interestRate': 14.2, 'remainingTenure': 36, 'dpd': 58, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 22500, 'proposedTenure': 48, 'revisedInterestRate': 12.2, 'stage': 2, 'assignedOfficer': 'Mahesh Perera', 'status': 'Under Review', 'creationDate': '2026-06-18', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Manjula Peiris.', 'financialSummary': {'currentEMI': 30000.0, 'proposedEMI': 22500, 'tenureExtension': 12, 'estimatedSavings': 7500.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-18', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-18', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1010', 'customerId': 'CUST-01010', 'customerName': 'Shalika Gunasekara', 'nicNumber': '198755409988V', 'contactNumber': '+94 76 112 3344', 'loanAccountNo': 'LA-2024-001010', 'loanType': 'Housing Loan', 'currentEMI': 110000.0, 'outstandingBalance': 9500000.0, 'interestRate': 12.2, 'remainingTenure': 144, 'dpd': 112, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 82500, 'proposedTenure': 180, 'revisedInterestRate': 10.2, 'stage': 3, 'assignedOfficer': 'Nirosha Fernando', 'status': 'Under Review', 'creationDate': '2026-06-19', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Shalika Gunasekara.', 'financialSummary': {'currentEMI': 110000.0, 'proposedEMI': 82500, 'tenureExtension': 36, 'estimatedSavings': 27500.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-19', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 120, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-19', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1011', 'customerId': 'CUST-01011', 'customerName': 'Buddhika Ratnayake', 'nicNumber': '198612903342V', 'contactNumber': '+94 77 667 8899', 'loanAccountNo': 'LA-2024-001011', 'loanType': 'Personal Loan', 'currentEMI': 28000.0, 'outstandingBalance': 1800000.0, 'interestRate': 14.8, 'remainingTenure': 48, 'dpd': 41, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 21000, 'proposedTenure': 60, 'revisedInterestRate': 12.8, 'stage': 4, 'assignedOfficer': 'K. Jayawardena', 'status': 'Pending Approval', 'creationDate': '2026-06-20', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Buddhika Ratnayake.', 'financialSummary': {'currentEMI': 28000.0, 'proposedEMI': 21000, 'tenureExtension': 12, 'estimatedSavings': 7000.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-20', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-20', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1012', 'customerId': 'CUST-01012', 'customerName': 'Sanduni Alwis', 'nicNumber': '199388701239V', 'contactNumber': '+94 71 998 0011', 'loanAccountNo': 'LA-2024-001012', 'loanType': 'Housing Loan', 'currentEMI': 75000.0, 'outstandingBalance': 6500000.0, 'interestRate': 11.2, 'remainingTenure': 120, 'dpd': 84, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 56250, 'proposedTenure': 132, 'revisedInterestRate': 9.2, 'stage': 5, 'assignedOfficer': 'Ruwan Silva', 'status': 'Under Review', 'creationDate': '2026-06-21', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Sanduni Alwis.', 'financialSummary': {'currentEMI': 75000.0, 'proposedEMI': 56250, 'tenureExtension': 12, 'estimatedSavings': 18750.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-21', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-21', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1013', 'customerId': 'CUST-01013', 'customerName': 'Kasun Jayawardena', 'nicNumber': '199102403259V', 'contactNumber': '+94 76 887 9900', 'loanAccountNo': 'LA-2024-001013', 'loanType': 'Personal Loan', 'currentEMI': 35000.0, 'outstandingBalance': 2200000.0, 'interestRate': 15.0, 'remainingTenure': 36, 'dpd': 47, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 26250, 'proposedTenure': 48, 'revisedInterestRate': 13.0, 'stage': 6, 'assignedOfficer': 'Thilini Kumara', 'status': 'Approved', 'creationDate': '2026-06-22', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Kasun Jayawardena.', 'financialSummary': {'currentEMI': 35000.0, 'proposedEMI': 26250, 'tenureExtension': 12, 'estimatedSavings': 8750.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-22', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-22', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1014', 'customerId': 'CUST-01014', 'customerName': 'Duminda Silva', 'nicNumber': '197734901248V', 'contactNumber': '+94 72 334 9988', 'loanAccountNo': 'LA-2024-001014', 'loanType': 'Housing Loan', 'currentEMI': 130000.0, 'outstandingBalance': 12000000.0, 'interestRate': 12.5, 'remainingTenure': 180, 'dpd': 108, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 97500, 'proposedTenure': 216, 'revisedInterestRate': 10.5, 'stage': 7, 'assignedOfficer': 'Mahesh Perera', 'status': 'Monitoring Active', 'creationDate': '2026-06-23', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Duminda Silva.', 'financialSummary': {'currentEMI': 130000.0, 'proposedEMI': 97500, 'tenureExtension': 36, 'estimatedSavings': 32500.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-23', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': true, 'periodDays': 120, 'daysCompleted': 15, 'emiStatus': 'Up to Date', 'lastPayment': '10 Jun 2026', 'missedPayments': 0, 'complianceStatus': 'Compliant'}, 'communications': [{'date': '2026-06-23', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1015', 'customerId': 'CUST-01015', 'customerName': 'Oshadi Fernando', 'nicNumber': '199566708891V', 'contactNumber': '+94 77 443 6677', 'loanAccountNo': 'LA-2024-001015', 'loanType': 'Personal Loan', 'currentEMI': 15000.0, 'outstandingBalance': 600000.0, 'interestRate': 14.0, 'remainingTenure': 24, 'dpd': 35, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 11250, 'proposedTenure': 36, 'revisedInterestRate': 12.0, 'stage': 1, 'assignedOfficer': 'Nirosha Fernando', 'status': 'Under Review', 'creationDate': '2026-06-24', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Oshadi Fernando.', 'financialSummary': {'currentEMI': 15000.0, 'proposedEMI': 11250, 'tenureExtension': 12, 'estimatedSavings': 3750.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-24', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-24', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1016', 'customerId': 'CUST-01016', 'customerName': 'Isuru Perera', 'nicNumber': '198829402219V', 'contactNumber': '+94 71 667 9988', 'loanAccountNo': 'LA-2024-001016', 'loanType': 'Housing Loan', 'currentEMI': 95000.0, 'outstandingBalance': 8500000.0, 'interestRate': 11.9, 'remainingTenure': 144, 'dpd': 76, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 71250, 'proposedTenure': 156, 'revisedInterestRate': 9.9, 'stage': 2, 'assignedOfficer': 'K. Jayawardena', 'status': 'Under Review', 'creationDate': '2026-06-25', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Isuru Perera.', 'financialSummary': {'currentEMI': 95000.0, 'proposedEMI': 71250, 'tenureExtension': 12, 'estimatedSavings': 23750.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-25', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-25', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1017', 'customerId': 'CUST-01017', 'customerName': 'Chathurika Jayasinghe', 'nicNumber': '198356701149V', 'contactNumber': '+94 76 554 8877', 'loanAccountNo': 'LA-2024-001017', 'loanType': 'Personal Loan', 'currentEMI': 40000.0, 'outstandingBalance': 2500000.0, 'interestRate': 15.2, 'remainingTenure': 48, 'dpd': 52, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 30000, 'proposedTenure': 60, 'revisedInterestRate': 13.2, 'stage': 3, 'assignedOfficer': 'Ruwan Silva', 'status': 'Under Review', 'creationDate': '2026-06-26', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Chathurika Jayasinghe.', 'financialSummary': {'currentEMI': 40000.0, 'proposedEMI': 30000, 'tenureExtension': 12, 'estimatedSavings': 10000.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-26', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-26', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1018', 'customerId': 'CUST-01018', 'customerName': 'Nalin de Silva', 'nicNumber': '197412304899V', 'contactNumber': '+94 77 112 0099', 'loanAccountNo': 'LA-2024-001018', 'loanType': 'Housing Loan', 'currentEMI': 140000.0, 'outstandingBalance': 13000000.0, 'interestRate': 12.8, 'remainingTenure': 168, 'dpd': 115, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 105000, 'proposedTenure': 204, 'revisedInterestRate': 10.8, 'stage': 4, 'assignedOfficer': 'Thilini Kumara', 'status': 'Pending Approval', 'creationDate': '2026-06-27', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Nalin de Silva.', 'financialSummary': {'currentEMI': 140000.0, 'proposedEMI': 105000, 'tenureExtension': 36, 'estimatedSavings': 35000.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-27', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 120, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-27', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1019', 'customerId': 'CUST-01019', 'customerName': 'Hansani Wijewardene', 'nicNumber': '199467803321V', 'contactNumber': '+94 71 889 4433', 'loanAccountNo': 'LA-2024-001019', 'loanType': 'Personal Loan', 'currentEMI': 22000.0, 'outstandingBalance': 1100000.0, 'interestRate': 14.5, 'remainingTenure': 36, 'dpd': 43, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 16500, 'proposedTenure': 48, 'revisedInterestRate': 12.5, 'stage': 5, 'assignedOfficer': 'Mahesh Perera', 'status': 'Under Review', 'creationDate': '2026-06-28', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Hansani Wijewardene.', 'financialSummary': {'currentEMI': 22000.0, 'proposedEMI': 16500, 'tenureExtension': 12, 'estimatedSavings': 5500.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-28', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 90, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-28', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1020', 'customerId': 'CUST-01020', 'customerName': 'Samantha Dissanayake', 'nicNumber': '197902409981V', 'contactNumber': '+94 76 998 1133', 'loanAccountNo': 'LA-2024-001020', 'loanType': 'Housing Loan', 'currentEMI': 105000.0, 'outstandingBalance': 9000000.0, 'interestRate': 12.1, 'remainingTenure': 120, 'dpd': 98, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 78750, 'proposedTenure': 156, 'revisedInterestRate': 10.1, 'stage': 6, 'assignedOfficer': 'Nirosha Fernando', 'status': 'Approved', 'creationDate': '2026-06-29', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Samantha Dissanayake.', 'financialSummary': {'currentEMI': 105000.0, 'proposedEMI': 78750, 'tenureExtension': 36, 'estimatedSavings': 26250.0}, 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-29', 'verification': 'Verified'}], 'aiVerification': {'completeness': true, 'formatValid': true, 'signatureDetected': true, 'dataMatches': true, 'dateConsistency': true, 'duplicateCheck': true, 'cribReportMissing': false, 'confidenceScore': 95}, 'comments': [], 'monitoring': {'activated': false, 'periodDays': 120, 'daysCompleted': 0, 'emiStatus': 'Pending Activation', 'lastPayment': 'N/A', 'missedPayments': 0, 'complianceStatus': 'Pending'}, 'communications': [{'date': '2026-06-29', 'type': 'System', 'details': 'Restructuring case created'}]},
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
    loanType: 'Housing Loan',
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
    loanType: 'Housing Loan',
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
    loanType: 'Personal Loan',
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
    approvalRecommendation: 'Personal loan restructure approved to match reduced transport contract income.',
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
