-- Insert default users
-- Hashed password is BCrypt for 'password'
INSERT INTO users (username, password, name, role, employee_id, branch, status, permissions) VALUES
('admin', '$2a$10$d2F7uDLroGAdMKKWTTsw3eVxBS5uewzL0FJOkqNST.atiQKu0dVPO', 'Amali Dissanayake', 'Super Admin', 'EMP-0012', 'Colombo Main Branch', 'Active', 'Manage Users, Audit Access, System Settings'),
('remedial', '$2a$10$d2F7uDLroGAdMKKWTTsw3eVxBS5uewzL0FJOkqNST.atiQKu0dVPO', 'Kanchana Jayawardena', 'Remedial Officer', 'EMP-0042', 'Colombo Main Branch', 'Active', 'Create Cases, Upload Documents'),
('credit', '$2a$10$d2F7uDLroGAdMKKWTTsw3eVxBS5uewzL0FJOkqNST.atiQKu0dVPO', 'Ruwan Silva', 'Credit Officer', 'EMP-0038', 'Kandy Branch', 'Active', 'Approve Cases, Finalize Parameters'),
('sales', '$2a$10$d2F7uDLroGAdMKKWTTsw3eVxBS5uewzL0FJOkqNST.atiQKu0dVPO', 'Thilini Kumara', 'Sales Officer', 'EMP-0055', 'Gampaha Branch', 'Active', 'Capture Consent'),
('ccpu', '$2a$10$d2F7uDLroGAdMKKWTTsw3eVxBS5uewzL0FJOkqNST.atiQKu0dVPO', 'Mahesh Perera', 'CCPU User', 'EMP-0021', 'Colombo Main Branch', 'Active', 'Execute CBS Update'),
('risk', '$2a$10$d2F7uDLroGAdMKKWTTsw3eVxBS5uewzL0FJOkqNST.atiQKu0dVPO', 'Sanduni Bandara', 'Risk & Compliance', 'EMP-0061', 'Colombo Main Branch', 'Active', 'Audit Access, Generate Reports'),
('officer2', '$2a$10$d2F7uDLroGAdMKKWTTsw3eVxBS5uewzL0FJOkqNST.atiQKu0dVPO', 'Nirosha Fernando', 'Remedial Officer', 'EMP-0033', 'Matara Branch', 'Inactive', 'Create Cases'),
('sales2', '$2a$10$d2F7uDLroGAdMKKWTTsw3eVxBS5uewzL0FJOkqNST.atiQKu0dVPO', 'Chaminda Wickrama', 'Sales Officer', 'EMP-0047', 'Kurunegala Branch', 'Locked', 'Capture Consent');

-- Insert simulated core banking system loans
INSERT INTO loans (account_no, customer_id, customer_name, nic_number, contact_number, loan_type, current_emi, outstanding_balance, interest_rate, remaining_tenure, dpd) VALUES
('LA-2024-008912', 'CUST-00421', 'Nimal Perera', '198801245678V', '+94 77 123 4567', 'Personal Loan', 32450.0, 2840000.0, 14.5, 48, 45),
('LA-2024-007890', 'CUST-00210', 'Sunil Fernando', '197548962314V', '+94 71 456 7890', 'Housing Loan', 85000.0, 8500000.0, 12.0, 120, 102),
('LA-2024-009988', 'CUST-00654', 'Amara Wijesinghe', '198256123478V', '+94 72 789 0123', 'Housing Loan', 150000.0, 12000000.0, 15.0, 60, 78),
('LA-2024-006655', 'CUST-00991', 'Gayan Madushanka', '199145236789V', '+94 76 321 6549', 'Personal Loan', 45000.0, 1500000.0, 13.5, 36, 31),
('LA-2024-007200', 'CUST-00720', 'John Silva', '198001245678V', '+94 77 123 4567', 'Housing Loan', 72000.0, 6000000.0, 12.0, 120, 45);

-- Insert restructuring cases
INSERT INTO restructure_cases (id, customer_id, customer_name, nic_number, contact_number, loan_account_no, loan_type, current_emi, outstanding_balance, interest_rate, remaining_tenure, dpd, classification, proposed_emi, proposed_tenure, revised_interest_rate, stage, assigned_officer, status, creation_date, approval_recommendation, monitoring_activated, monitoring_period_days, monitoring_days_completed, monitoring_emi_status, monitoring_last_payment, monitoring_missed_payments, monitoring_compliance_status) VALUES
('CF-2025-0891', 'CUST-00421', 'Nimal Perera', '198801245678V', '+94 77 123 4567', 'LA-2024-008912', 'Personal Loan', 32450.0, 2840000.0, 14.5, 48, 45, 'Restructure (<90 Days)', 24000.0, 60, 12.5, 4, 'K. Jayawardena', 'Pending Approval', '2026-06-12', 'Based on DPD analysis and financial profile, this case qualifies for RESTRUCTURING under Policy Ref. CR-2024-04.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-0890', 'CUST-00210', 'Sunil Fernando', '197548962314V', '+94 71 456 7890', 'LA-2024-007890', 'Housing Loan', 85000.0, 8500000.0, 12.0, 120, 102, 'Reschedule (>90 Days)', 65000.0, 156, 11.5, 7, 'R. Silva', 'Monitoring Active', '2026-05-10', 'Customer DPD is 102. Under CBSL directives, account is rescheduled with a 120-day monitoring period.', TRUE, 120, 30, 'Up to Date', '10 Jun 2026', 0, 'Compliant'),
('CF-2025-0889', 'CUST-00654', 'Amara Wijesinghe', '198256123478V', '+94 72 789 0123', 'LA-2024-009988', 'Housing Loan', 150000.0, 12000000.0, 15.0, 60, 78, 'Restructure (<90 Days)', 110000.0, 84, 13.0, 2, 'T. Kumara', 'Under Review', '2026-06-15', '', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-0888', 'CUST-00991', 'Gayan Madushanka', '199145236789V', '+94 76 321 6549', 'LA-2024-006655', 'Personal Loan', 45000.0, 1500000.0, 13.5, 36, 31, 'Restructure (<90 Days)', 35000.0, 48, 12.0, 6, 'M. Perera', 'Approved', '2026-06-08', 'Personal loan restructure approved to match reduced transport contract income.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending');

-- Insert case documents
INSERT INTO case_documents (case_id, name, type, upload_date, verification) VALUES
('CF-2025-0891', 'Request_Letter.pdf', 'PDF', '12 Jun 2026', 'Verified'),
('CF-2025-0891', 'Salary_Slip_May.pdf', 'PDF', '12 Jun 2026', 'Verified'),
('CF-2025-0891', 'Salary_Slip_Apr.pdf', 'PDF', '12 Jun 2026', 'Verified'),
('CF-2025-0891', 'Employer_Conf.pdf', 'PDF', '12 Jun 2026', 'Verified'),
('CF-2025-0891', 'CRIB_Report.pdf', 'PDF', '12 Jun 2026', 'Pending'),
('CF-2025-0890', 'Request_Letter.pdf', 'PDF', '10 May 2026', 'Verified'),
('CF-2025-0890', 'CRIB_Report.pdf', 'PDF', '10 May 2026', 'Verified'),
('CF-2025-0890', 'Signed_Reschedule_Agreement.pdf', 'PDF', '18 May 2026', 'Verified'),
('CF-2025-0889', 'Request_Letter.pdf', 'PDF', '15 Jun 2026', 'Verified'),
('CF-2025-0888', 'Request_Letter.pdf', 'PDF', '08 Jun 2026', 'Verified'),
('CF-2025-0888', 'Salary_Slip.pdf', 'PDF', '08 Jun 2026', 'Verified'),
('CF-2025-0888', 'Signed_Restructure_App.pdf', 'PDF', '12 Jun 2026', 'Verified'),
('CF-2025-0888', 'Signed_Loan_Amendment.pdf', 'PDF', '12 Jun 2026', 'Verified');

-- Insert case comments
INSERT INTO case_comments (case_id, author, date, text) VALUES
('CF-2025-0890', 'Ruwan Silva', '2026-05-15', 'Approved based on core collateral values and repayment justification.'),
('CF-2025-0888', 'Ruwan Silva', '2026-06-10', 'Approve restructure, extend tenure by 12 months.');

-- Insert case communications
INSERT INTO case_communications (case_id, date, type, details) VALUES
('CF-2025-0891', '12 Jun 2026', 'System', 'Restructuring offer letter sent'),
('CF-2025-0891', '10 Jun 2026', 'SMS', 'EMI reminder SMS sent'),
('CF-2025-0891', '05 Jun 2026', 'In-person', 'In-person counseling session completed'),
('CF-2025-0891', '01 Jun 2026', 'Call', 'Initial case intake call'),
('CF-2025-0890', '10 Jun 2026', 'System', 'EMI payment of LKR 65,000 received on schedule'),
('CF-2025-0890', '25 May 2026', 'System', 'Rescheduling activated in CBS'),
('CF-2025-0890', '18 May 2026', 'Sales', 'Reschedule Agreement and Loan Amendment signed'),
('CF-2025-0889', '15 Jun 2026', 'Call', 'Customer requested business income verification call'),
('CF-2025-0888', '12 Jun 2026', 'Sales', 'Customer signed applications collected and uploaded'),
('CF-2025-0888', '10 Jun 2026', 'System', 'Approval notice sent to sales unit');

-- Insert audit logs
INSERT INTO audit_logs (id, timestamp, user, module, action, details, ip_address, status, change_field, change_before, change_after, change_comment) VALUES
('AUD-20260617-00101', '2026-06-17 11:42:05', 'K. Jayawardena', 'Cases', 'Case Updated', 'CF-2025-0891 status changed', '192.168.1.42', 'Success', 'Status', 'Under Review', 'Pending Approval', 'Uploaded supporting documents'),
('AUD-20260617-00102', '2026-06-17 11:38:14', 'Ruwan Silva', 'Approvals', 'Approval Granted', 'CF-2025-0888 approved', '192.168.1.18', 'Success', 'Stage', 'Credit Approval', 'Sales Consent', 'Recommended with +12m extension'),
('AUD-20260617-00103', '2026-06-17 11:15:03', 'Thilini Kumara', 'Documents', 'Doc Uploaded', 'Signed forms uploaded for CF-2025-0888', '192.168.1.55', 'Success', 'Documents', '2 documents', '4 documents', 'Restructure & Amendment signed'),
('AUD-20260617-00104', '2026-06-17 10:52:30', 'System', 'Monitoring', 'Auto Alert Sent', 'Compliance alert created for CF-0841', '—', 'Success', 'Missed Payment', '0', '1', 'System auto-recalculation'),
('AUD-20260617-00105', '2026-06-17 10:44:10', 'Mahesh Perera', 'Cases', 'Case Viewed', 'CF-2025-0888 accessed', '192.168.1.21', 'Success', NULL, NULL, NULL, NULL),
('AUD-20260617-00106', '2026-06-17 10:31:55', 'Unknown', 'Auth', 'Login Failed', '3 consecutive failures', '210.18.5.32', 'Failed', 'Login attempt', 'None', 'Locked', 'IP blocked for 30 minutes'),
('AUD-20260617-00107', '2026-06-17 09:58:47', 'Amali Dissanayake', 'Users', 'User Created', 'EMP-0079 account activated', '192.168.1.10', 'Success', 'User list', '23 users', '24 users', 'New Credit Processing Officer added'),
('AUD-20260617-00108', '2026-06-17 09:10:14', 'K. Jayawardena', 'Settings', 'Config Changed', 'Email alert threshold updated', '192.168.1.42', 'Warning', 'Notification offset', '5 days', '3 days', 'Approved by Remedial Head');

-- Insert dashboard tasks
INSERT INTO dashboard_tasks (role, text, done, case_id) VALUES
('Credit Officer', 'Approve CF-2025-0891 pending request', FALSE, 'CF-2025-0891'),
('Remedial Officer', 'Draft restructure recommendation memo for CF-2025-0889', FALSE, 'CF-2025-0889'),
('CCPU User', 'Sync CF-2025-0888 terms with CBS', FALSE, 'CF-2025-0888');

-- Insert dashboard notifications
INSERT INTO dashboard_notifications (role, message, type, case_id) VALUES
('Credit Officer', 'Case CF-2025-0891 requires credit evaluation', 'info', 'CF-2025-0891'),
('Risk & Compliance', 'CF-2025-0890 monitoring activated', 'info', 'CF-2025-0890'),
('CCPU User', 'CF-2025-0888 ready for execution in CBS', 'info', 'CF-2025-0888');

-- Default system parameters
INSERT INTO system_config (config_key, config_value) VALUES
('dpdCutoff', '90'),
('aiConfidenceThreshold', '80');


-- Additional 20 core banking system loans
INSERT INTO loans (account_no, customer_id, customer_name, nic_number, contact_number, loan_type, current_emi, outstanding_balance, interest_rate, remaining_tenure, dpd) VALUES
('LA-2024-001001', 'CUST-01001', 'K. L. Rahal Cooray', '198522304912V', '+94 77 220 1199', 'Personal Loan', 25000.0, 1200000.0, 14.0, 36, 45),
('LA-2024-001002', 'CUST-01002', 'Dilani Wickramasinghe', '199065403211V', '+94 71 889 0022', 'Housing Loan', 90000.0, 8000000.0, 11.5, 144, 92),
('LA-2024-001003', 'CUST-01003', 'Tharindu Jayasekara', '198211204859V', '+94 76 443 1122', 'Personal Loan', 45000.0, 3000000.0, 15.0, 48, 62),
('LA-2024-001004', 'CUST-01004', 'Priyantha Herath', '197808904561V', '+94 72 990 8877', 'Housing Loan', 120000.0, 11000000.0, 12.0, 120, 105),
('LA-2024-001005', 'CUST-01005', 'Nilanthi Rajapakse', '198455601248V', '+94 77 334 5566', 'Personal Loan', 18000.0, 800000.0, 14.5, 24, 32),
('LA-2024-001006', 'CUST-01006', 'Ruwan Fernando', '198912408933V', '+94 71 556 7788', 'Housing Loan', 65000.0, 5500000.0, 11.0, 96, 42),
('LA-2024-001007', 'CUST-01007', 'Anura Kumara Senanayake', '197022301149V', '+94 76 990 1122', 'Personal Loan', 50000.0, 4000000.0, 15.5, 60, 95),
('LA-2024-001008', 'CUST-01008', 'Harshani Gunawardena', '199277801244V', '+94 77 889 2233', 'Housing Loan', 80000.0, 7000000.0, 11.8, 180, 38),
('LA-2024-001009', 'CUST-01009', 'Manjula Peiris', '198009204481V', '+94 71 332 4455', 'Personal Loan', 30000.0, 1500000.0, 14.2, 36, 58),
('LA-2024-001010', 'CUST-01010', 'Shalika Gunasekara', '198755409988V', '+94 76 112 3344', 'Housing Loan', 110000.0, 9500000.0, 12.2, 144, 112),
('LA-2024-001011', 'CUST-01011', 'Buddhika Ratnayake', '198612903342V', '+94 77 667 8899', 'Personal Loan', 28000.0, 1800000.0, 14.8, 48, 41),
('LA-2024-001012', 'CUST-01012', 'Sanduni Alwis', '199388701239V', '+94 71 998 0011', 'Housing Loan', 75000.0, 6500000.0, 11.2, 120, 84),
('LA-2024-001013', 'CUST-01013', 'Kasun Jayawardena', '199102403259V', '+94 76 887 9900', 'Personal Loan', 35000.0, 2200000.0, 15.0, 36, 47),
('LA-2024-001014', 'CUST-01014', 'Duminda Silva', '197734901248V', '+94 72 334 9988', 'Housing Loan', 130000.0, 12000000.0, 12.5, 180, 108),
('LA-2024-001015', 'CUST-01015', 'Oshadi Fernando', '199566708891V', '+94 77 443 6677', 'Personal Loan', 15000.0, 600000.0, 14.0, 24, 35),
('LA-2024-001016', 'CUST-01016', 'Isuru Perera', '198829402219V', '+94 71 667 9988', 'Housing Loan', 95000.0, 8500000.0, 11.9, 144, 76),
('LA-2024-001017', 'CUST-01017', 'Chathurika Jayasinghe', '198356701149V', '+94 76 554 8877', 'Personal Loan', 40000.0, 2500000.0, 15.2, 48, 52),
('LA-2024-001018', 'CUST-01018', 'Nalin de Silva', '197412304899V', '+94 77 112 0099', 'Housing Loan', 140000.0, 13000000.0, 12.8, 168, 115),
('LA-2024-001019', 'CUST-01019', 'Hansani Wijewardene', '199467803321V', '+94 71 889 4433', 'Personal Loan', 22000.0, 1100000.0, 14.5, 36, 43),
('LA-2024-001020', 'CUST-01020', 'Samantha Dissanayake', '197902409981V', '+94 76 998 1133', 'Housing Loan', 105000.0, 9000000.0, 12.1, 120, 98);

-- Additional 20 restructuring cases
INSERT INTO restructure_cases (id, customer_id, customer_name, nic_number, contact_number, loan_account_no, loan_type, current_emi, outstanding_balance, interest_rate, remaining_tenure, dpd, classification, proposed_emi, proposed_tenure, revised_interest_rate, stage, assigned_officer, status, creation_date, approval_recommendation, monitoring_activated, monitoring_period_days, monitoring_days_completed, monitoring_emi_status, monitoring_last_payment, monitoring_missed_payments, monitoring_compliance_status) VALUES
('CF-2025-1001', 'CUST-01001', 'K. L. Rahal Cooray', '198522304912V', '+94 77 220 1199', 'LA-2024-001001', 'Personal Loan', 25000.0, 1200000.0, 14.0, 36, 45, 'Restructure (<90 Days)', 18750, 48, 12.0, 1, 'K. Jayawardena', 'Under Review', '2026-06-10', 'Recommended parameters set matching restructured repayment profile for customer K. L. Rahal Cooray.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1002', 'CUST-01002', 'Dilani Wickramasinghe', '199065403211V', '+94 71 889 0022', 'LA-2024-001002', 'Housing Loan', 90000.0, 8000000.0, 11.5, 144, 92, 'Reschedule (>90 Days)', 67500, 180, 9.5, 2, 'Ruwan Silva', 'Under Review', '2026-06-11', 'Recommended parameters set matching restructured repayment profile for customer Dilani Wickramasinghe.', FALSE, 120, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1003', 'CUST-01003', 'Tharindu Jayasekara', '198211204859V', '+94 76 443 1122', 'LA-2024-001003', 'Personal Loan', 45000.0, 3000000.0, 15.0, 48, 62, 'Restructure (<90 Days)', 33750, 60, 13.0, 3, 'Thilini Kumara', 'Under Review', '2026-06-12', 'Recommended parameters set matching restructured repayment profile for customer Tharindu Jayasekara.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1004', 'CUST-01004', 'Priyantha Herath', '197808904561V', '+94 72 990 8877', 'LA-2024-001004', 'Housing Loan', 120000.0, 11000000.0, 12.0, 120, 105, 'Reschedule (>90 Days)', 90000, 156, 10.0, 4, 'Mahesh Perera', 'Pending Approval', '2026-06-13', 'Recommended parameters set matching restructured repayment profile for customer Priyantha Herath.', FALSE, 120, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1005', 'CUST-01005', 'Nilanthi Rajapakse', '198455601248V', '+94 77 334 5566', 'LA-2024-001005', 'Personal Loan', 18000.0, 800000.0, 14.5, 24, 32, 'Restructure (<90 Days)', 13500, 36, 12.5, 5, 'Nirosha Fernando', 'Under Review', '2026-06-14', 'Recommended parameters set matching restructured repayment profile for customer Nilanthi Rajapakse.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1006', 'CUST-01006', 'Ruwan Fernando', '198912408933V', '+94 71 556 7788', 'LA-2024-001006', 'Housing Loan', 65000.0, 5500000.0, 11.0, 96, 42, 'Restructure (<90 Days)', 48750, 108, 9.0, 6, 'K. Jayawardena', 'Approved', '2026-06-15', 'Recommended parameters set matching restructured repayment profile for customer Ruwan Fernando.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1007', 'CUST-01007', 'Anura Kumara Senanayake', '197022301149V', '+94 76 990 1122', 'LA-2024-001007', 'Personal Loan', 50000.0, 4000000.0, 15.5, 60, 95, 'Reschedule (>90 Days)', 37500, 96, 13.5, 7, 'Ruwan Silva', 'Monitoring Active', '2026-06-16', 'Recommended parameters set matching restructured repayment profile for customer Anura Kumara Senanayake.', TRUE, 120, 15, 'Up to Date', '10 Jun 2026', 0, 'Compliant'),
('CF-2025-1008', 'CUST-01008', 'Harshani Gunawardena', '199277801244V', '+94 77 889 2233', 'LA-2024-001008', 'Housing Loan', 80000.0, 7000000.0, 11.8, 180, 38, 'Restructure (<90 Days)', 60000, 192, 9.8, 1, 'Thilini Kumara', 'Under Review', '2026-06-17', 'Recommended parameters set matching restructured repayment profile for customer Harshani Gunawardena.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1009', 'CUST-01009', 'Manjula Peiris', '198009204481V', '+94 71 332 4455', 'LA-2024-001009', 'Personal Loan', 30000.0, 1500000.0, 14.2, 36, 58, 'Restructure (<90 Days)', 22500, 48, 12.2, 2, 'Mahesh Perera', 'Under Review', '2026-06-18', 'Recommended parameters set matching restructured repayment profile for customer Manjula Peiris.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1010', 'CUST-01010', 'Shalika Gunasekara', '198755409988V', '+94 76 112 3344', 'LA-2024-001010', 'Housing Loan', 110000.0, 9500000.0, 12.2, 144, 112, 'Reschedule (>90 Days)', 82500, 180, 10.2, 3, 'Nirosha Fernando', 'Under Review', '2026-06-19', 'Recommended parameters set matching restructured repayment profile for customer Shalika Gunasekara.', FALSE, 120, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1011', 'CUST-01011', 'Buddhika Ratnayake', '198612903342V', '+94 77 667 8899', 'LA-2024-001011', 'Personal Loan', 28000.0, 1800000.0, 14.8, 48, 41, 'Restructure (<90 Days)', 21000, 60, 12.8, 4, 'K. Jayawardena', 'Pending Approval', '2026-06-20', 'Recommended parameters set matching restructured repayment profile for customer Buddhika Ratnayake.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1012', 'CUST-01012', 'Sanduni Alwis', '199388701239V', '+94 71 998 0011', 'LA-2024-001012', 'Housing Loan', 75000.0, 6500000.0, 11.2, 120, 84, 'Restructure (<90 Days)', 56250, 132, 9.2, 5, 'Ruwan Silva', 'Under Review', '2026-06-21', 'Recommended parameters set matching restructured repayment profile for customer Sanduni Alwis.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1013', 'CUST-01013', 'Kasun Jayawardena', '199102403259V', '+94 76 887 9900', 'LA-2024-001013', 'Personal Loan', 35000.0, 2200000.0, 15.0, 36, 47, 'Restructure (<90 Days)', 26250, 48, 13.0, 6, 'Thilini Kumara', 'Approved', '2026-06-22', 'Recommended parameters set matching restructured repayment profile for customer Kasun Jayawardena.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1014', 'CUST-01014', 'Duminda Silva', '197734901248V', '+94 72 334 9988', 'LA-2024-001014', 'Housing Loan', 130000.0, 12000000.0, 12.5, 180, 108, 'Reschedule (>90 Days)', 97500, 216, 10.5, 7, 'Mahesh Perera', 'Monitoring Active', '2026-06-23', 'Recommended parameters set matching restructured repayment profile for customer Duminda Silva.', TRUE, 120, 15, 'Up to Date', '10 Jun 2026', 0, 'Compliant'),
('CF-2025-1015', 'CUST-01015', 'Oshadi Fernando', '199566708891V', '+94 77 443 6677', 'LA-2024-001015', 'Personal Loan', 15000.0, 600000.0, 14.0, 24, 35, 'Restructure (<90 Days)', 11250, 36, 12.0, 1, 'Nirosha Fernando', 'Under Review', '2026-06-24', 'Recommended parameters set matching restructured repayment profile for customer Oshadi Fernando.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1016', 'CUST-01016', 'Isuru Perera', '198829402219V', '+94 71 667 9988', 'LA-2024-001016', 'Housing Loan', 95000.0, 8500000.0, 11.9, 144, 76, 'Restructure (<90 Days)', 71250, 156, 9.9, 2, 'K. Jayawardena', 'Under Review', '2026-06-25', 'Recommended parameters set matching restructured repayment profile for customer Isuru Perera.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1017', 'CUST-01017', 'Chathurika Jayasinghe', '198356701149V', '+94 76 554 8877', 'LA-2024-001017', 'Personal Loan', 40000.0, 2500000.0, 15.2, 48, 52, 'Restructure (<90 Days)', 30000, 60, 13.2, 3, 'Ruwan Silva', 'Under Review', '2026-06-26', 'Recommended parameters set matching restructured repayment profile for customer Chathurika Jayasinghe.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1018', 'CUST-01018', 'Nalin de Silva', '197412304899V', '+94 77 112 0099', 'LA-2024-001018', 'Housing Loan', 140000.0, 13000000.0, 12.8, 168, 115, 'Reschedule (>90 Days)', 105000, 204, 10.8, 4, 'Thilini Kumara', 'Pending Approval', '2026-06-27', 'Recommended parameters set matching restructured repayment profile for customer Nalin de Silva.', FALSE, 120, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1019', 'CUST-01019', 'Hansani Wijewardene', '199467803321V', '+94 71 889 4433', 'LA-2024-001019', 'Personal Loan', 22000.0, 1100000.0, 14.5, 36, 43, 'Restructure (<90 Days)', 16500, 48, 12.5, 5, 'Mahesh Perera', 'Under Review', '2026-06-28', 'Recommended parameters set matching restructured repayment profile for customer Hansani Wijewardene.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-1020', 'CUST-01020', 'Samantha Dissanayake', '197902409981V', '+94 76 998 1133', 'LA-2024-001020', 'Housing Loan', 105000.0, 9000000.0, 12.1, 120, 98, 'Reschedule (>90 Days)', 78750, 156, 10.1, 6, 'Nirosha Fernando', 'Approved', '2026-06-29', 'Recommended parameters set matching restructured repayment profile for customer Samantha Dissanayake.', FALSE, 120, 0, 'Pending Activation', 'N/A', 0, 'Pending');
