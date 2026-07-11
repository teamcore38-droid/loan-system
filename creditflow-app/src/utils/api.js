// Client-side API integration layer for Spring Boot backend
// Equipped with an automatic offline fallback (Mock Mode) to run seamlessly without backend.

const API_URL = 'http://localhost:8080/api';

let isMockMode = false;

// Mock Store State
const mockUsers = [
  { username: 'admin', name: 'Amali Dissanayake', role: 'Super Admin', employeeId: 'EMP-0012', branch: 'Colombo Main Branch', status: 'Active', permissions: 'Manage Users, Audit Access, System Settings' },
  { username: 'remedial', name: 'Kanchana Jayawardena', role: 'Remedial Officer', employeeId: 'EMP-0042', branch: 'Colombo Main Branch', status: 'Active', permissions: 'Create Cases, Upload Documents' },
  { username: 'credit', name: 'Ruwan Silva', role: 'Credit Officer', employeeId: 'EMP-0038', branch: 'Kandy Branch', status: 'Active', permissions: 'Approve Cases, Finalize Parameters' },
  { username: 'sales', name: 'Thilini Kumara', role: 'Sales Officer', employeeId: 'EMP-0055', branch: 'Gampaha Branch', status: 'Active', permissions: 'Capture Consent' },
  { username: 'ccpu', name: 'Mahesh Perera', role: 'CCPU User', employeeId: 'EMP-0021', branch: 'Colombo Main Branch', status: 'Active', permissions: 'Execute CBS Update' },
  { username: 'risk', name: 'Sanduni Bandara', role: 'Risk & Compliance', employeeId: 'EMP-0061', branch: 'Colombo Main Branch', status: 'Active', permissions: 'Audit Access, Generate Reports' },
  { username: 'officer2', name: 'Nirosha Fernando', role: 'Remedial Officer', employeeId: 'EMP-0033', branch: 'Matara Branch', status: 'Inactive', permissions: 'Create Cases' },
  { username: 'sales2', name: 'Chaminda Wickrama', role: 'Sales Officer', employeeId: 'EMP-0047', branch: 'Kurunegala Branch', status: 'Locked', permissions: 'Capture Consent' }
];

const mockLoans = [
  {'accountNo': 'LA-2024-001001', 'customerId': 'CUST-01001', 'customerName': 'K. L. Rahal Cooray', 'nicNumber': '198522304912V', 'contactNumber': '+94 77 220 1199', 'loanType': 'Personal Loan', 'currentEMI': 25000.0, 'outstandingBalance': 1200000.0, 'interestRate': 14.0, 'remainingTenure': 36, 'dpd': 45},
  {'accountNo': 'LA-2024-001002', 'customerId': 'CUST-01002', 'customerName': 'Dilani Wickramasinghe', 'nicNumber': '199065403211V', 'contactNumber': '+94 71 889 0022', 'loanType': 'Housing Loan', 'currentEMI': 90000.0, 'outstandingBalance': 8000000.0, 'interestRate': 11.5, 'remainingTenure': 144, 'dpd': 92},
  {'accountNo': 'LA-2024-001003', 'customerId': 'CUST-01003', 'customerName': 'Tharindu Jayasekara', 'nicNumber': '198211204859V', 'contactNumber': '+94 76 443 1122', 'loanType': 'Personal Loan', 'currentEMI': 45000.0, 'outstandingBalance': 3000000.0, 'interestRate': 15.0, 'remainingTenure': 48, 'dpd': 62},
  {'accountNo': 'LA-2024-001004', 'customerId': 'CUST-01004', 'customerName': 'Priyantha Herath', 'nicNumber': '197808904561V', 'contactNumber': '+94 72 990 8877', 'loanType': 'Housing Loan', 'currentEMI': 120000.0, 'outstandingBalance': 11000000.0, 'interestRate': 12.0, 'remainingTenure': 120, 'dpd': 105},
  {'accountNo': 'LA-2024-001005', 'customerId': 'CUST-01005', 'customerName': 'Nilanthi Rajapakse', 'nicNumber': '198455601248V', 'contactNumber': '+94 77 334 5566', 'loanType': 'Personal Loan', 'currentEMI': 18000.0, 'outstandingBalance': 800000.0, 'interestRate': 14.5, 'remainingTenure': 24, 'dpd': 32},
  {'accountNo': 'LA-2024-001006', 'customerId': 'CUST-01006', 'customerName': 'Ruwan Fernando', 'nicNumber': '198912408933V', 'contactNumber': '+94 71 556 7788', 'loanType': 'Housing Loan', 'currentEMI': 65000.0, 'outstandingBalance': 5500000.0, 'interestRate': 11.0, 'remainingTenure': 96, 'dpd': 42},
  {'accountNo': 'LA-2024-001007', 'customerId': 'CUST-01007', 'customerName': 'Anura Kumara Senanayake', 'nicNumber': '197022301149V', 'contactNumber': '+94 76 990 1122', 'loanType': 'Personal Loan', 'currentEMI': 50000.0, 'outstandingBalance': 4000000.0, 'interestRate': 15.5, 'remainingTenure': 60, 'dpd': 95},
  {'accountNo': 'LA-2024-001008', 'customerId': 'CUST-01008', 'customerName': 'Harshani Gunawardena', 'nicNumber': '199277801244V', 'contactNumber': '+94 77 889 2233', 'loanType': 'Housing Loan', 'currentEMI': 80000.0, 'outstandingBalance': 7000000.0, 'interestRate': 11.8, 'remainingTenure': 180, 'dpd': 38},
  {'accountNo': 'LA-2024-001009', 'customerId': 'CUST-01009', 'customerName': 'Manjula Peiris', 'nicNumber': '198009204481V', 'contactNumber': '+94 71 332 4455', 'loanType': 'Personal Loan', 'currentEMI': 30000.0, 'outstandingBalance': 1500000.0, 'interestRate': 14.2, 'remainingTenure': 36, 'dpd': 58},
  {'accountNo': 'LA-2024-001010', 'customerId': 'CUST-01010', 'customerName': 'Shalika Gunasekara', 'nicNumber': '198755409988V', 'contactNumber': '+94 76 112 3344', 'loanType': 'Housing Loan', 'currentEMI': 110000.0, 'outstandingBalance': 9500000.0, 'interestRate': 12.2, 'remainingTenure': 144, 'dpd': 112},
  {'accountNo': 'LA-2024-001011', 'customerId': 'CUST-01011', 'customerName': 'Buddhika Ratnayake', 'nicNumber': '198612903342V', 'contactNumber': '+94 77 667 8899', 'loanType': 'Personal Loan', 'currentEMI': 28000.0, 'outstandingBalance': 1800000.0, 'interestRate': 14.8, 'remainingTenure': 48, 'dpd': 41},
  {'accountNo': 'LA-2024-001012', 'customerId': 'CUST-01012', 'customerName': 'Sanduni Alwis', 'nicNumber': '199388701239V', 'contactNumber': '+94 71 998 0011', 'loanType': 'Housing Loan', 'currentEMI': 75000.0, 'outstandingBalance': 6500000.0, 'interestRate': 11.2, 'remainingTenure': 120, 'dpd': 84},
  {'accountNo': 'LA-2024-001013', 'customerId': 'CUST-01013', 'customerName': 'Kasun Jayawardena', 'nicNumber': '199102403259V', 'contactNumber': '+94 76 887 9900', 'loanType': 'Personal Loan', 'currentEMI': 35000.0, 'outstandingBalance': 2200000.0, 'interestRate': 15.0, 'remainingTenure': 36, 'dpd': 47},
  {'accountNo': 'LA-2024-001014', 'customerId': 'CUST-01014', 'customerName': 'Duminda Silva', 'nicNumber': '197734901248V', 'contactNumber': '+94 72 334 9988', 'loanType': 'Housing Loan', 'currentEMI': 130000.0, 'outstandingBalance': 12000000.0, 'interestRate': 12.5, 'remainingTenure': 180, 'dpd': 108},
  {'accountNo': 'LA-2024-001015', 'customerId': 'CUST-01015', 'customerName': 'Oshadi Fernando', 'nicNumber': '199566708891V', 'contactNumber': '+94 77 443 6677', 'loanType': 'Personal Loan', 'currentEMI': 15000.0, 'outstandingBalance': 600000.0, 'interestRate': 14.0, 'remainingTenure': 24, 'dpd': 35},
  {'accountNo': 'LA-2024-001016', 'customerId': 'CUST-01016', 'customerName': 'Isuru Perera', 'nicNumber': '198829402219V', 'contactNumber': '+94 71 667 9988', 'loanType': 'Housing Loan', 'currentEMI': 95000.0, 'outstandingBalance': 8500000.0, 'interestRate': 11.9, 'remainingTenure': 144, 'dpd': 76},
  {'accountNo': 'LA-2024-001017', 'customerId': 'CUST-01017', 'customerName': 'Chathurika Jayasinghe', 'nicNumber': '198356701149V', 'contactNumber': '+94 76 554 8877', 'loanType': 'Personal Loan', 'currentEMI': 40000.0, 'outstandingBalance': 2500000.0, 'interestRate': 15.2, 'remainingTenure': 48, 'dpd': 52},
  {'accountNo': 'LA-2024-001018', 'customerId': 'CUST-01018', 'customerName': 'Nalin de Silva', 'nicNumber': '197412304899V', 'contactNumber': '+94 77 112 0099', 'loanType': 'Housing Loan', 'currentEMI': 140000.0, 'outstandingBalance': 13000000.0, 'interestRate': 12.8, 'remainingTenure': 168, 'dpd': 115},
  {'accountNo': 'LA-2024-001019', 'customerId': 'CUST-01019', 'customerName': 'Hansani Wijewardene', 'nicNumber': '199467803321V', 'contactNumber': '+94 71 889 4433', 'loanType': 'Personal Loan', 'currentEMI': 22000.0, 'outstandingBalance': 1100000.0, 'interestRate': 14.5, 'remainingTenure': 36, 'dpd': 43},
  {'accountNo': 'LA-2024-001020', 'customerId': 'CUST-01020', 'customerName': 'Samantha Dissanayake', 'nicNumber': '197902409981V', 'contactNumber': '+94 76 998 1133', 'loanType': 'Housing Loan', 'currentEMI': 105000.0, 'outstandingBalance': 9000000.0, 'interestRate': 12.1, 'remainingTenure': 120, 'dpd': 98},
  { accountNo: 'LA-2024-008912', customerId: 'CUST-00421', customerName: 'Nimal Perera', nicNumber: '198801245678V', contactNumber: '+94 77 123 4567', loanType: 'Personal Loan', currentEMI: 32450.0, outstandingBalance: 2840000.0, interestRate: 14.5, remainingTenure: 48, dpd: 45 },
  { accountNo: 'LA-2024-007890', customerId: 'CUST-00210', customerName: 'Sunil Fernando', nicNumber: '197548962314V', contactNumber: '+94 71 456 7890', loanType: 'Housing Loan', currentEMI: 85000.0, outstandingBalance: 8500000.0, interestRate: 12.0, remainingTenure: 120, dpd: 102 },
  { accountNo: 'LA-2024-009988', customerId: 'CUST-00654', customerName: 'Amara Wijesinghe', nicNumber: '198256123478V', contactNumber: '+94 72 789 0123', loanType: 'Housing Loan', currentEMI: 150000.0, outstandingBalance: 12000000.0, interestRate: 15.0, remainingTenure: 60, dpd: 78 },
  { accountNo: 'LA-2024-006655', customerId: 'CUST-00991', customerName: 'Gayan Madushanka', nicNumber: '199145236789V', contactNumber: '+94 76 321 6549', loanType: 'Personal Loan', currentEMI: 45000.0, outstandingBalance: 1500000.0, interestRate: 13.5, remainingTenure: 36, dpd: 31 },
  { accountNo: 'LA-2024-007200', customerId: 'CUST-00720', customerName: 'John Silva', nicNumber: '198001245678V', contactNumber: '+94 77 123 4567', loanType: 'Housing Loan', currentEMI: 72000.0, outstandingBalance: 6000000.0, interestRate: 12.0, remainingTenure: 120, dpd: 45 }
];

let mockCases = [
  {'id': 'CF-2025-1001', 'customerId': 'CUST-01001', 'customerName': 'K. L. Rahal Cooray', 'nicNumber': '198522304912V', 'contactNumber': '+94 77 220 1199', 'loanAccountNo': 'LA-2024-001001', 'loanType': 'Personal Loan', 'currentEMI': 25000.0, 'outstandingBalance': 1200000.0, 'interestRate': 14.0, 'remainingTenure': 36, 'dpd': 45, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 18750, 'proposedTenure': 48, 'revisedInterestRate': 12.0, 'stage': 1, 'assignedOfficer': 'K. Jayawardena', 'status': 'Under Review', 'creationDate': '2026-06-10', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer K. L. Rahal Cooray.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-10', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-10', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1002', 'customerId': 'CUST-01002', 'customerName': 'Dilani Wickramasinghe', 'nicNumber': '199065403211V', 'contactNumber': '+94 71 889 0022', 'loanAccountNo': 'LA-2024-001002', 'loanType': 'Housing Loan', 'currentEMI': 90000.0, 'outstandingBalance': 8000000.0, 'interestRate': 11.5, 'remainingTenure': 144, 'dpd': 92, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 67500, 'proposedTenure': 180, 'revisedInterestRate': 9.5, 'stage': 2, 'assignedOfficer': 'Ruwan Silva', 'status': 'Under Review', 'creationDate': '2026-06-11', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Dilani Wickramasinghe.', 'monitoringActivated': false, 'monitoringPeriodDays': 120, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-11', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-11', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1003', 'customerId': 'CUST-01003', 'customerName': 'Tharindu Jayasekara', 'nicNumber': '198211204859V', 'contactNumber': '+94 76 443 1122', 'loanAccountNo': 'LA-2024-001003', 'loanType': 'Personal Loan', 'currentEMI': 45000.0, 'outstandingBalance': 3000000.0, 'interestRate': 15.0, 'remainingTenure': 48, 'dpd': 62, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 33750, 'proposedTenure': 60, 'revisedInterestRate': 13.0, 'stage': 3, 'assignedOfficer': 'Thilini Kumara', 'status': 'Under Review', 'creationDate': '2026-06-12', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Tharindu Jayasekara.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-12', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-12', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1004', 'customerId': 'CUST-01004', 'customerName': 'Priyantha Herath', 'nicNumber': '197808904561V', 'contactNumber': '+94 72 990 8877', 'loanAccountNo': 'LA-2024-001004', 'loanType': 'Housing Loan', 'currentEMI': 120000.0, 'outstandingBalance': 11000000.0, 'interestRate': 12.0, 'remainingTenure': 120, 'dpd': 105, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 90000, 'proposedTenure': 156, 'revisedInterestRate': 10.0, 'stage': 4, 'assignedOfficer': 'Mahesh Perera', 'status': 'Pending Approval', 'creationDate': '2026-06-13', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Priyantha Herath.', 'monitoringActivated': false, 'monitoringPeriodDays': 120, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-13', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-13', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1005', 'customerId': 'CUST-01005', 'customerName': 'Nilanthi Rajapakse', 'nicNumber': '198455601248V', 'contactNumber': '+94 77 334 5566', 'loanAccountNo': 'LA-2024-001005', 'loanType': 'Personal Loan', 'currentEMI': 18000.0, 'outstandingBalance': 800000.0, 'interestRate': 14.5, 'remainingTenure': 24, 'dpd': 32, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 13500, 'proposedTenure': 36, 'revisedInterestRate': 12.5, 'stage': 5, 'assignedOfficer': 'Nirosha Fernando', 'status': 'Under Review', 'creationDate': '2026-06-14', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Nilanthi Rajapakse.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-14', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-14', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1006', 'customerId': 'CUST-01006', 'customerName': 'Ruwan Fernando', 'nicNumber': '198912408933V', 'contactNumber': '+94 71 556 7788', 'loanAccountNo': 'LA-2024-001006', 'loanType': 'Housing Loan', 'currentEMI': 65000.0, 'outstandingBalance': 5500000.0, 'interestRate': 11.0, 'remainingTenure': 96, 'dpd': 42, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 48750, 'proposedTenure': 108, 'revisedInterestRate': 9.0, 'stage': 6, 'assignedOfficer': 'K. Jayawardena', 'status': 'Approved', 'creationDate': '2026-06-15', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Ruwan Fernando.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-15', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-15', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1007', 'customerId': 'CUST-01007', 'customerName': 'Anura Kumara Senanayake', 'nicNumber': '197022301149V', 'contactNumber': '+94 76 990 1122', 'loanAccountNo': 'LA-2024-001007', 'loanType': 'Personal Loan', 'currentEMI': 50000.0, 'outstandingBalance': 4000000.0, 'interestRate': 15.5, 'remainingTenure': 60, 'dpd': 95, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 37500, 'proposedTenure': 96, 'revisedInterestRate': 13.5, 'stage': 7, 'assignedOfficer': 'Ruwan Silva', 'status': 'Monitoring Active', 'creationDate': '2026-06-16', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Anura Kumara Senanayake.', 'monitoringActivated': true, 'monitoringPeriodDays': 120, 'monitoringDaysCompleted': 15, 'monitoringEmiStatus': 'Up to Date', 'monitoringLastPayment': '10 Jun 2026', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Compliant', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-16', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-16', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1008', 'customerId': 'CUST-01008', 'customerName': 'Harshani Gunawardena', 'nicNumber': '199277801244V', 'contactNumber': '+94 77 889 2233', 'loanAccountNo': 'LA-2024-001008', 'loanType': 'Housing Loan', 'currentEMI': 80000.0, 'outstandingBalance': 7000000.0, 'interestRate': 11.8, 'remainingTenure': 180, 'dpd': 38, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 60000, 'proposedTenure': 192, 'revisedInterestRate': 9.8, 'stage': 1, 'assignedOfficer': 'Thilini Kumara', 'status': 'Under Review', 'creationDate': '2026-06-17', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Harshani Gunawardena.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-17', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-17', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1009', 'customerId': 'CUST-01009', 'customerName': 'Manjula Peiris', 'nicNumber': '198009204481V', 'contactNumber': '+94 71 332 4455', 'loanAccountNo': 'LA-2024-001009', 'loanType': 'Personal Loan', 'currentEMI': 30000.0, 'outstandingBalance': 1500000.0, 'interestRate': 14.2, 'remainingTenure': 36, 'dpd': 58, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 22500, 'proposedTenure': 48, 'revisedInterestRate': 12.2, 'stage': 2, 'assignedOfficer': 'Mahesh Perera', 'status': 'Under Review', 'creationDate': '2026-06-18', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Manjula Peiris.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-18', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-18', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1010', 'customerId': 'CUST-01010', 'customerName': 'Shalika Gunasekara', 'nicNumber': '198755409988V', 'contactNumber': '+94 76 112 3344', 'loanAccountNo': 'LA-2024-001010', 'loanType': 'Housing Loan', 'currentEMI': 110000.0, 'outstandingBalance': 9500000.0, 'interestRate': 12.2, 'remainingTenure': 144, 'dpd': 112, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 82500, 'proposedTenure': 180, 'revisedInterestRate': 10.2, 'stage': 3, 'assignedOfficer': 'Nirosha Fernando', 'status': 'Under Review', 'creationDate': '2026-06-19', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Shalika Gunasekara.', 'monitoringActivated': false, 'monitoringPeriodDays': 120, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-19', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-19', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1011', 'customerId': 'CUST-01011', 'customerName': 'Buddhika Ratnayake', 'nicNumber': '198612903342V', 'contactNumber': '+94 77 667 8899', 'loanAccountNo': 'LA-2024-001011', 'loanType': 'Personal Loan', 'currentEMI': 28000.0, 'outstandingBalance': 1800000.0, 'interestRate': 14.8, 'remainingTenure': 48, 'dpd': 41, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 21000, 'proposedTenure': 60, 'revisedInterestRate': 12.8, 'stage': 4, 'assignedOfficer': 'K. Jayawardena', 'status': 'Pending Approval', 'creationDate': '2026-06-20', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Buddhika Ratnayake.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-20', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-20', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1012', 'customerId': 'CUST-01012', 'customerName': 'Sanduni Alwis', 'nicNumber': '199388701239V', 'contactNumber': '+94 71 998 0011', 'loanAccountNo': 'LA-2024-001012', 'loanType': 'Housing Loan', 'currentEMI': 75000.0, 'outstandingBalance': 6500000.0, 'interestRate': 11.2, 'remainingTenure': 120, 'dpd': 84, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 56250, 'proposedTenure': 132, 'revisedInterestRate': 9.2, 'stage': 5, 'assignedOfficer': 'Ruwan Silva', 'status': 'Under Review', 'creationDate': '2026-06-21', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Sanduni Alwis.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-21', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-21', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1013', 'customerId': 'CUST-01013', 'customerName': 'Kasun Jayawardena', 'nicNumber': '199102403259V', 'contactNumber': '+94 76 887 9900', 'loanAccountNo': 'LA-2024-001013', 'loanType': 'Personal Loan', 'currentEMI': 35000.0, 'outstandingBalance': 2200000.0, 'interestRate': 15.0, 'remainingTenure': 36, 'dpd': 47, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 26250, 'proposedTenure': 48, 'revisedInterestRate': 13.0, 'stage': 6, 'assignedOfficer': 'Thilini Kumara', 'status': 'Approved', 'creationDate': '2026-06-22', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Kasun Jayawardena.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-22', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-22', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1014', 'customerId': 'CUST-01014', 'customerName': 'Duminda Silva', 'nicNumber': '197734901248V', 'contactNumber': '+94 72 334 9988', 'loanAccountNo': 'LA-2024-001014', 'loanType': 'Housing Loan', 'currentEMI': 130000.0, 'outstandingBalance': 12000000.0, 'interestRate': 12.5, 'remainingTenure': 180, 'dpd': 108, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 97500, 'proposedTenure': 216, 'revisedInterestRate': 10.5, 'stage': 7, 'assignedOfficer': 'Mahesh Perera', 'status': 'Monitoring Active', 'creationDate': '2026-06-23', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Duminda Silva.', 'monitoringActivated': true, 'monitoringPeriodDays': 120, 'monitoringDaysCompleted': 15, 'monitoringEmiStatus': 'Up to Date', 'monitoringLastPayment': '10 Jun 2026', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Compliant', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-23', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-23', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1015', 'customerId': 'CUST-01015', 'customerName': 'Oshadi Fernando', 'nicNumber': '199566708891V', 'contactNumber': '+94 77 443 6677', 'loanAccountNo': 'LA-2024-001015', 'loanType': 'Personal Loan', 'currentEMI': 15000.0, 'outstandingBalance': 600000.0, 'interestRate': 14.0, 'remainingTenure': 24, 'dpd': 35, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 11250, 'proposedTenure': 36, 'revisedInterestRate': 12.0, 'stage': 1, 'assignedOfficer': 'Nirosha Fernando', 'status': 'Under Review', 'creationDate': '2026-06-24', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Oshadi Fernando.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-24', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-24', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1016', 'customerId': 'CUST-01016', 'customerName': 'Isuru Perera', 'nicNumber': '198829402219V', 'contactNumber': '+94 71 667 9988', 'loanAccountNo': 'LA-2024-001016', 'loanType': 'Housing Loan', 'currentEMI': 95000.0, 'outstandingBalance': 8500000.0, 'interestRate': 11.9, 'remainingTenure': 144, 'dpd': 76, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 71250, 'proposedTenure': 156, 'revisedInterestRate': 9.9, 'stage': 2, 'assignedOfficer': 'K. Jayawardena', 'status': 'Under Review', 'creationDate': '2026-06-25', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Isuru Perera.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-25', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-25', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1017', 'customerId': 'CUST-01017', 'customerName': 'Chathurika Jayasinghe', 'nicNumber': '198356701149V', 'contactNumber': '+94 76 554 8877', 'loanAccountNo': 'LA-2024-001017', 'loanType': 'Personal Loan', 'currentEMI': 40000.0, 'outstandingBalance': 2500000.0, 'interestRate': 15.2, 'remainingTenure': 48, 'dpd': 52, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 30000, 'proposedTenure': 60, 'revisedInterestRate': 13.2, 'stage': 3, 'assignedOfficer': 'Ruwan Silva', 'status': 'Under Review', 'creationDate': '2026-06-26', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Chathurika Jayasinghe.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-26', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-26', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1018', 'customerId': 'CUST-01018', 'customerName': 'Nalin de Silva', 'nicNumber': '197412304899V', 'contactNumber': '+94 77 112 0099', 'loanAccountNo': 'LA-2024-001018', 'loanType': 'Housing Loan', 'currentEMI': 140000.0, 'outstandingBalance': 13000000.0, 'interestRate': 12.8, 'remainingTenure': 168, 'dpd': 115, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 105000, 'proposedTenure': 204, 'revisedInterestRate': 10.8, 'stage': 4, 'assignedOfficer': 'Thilini Kumara', 'status': 'Pending Approval', 'creationDate': '2026-06-27', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Nalin de Silva.', 'monitoringActivated': false, 'monitoringPeriodDays': 120, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-27', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-27', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1019', 'customerId': 'CUST-01019', 'customerName': 'Hansani Wijewardene', 'nicNumber': '199467803321V', 'contactNumber': '+94 71 889 4433', 'loanAccountNo': 'LA-2024-001019', 'loanType': 'Personal Loan', 'currentEMI': 22000.0, 'outstandingBalance': 1100000.0, 'interestRate': 14.5, 'remainingTenure': 36, 'dpd': 43, 'classification': 'Restructure (<90 Days)', 'proposedEMI': 16500, 'proposedTenure': 48, 'revisedInterestRate': 12.5, 'stage': 5, 'assignedOfficer': 'Mahesh Perera', 'status': 'Under Review', 'creationDate': '2026-06-28', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Hansani Wijewardene.', 'monitoringActivated': false, 'monitoringPeriodDays': 90, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-28', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-28', 'type': 'System', 'details': 'Restructuring case created'}]},
  {'id': 'CF-2025-1020', 'customerId': 'CUST-01020', 'customerName': 'Samantha Dissanayake', 'nicNumber': '197902409981V', 'contactNumber': '+94 76 998 1133', 'loanAccountNo': 'LA-2024-001020', 'loanType': 'Housing Loan', 'currentEMI': 105000.0, 'outstandingBalance': 9000000.0, 'interestRate': 12.1, 'remainingTenure': 120, 'dpd': 98, 'classification': 'Reschedule (>90 Days)', 'proposedEMI': 78750, 'proposedTenure': 156, 'revisedInterestRate': 10.1, 'stage': 6, 'assignedOfficer': 'Nirosha Fernando', 'status': 'Approved', 'creationDate': '2026-06-29', 'approvalRecommendation': 'Recommended parameters set matching restructured repayment profile for customer Samantha Dissanayake.', 'monitoringActivated': false, 'monitoringPeriodDays': 120, 'monitoringDaysCompleted': 0, 'monitoringEmiStatus': 'Pending Activation', 'monitoringLastPayment': 'N/A', 'monitoringMissedPayments': 0, 'monitoringComplianceStatus': 'Pending', 'documents': [{'name': 'Request_Letter.pdf', 'type': 'PDF', 'uploadDate': '2026-06-29', 'verification': 'Verified'}], 'comments': [], 'communications': [{'date': '2026-06-29', 'type': 'System', 'details': 'Restructuring case created'}]},
  {
    id: 'CF-2025-0891',
    customerId: 'CUST-00421',
    customerName: 'Nimal Perera',
    nicNumber: '198801245678V',
    contactNumber: '+94 77 123 4567',
    loanAccountNo: 'LA-2024-008912',
    loanType: 'Personal Loan',
    currentEMI: 32450.0,
    outstandingBalance: 2840000.0,
    interestRate: 14.5,
    remainingTenure: 48,
    dpd: 45,
    classification: 'Restructure (<90 Days)',
    proposedEMI: 24000.0,
    proposedTenure: 60,
    revisedInterestRate: 12.5,
    stage: 4,
    assignedOfficer: 'Kanchana Jayawardena',
    status: 'Pending Approval',
    creationDate: '2026-06-12',
    approvalRecommendation: 'Based on DPD analysis and financial profile, this case qualifies for RESTRUCTURING under Policy Ref. CR-2024-04.',
    monitoringActivated: false,
    monitoringPeriodDays: 90,
    monitoringDaysCompleted: 0,
    monitoringEmiStatus: 'Pending Activation',
    monitoringLastPayment: 'N/A',
    monitoringMissedPayments: 0,
    monitoringComplianceStatus: 'Pending',
    documents: [
      { name: 'Request_Letter.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Verified' },
      { name: 'Salary_Slip_May.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Verified' },
      { name: 'Salary_Slip_Apr.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Verified' },
      { name: 'Employer_Conf.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Verified' },
      { name: 'CRIB_Report.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Pending' }
    ],
    comments: [],
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
    currentEMI: 85000.0,
    outstandingBalance: 8500000.0,
    interestRate: 12.0,
    remainingTenure: 120,
    dpd: 102,
    classification: 'Reschedule (>90 Days)',
    proposedEMI: 65000.0,
    proposedTenure: 156,
    revisedInterestRate: 11.5,
    stage: 7,
    assignedOfficer: 'Ruwan Silva',
    status: 'Monitoring Active',
    creationDate: '2026-05-10',
    approvalRecommendation: 'Customer DPD is 102. Under CBSL directives, account is rescheduled with a 120-day monitoring period.',
    monitoringActivated: true,
    monitoringPeriodDays: 120,
    monitoringDaysCompleted: 30,
    monitoringEmiStatus: 'Up to Date',
    monitoringLastPayment: '10 Jun 2026',
    monitoringMissedPayments: 0,
    monitoringComplianceStatus: 'Compliant',
    documents: [
      { name: 'Request_Letter.pdf', type: 'PDF', uploadDate: '10 May 2026', verification: 'Verified' },
      { name: 'CRIB_Report.pdf', type: 'PDF', uploadDate: '10 May 2026', verification: 'Verified' },
      { name: 'Signed_Reschedule_Agreement.pdf', type: 'PDF', uploadDate: '18 May 2026', verification: 'Verified' }
    ],
    comments: [
      { author: 'Ruwan Silva', date: '2026-05-15', text: 'Approved based on core collateral values and repayment justification.' }
    ],
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
    currentEMI: 150000.0,
    outstandingBalance: 12000000.0,
    interestRate: 15.0,
    remainingTenure: 60,
    dpd: 78,
    classification: 'Restructure (<90 Days)',
    proposedEMI: 110000.0,
    proposedTenure: 84,
    revisedInterestRate: 13.0,
    stage: 2,
    assignedOfficer: 'Thilini Kumara',
    status: 'Under Review',
    creationDate: '2026-06-15',
    approvalRecommendation: '',
    monitoringActivated: false,
    monitoringPeriodDays: 90,
    monitoringDaysCompleted: 0,
    monitoringEmiStatus: 'Pending Activation',
    monitoringLastPayment: 'N/A',
    monitoringMissedPayments: 0,
    monitoringComplianceStatus: 'Pending',
    documents: [
      { name: 'Request_Letter.pdf', type: 'PDF', uploadDate: '15 Jun 2026', verification: 'Verified' }
    ],
    comments: [],
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
    currentEMI: 45000.0,
    outstandingBalance: 1500000.0,
    interestRate: 13.5,
    remainingTenure: 36,
    dpd: 31,
    classification: 'Restructure (<90 Days)',
    proposedEMI: 35000.0,
    proposedTenure: 48,
    revisedInterestRate: 12.0,
    stage: 6,
    assignedOfficer: 'Mahesh Perera',
    status: 'Approved',
    creationDate: '2026-06-08',
    approvalRecommendation: 'Personal loan restructure approved to match reduced transport contract income.',
    monitoringActivated: false,
    monitoringPeriodDays: 90,
    monitoringDaysCompleted: 0,
    monitoringEmiStatus: 'Pending Activation',
    monitoringLastPayment: 'N/A',
    monitoringMissedPayments: 0,
    monitoringComplianceStatus: 'Pending',
    documents: [
      { name: 'Request_Letter.pdf', type: 'PDF', uploadDate: '08 Jun 2026', verification: 'Verified' },
      { name: 'Salary_Slip.pdf', type: 'PDF', uploadDate: '08 Jun 2026', verification: 'Verified' },
      { name: 'Signed_Restructure_App.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Verified' },
      { name: 'Signed_Loan_Amendment.pdf', type: 'PDF', uploadDate: '12 Jun 2026', verification: 'Verified' }
    ],
    comments: [
      { author: 'Ruwan Silva', date: '2026-06-10', text: 'Approve restructure, extend tenure by 12 months.' }
    ],
    communications: [
      { date: '12 Jun 2026', type: 'Sales', details: 'Customer signed applications collected and uploaded' },
      { date: '10 Jun 2026', type: 'System', details: 'Approval notice sent to sales unit' }
    ]
  }
];

let mockLogs = [
  { id: 'AUD-20260617-00101', timestamp: '2026-06-17 11:42:05', user: 'K. Jayawardena', module: 'Cases', action: 'Case Updated', details: 'CF-2025-0891 status changed', ipAddress: '192.168.1.42', status: 'Success', changeField: 'Status', changeBefore: 'Under Review', changeAfter: 'Pending Approval', changeComment: 'Uploaded supporting documents' },
  { id: 'AUD-20260617-00102', timestamp: '2026-06-17 11:38:14', user: 'Ruwan Silva', module: 'Approvals', action: 'Approval Granted', details: 'CF-2025-0888 approved', ipAddress: '192.168.1.18', status: 'Success', changeField: 'Stage', changeBefore: 'Credit Approval', changeAfter: 'Sales Consent', changeComment: 'Recommended with +12m extension' },
  { id: 'AUD-20260617-00103', timestamp: '2026-06-17 11:15:03', user: 'Thilini Kumara', module: 'Documents', action: 'Doc Uploaded', details: 'Signed forms uploaded for CF-2025-0888', ipAddress: '192.168.1.55', status: 'Success', changeField: 'Documents', changeBefore: '2 documents', changeAfter: '4 documents', changeComment: 'Restructure & Amendment signed' },
  { id: 'AUD-20260617-00104', timestamp: '2026-06-17 10:52:30', user: 'System', module: 'Monitoring', action: 'Auto Alert Sent', details: 'Compliance alert created for CF-0841', ipAddress: '—', status: 'Success', changeField: 'Missed Payment', changeBefore: '0', changeAfter: '1', changeComment: 'System auto-recalculation' },
  { id: 'AUD-20260617-00105', timestamp: '2026-06-17 10:44:10', user: 'Mahesh Perera', module: 'Cases', action: 'Case Viewed', details: 'CF-2025-0888 accessed', ipAddress: '192.168.1.21', status: 'Success', changeField: null, changeBefore: null, changeAfter: null, changeComment: null },
  { id: 'AUD-20260617-00106', timestamp: '2026-06-17 10:31:55', user: 'Unknown', module: 'Auth', action: 'Login Failed', details: '3 consecutive failures', ipAddress: '210.18.5.32', status: 'Failed', changeField: 'Login attempt', changeBefore: 'None', changeAfter: 'Locked', changeComment: 'IP blocked for 30 minutes' },
  { id: 'AUD-20260617-00107', timestamp: '2026-06-17 09:58:47', user: 'Amali Dissanayake', module: 'Users', action: 'User Created', details: 'EMP-0079 account activated', ipAddress: '192.168.1.10', status: 'Success', changeField: 'User list', changeBefore: '23 users', changeAfter: '24 users', changeComment: 'New Credit Processing Officer added' },
  { id: 'AUD-20260617-00108', timestamp: '2026-06-17 09:10:14', user: 'K. Jayawardena', module: 'Settings', action: 'Config Changed', details: 'Email alert threshold updated', ipAddress: '192.168.1.42', status: 'Warning', changeField: 'Notification offset', changeBefore: '5 days', changeAfter: '3 days', changeComment: 'Approved by Remedial Head' }
];

let mockConfig = { dpdCutoff: '90', aiConfidenceThreshold: '80' };

const getHeaders = () => {
  const token = sessionStorage.getItem('cf_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  async login(username, password, role, isDemo = false) {
    if (isDemo || username === 'demo') {
      isMockMode = true;
      const u = mockUsers.find(u => u.role === role) || mockUsers[0];
      const data = {
        success: true,
        token: 'demo-token-123',
        username: u.username,
        name: u.name,
        role: u.role,
        employeeId: u.employeeId,
        branch: u.branch,
        status: u.status,
        permissions: u.permissions
      };
      sessionStorage.setItem('cf_token', data.token);
      sessionStorage.setItem('cf_current_user', JSON.stringify(data));
      return { success: true, user: data };
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }
      sessionStorage.setItem('cf_token', data.token);
      sessionStorage.setItem('cf_current_user', JSON.stringify({
        username: data.username,
        name: data.name,
        role: data.role,
        employeeId: data.employeeId,
        branch: data.branch,
        status: data.status,
        permissions: data.permissions ? data.permissions.split(', ') : []
      }));
      return { success: true, user: data };
    } catch (e) {
      console.warn('Cannot connect to Spring Boot backend server. Switching to Offline Mock Mode.');
      isMockMode = true;
      const u = mockUsers.find(user => user.username === username && user.role === role);
      if (u) {
        const data = {
          success: true,
          token: 'demo-token-123',
          username: u.username,
          name: u.name,
          role: u.role,
          employeeId: u.employeeId,
          branch: u.branch,
          status: u.status,
          permissions: u.permissions
        };
        sessionStorage.setItem('cf_token', data.token);
        sessionStorage.setItem('cf_current_user', JSON.stringify(data));
        return { success: true, user: data };
      }
      return { success: false, error: 'Cannot connect to Spring Boot backend server.' };
    }
  },

  async register(userData) {
    try {
      if (isMockMode) {
        mockUsers.push({
          username: userData.username,
          name: userData.name,
          role: userData.role || 'Remedial Officer',
          employeeId: 'EMP-' + Math.floor(1000 + Math.random() * 9000),
          branch: userData.branch || 'Colombo Main Branch',
          status: 'Active',
          permissions: 'Create Cases'
        });
        return { success: true };
      }
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }
      return { success: true };
    } catch (e) {
      console.warn('Backend connection failed, registering in Mock Mode');
      isMockMode = true;
      mockUsers.push({
        username: userData.username,
        name: userData.name,
        role: userData.role || 'Remedial Officer',
        employeeId: 'EMP-' + Math.floor(1000 + Math.random() * 9000),
        branch: userData.branch || 'Colombo Main Branch',
        status: 'Active',
        permissions: 'Create Cases'
      });
      return { success: true };
    }
  },

  logout() {
    sessionStorage.removeItem('cf_token');
    sessionStorage.removeItem('cf_current_user');
  },

  // Loans
  async getLoanByAccount(accountNo) {
    if (isMockMode) {
      return mockLoans.find(l => l.accountNo === accountNo) || null;
    }
    try {
      const res = await fetch(`${API_URL}/loans/${accountNo}`, {
        headers: getHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      isMockMode = true;
      return mockLoans.find(l => l.accountNo === accountNo) || null;
    }
  },

  async createLoan(loanData) {
    if (isMockMode) {
      const newL = { ...loanData };
      mockLoans.push(newL);
      return { success: true, loan: newL };
    }
    try {
      const res = await fetch(`${API_URL}/loans/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(loanData)
      });
      if (!res.ok) {
        let errorMsg = 'Failed to seed loan.';
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch (_) {}
        return { success: false, error: errorMsg };
      }
      const data = await res.json();
      return { success: true, loan: data };
    } catch (e) {
      isMockMode = true;
      const newL = { ...loanData };
      mockLoans.push(newL);
      return { success: true, loan: newL };
    }
  },

  // Cases
  async getCases() {
    if (isMockMode) return mockCases;
    try {
      const res = await fetch(`${API_URL}/cases`, {
        headers: getHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      isMockMode = true;
      return mockCases;
    }
  },

  async getCaseById(id) {
    if (isMockMode) return mockCases.find(c => c.id === id) || null;
    try {
      const res = await fetch(`${API_URL}/cases/${id}`, {
        headers: getHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      isMockMode = true;
      return mockCases.find(c => c.id === id) || null;
    }
  },

  async createCase(caseData) {
    if (isMockMode) {
      const user = JSON.parse(sessionStorage.getItem('cf_current_user'));
      const newCase = {
        ...caseData,
        id: 'CF-2025-' + Math.floor(1000 + Math.random() * 9000),
        assignedOfficer: user ? user.name : 'Unassigned',
        status: 'Under Review',
        creationDate: new Date().toISOString().slice(0, 10),
        monitoringActivated: false,
        monitoringPeriodDays: 90,
        monitoringDaysCompleted: 0,
        monitoringEmiStatus: 'Pending Activation',
        monitoringLastPayment: 'N/A',
        monitoringMissedPayments: 0,
        monitoringComplianceStatus: 'Pending',
        documents: [],
        comments: [],
        communications: []
      };
      mockCases.unshift(newCase);
      return newCase;
    }
    try {
      const user = JSON.parse(sessionStorage.getItem('cf_current_user'));
      const payload = {
        ...caseData,
        assignedOfficer: user ? user.name : 'Unassigned'
      };

      const res = await fetch(`${API_URL}/cases/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Create case failed.');
      return await res.json();
    } catch (e) {
      isMockMode = true;
      const user = JSON.parse(sessionStorage.getItem('cf_current_user'));
      const newCase = {
        ...caseData,
        id: 'CF-2025-' + Math.floor(1000 + Math.random() * 9000),
        assignedOfficer: user ? user.name : 'Unassigned',
        status: 'Under Review',
        creationDate: new Date().toISOString().slice(0, 10),
        monitoringActivated: false,
        monitoringPeriodDays: 90,
        monitoringDaysCompleted: 0,
        monitoringEmiStatus: 'Pending Activation',
        monitoringLastPayment: 'N/A',
        monitoringMissedPayments: 0,
        monitoringComplianceStatus: 'Pending',
        documents: [],
        comments: [],
        communications: []
      };
      mockCases.unshift(newCase);
      return newCase;
    }
  },

  async updateCaseStage(caseId, newStage, comment) {
    if (isMockMode) {
      const caseObj = mockCases.find(c => c.id === caseId);
      if (caseObj) {
        caseObj.stage = newStage;
        if (newStage === 3) caseObj.status = 'Document Verification';
        else if (newStage === 4) caseObj.status = 'Pending Approval';
        else if (newStage === 5) caseObj.status = 'Pending Customer Consent';
        else if (newStage === 6) caseObj.status = 'Approved';
        else if (newStage === 7) {
          caseObj.status = 'Monitoring Active';
          caseObj.monitoringActivated = true;
        }
        if (comment) {
          const user = JSON.parse(sessionStorage.getItem('cf_current_user'));
          caseObj.comments.unshift({
            author: user ? user.name : 'System',
            date: new Date().toISOString().slice(0, 10),
            text: comment
          });
        }
      }
      return caseObj;
    }
    try {
      const user = JSON.parse(sessionStorage.getItem('cf_current_user'));
      const res = await fetch(`${API_URL}/cases/${caseId}/stage`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          stage: newStage,
          comment,
          author: user ? user.name : 'System'
        })
      });
      if (!res.ok) throw new Error('Stage transition failed.');
      return await res.json();
    } catch (e) {
      isMockMode = true;
      const caseObj = mockCases.find(c => c.id === caseId);
      if (caseObj) {
        caseObj.stage = newStage;
        if (newStage === 3) caseObj.status = 'Document Verification';
        else if (newStage === 4) caseObj.status = 'Pending Approval';
        else if (newStage === 5) caseObj.status = 'Pending Customer Consent';
        else if (newStage === 6) caseObj.status = 'Approved';
        else if (newStage === 7) {
          caseObj.status = 'Monitoring Active';
          caseObj.monitoringActivated = true;
        }
        if (comment) {
          const user = JSON.parse(sessionStorage.getItem('cf_current_user'));
          caseObj.comments.unshift({
            author: user ? user.name : 'System',
            date: new Date().toISOString().slice(0, 10),
            text: comment
          });
        }
      }
      return caseObj;
    }
  },

  async updateCaseDetails(caseId, updatedDetails) {
    if (isMockMode) {
      const caseObj = mockCases.find(c => c.id === caseId);
      if (caseObj) {
        Object.assign(caseObj, updatedDetails);
      }
      return caseObj;
    }
    try {
      const res = await fetch(`${API_URL}/cases/${caseId}/details`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedDetails)
      });
      if (!res.ok) throw new Error('Update case details failed.');
      return await res.json();
    } catch (e) {
      isMockMode = true;
      const caseObj = mockCases.find(c => c.id === caseId);
      if (caseObj) {
        Object.assign(caseObj, updatedDetails);
      }
      return caseObj;
    }
  },

  async verifyDocuments(caseId) {
    if (isMockMode) {
      const caseObj = mockCases.find(c => c.id === caseId);
      const isNegative = caseObj && caseObj.documents.some(d => d.name.toLowerCase().includes('fake') || d.name.toLowerCase().includes('wrong'));
      
      const results = {
        confidenceScore: isNegative ? 35 : 95,
        completeness: true,
        formatValid: true,
        signatureDetected: !isNegative,
        dataMatches: !isNegative,
        dateConsistency: !isNegative,
        duplicateCheck: true
      };

      if (caseObj) {
        caseObj.documents.forEach(d => {
          if (d.name.toLowerCase().includes('fake') || d.name.toLowerCase().includes('wrong')) {
            d.verification = 'Failed';
          } else {
            d.verification = 'Verified';
          }
        });
        caseObj.status = isNegative ? 'AI Flagged' : 'AI Verified';
      }
      return results;
    }
    try {
      const res = await fetch(`${API_URL}/cases/${caseId}/verify`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('AI document verification call failed.');
      return await res.json();
    } catch (e) {
      isMockMode = true;
      return this.verifyDocuments(caseId); // recurse once in mock mode
    }
  },

  async uploadCaseDocument(caseId, file) {
    if (isMockMode) {
      const caseObj = mockCases.find(c => c.id === caseId);
      const newDoc = {
        name: file.name,
        type: file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Image',
        uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        verification: 'Pending'
      };
      if (caseObj) {
        caseObj.documents.push(newDoc);
      }
      return newDoc;
    }
    try {
      const token = sessionStorage.getItem('cf_token');
      const formData = new FormData();
      formData.append('file', file);

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/cases/${caseId}/upload`, {
        method: 'POST',
        headers,
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      return await res.json();
    } catch (e) {
      isMockMode = true;
      const caseObj = mockCases.find(c => c.id === caseId);
      const newDoc = {
        name: file.name,
        type: file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Image',
        uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        verification: 'Pending'
      };
      if (caseObj) {
        caseObj.documents.push(newDoc);
      }
      return newDoc;
    }
  },

  async deleteCaseDocument(caseId, fileName) {
    if (isMockMode) {
      const caseObj = mockCases.find(c => c.id === caseId);
      if (caseObj) {
        caseObj.documents = caseObj.documents.filter(d => d.name !== fileName);
      }
      return { success: true };
    }
    try {
      const token = sessionStorage.getItem('cf_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/cases/${caseId}/files/${fileName}`, {
        method: 'DELETE',
        headers
      });
      if (!res.ok) throw new Error('Delete failed');
      return await res.json();
    } catch (e) {
      isMockMode = true;
      const caseObj = mockCases.find(c => c.id === caseId);
      if (caseObj) {
        caseObj.documents = caseObj.documents.filter(d => d.name !== fileName);
      }
      return { success: true };
    }
  },

  // Users Management (Admin)
  async getUsers() {
    if (isMockMode) return mockUsers;
    try {
      const res = await fetch(`${API_URL}/users/list`, {
        headers: getHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      isMockMode = true;
      return mockUsers;
    }
  },

  async saveUser(userRequest) {
    if (isMockMode) {
      const user = mockUsers.find(u => u.employeeId === userRequest.employeeId);
      if (user) {
        Object.assign(user, userRequest);
        return user;
      } else {
        const newUser = {
          ...userRequest,
          status: 'Active'
        };
        mockUsers.push(newUser);
        return newUser;
      }
    }
    try {
      const res = await fetch(`${API_URL}/users/save`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userRequest)
      });
      if (!res.ok) throw new Error('Save user profile failed.');
      return await res.json();
    } catch (e) {
      isMockMode = true;
      return this.saveUser(userRequest);
    }
  },

  async toggleUserStatus(employeeId) {
    if (isMockMode) {
      const user = mockUsers.find(u => u.employeeId === employeeId);
      if (user) {
        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
      }
      return user;
    }
    try {
      const res = await fetch(`${API_URL}/users/toggle-status/${employeeId}`, {
        method: 'PUT',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Status modification failed.');
      return await res.json();
    } catch (e) {
      isMockMode = true;
      const user = mockUsers.find(u => u.employeeId === employeeId);
      if (user) {
        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
      }
      return user;
    }
  },

  // Audit logs
  async getLogs() {
    if (isMockMode) return mockLogs;
    try {
      const res = await fetch(`${API_URL}/logs/list`, {
        headers: getHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      isMockMode = true;
      return mockLogs;
    }
  },

  async addLog(user, module, action, details, status = 'Success', changeDetails = null) {
    const payload = {
      id: 'AUD-20260617-' + Math.floor(10000 + Math.random() * 90000),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user,
      module,
      action,
      details,
      status,
      changeField: changeDetails?.field || null,
      changeBefore: changeDetails?.before || null,
      changeAfter: changeDetails?.after || null,
      changeComment: changeDetails?.comment || null
    };
    if (isMockMode) {
      mockLogs.unshift(payload);
      return payload;
    }
    try {
      const res = await fetch(`${API_URL}/logs/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Create log failed.');
      return await res.json();
    } catch (e) {
      isMockMode = true;
      mockLogs.unshift(payload);
      return payload;
    }
  },

  // Reports & Analytics
  async getReportAnalytics({ loanType, range, branch } = {}) {
    if (isMockMode) {
      const total = mockCases.length;
      const personalCount = mockCases.filter(c => c.loanType === 'Personal Loan').length;
      const housingCount = mockCases.filter(c => c.loanType === 'Housing Loan').length;
      return {
        activeCases: total,
        totalOutstanding: mockCases.reduce((sum, c) => sum + c.outstandingBalance, 0),
        averageDpd: total === 0 ? 0 : Math.round(mockCases.reduce((sum, c) => sum + c.dpd, 0) / total),
        successRate: 85.2,
        loanTypeDistribution: [
          { label: 'Personal Loan', count: personalCount, percent: total === 0 ? 0 : Math.round((personalCount * 100.0 / total) * 10) / 10 },
          { label: 'Housing Loan', count: housingCount, percent: total === 0 ? 0 : Math.round((housingCount * 100.0 / total) * 10) / 10 }
        ],
        trend: [
          { month: 'Jan', count: 1 },
          { month: 'Feb', count: 2 },
          { month: 'Mar', count: 2 },
          { month: 'Apr', count: 3 },
          { month: 'May', count: total },
          { month: 'Jun', count: total }
        ]
      };
    }
    try {
      const params = new URLSearchParams();
      if (loanType) params.append('loanType', loanType);
      if (range) params.append('range', range);
      if (branch) params.append('branch', branch);
      const res = await fetch(`${API_URL}/reports/analytics?${params.toString()}`, {
        headers: getHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      isMockMode = true;
      return this.getReportAnalytics({ loanType, range, branch });
    }
  },

  async exportReport({ type, loanType, range } = {}) {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (loanType) params.append('loanType', loanType);
      if (range) params.append('range', range);

      const res = await fetch(`${API_URL}/reports/export?${params.toString()}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Report export failed.');

      const blob = await res.blob();
      const safeType = (type || 'Report').replace(/[^A-Za-z0-9]+/g, '_');
      const stamp = new Date().toISOString().slice(0, 10);
      const filename = `${safeType}_${stamp}.csv`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return { success: true, filename };
    } catch (e) {
      console.warn('Cannot connect to backend for CSV export. Creating local mock CSV.');
      const csvContent = "Case ID,Customer,Loan Type,Stage,Status\n" + mockCases.map(c => `${c.id},${c.customerName},${c.loanType},Stage ${c.stage},${c.status}`).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Mock_Report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return { success: true, filename: 'Mock_Report.csv' };
    }
  },

  // System parameters
  async getConfig() {
    if (isMockMode) return mockConfig;
    try {
      const res = await fetch(`${API_URL}/config`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      isMockMode = true;
      return mockConfig;
    }
  },

  async saveConfig(configMap) {
    if (isMockMode) {
      Object.assign(mockConfig, configMap);
      return { success: true, config: mockConfig };
    }
    try {
      const res = await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(configMap)
      });
      if (!res.ok) throw new Error('Save configuration failed.');
      return { success: true, config: await res.json() };
    } catch (e) {
      isMockMode = true;
      Object.assign(mockConfig, configMap);
      return { success: true, config: mockConfig };
    }
  }
};
