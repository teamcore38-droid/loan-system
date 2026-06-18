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
('LA-2024-007890', 'CUST-00210', 'Sunil Fernando', '197548962314V', '+94 71 456 7890', 'Home Loan', 85000.0, 8500000.0, 12.0, 120, 102),
('LA-2024-009988', 'CUST-00654', 'Amara Wijesinghe', '198256123478V', '+94 72 789 0123', 'SME Loan', 150000.0, 12000000.0, 15.0, 60, 78),
('LA-2024-006655', 'CUST-00991', 'Gayan Madushanka', '199145236789V', '+94 76 321 6549', 'Vehicle Loan', 45000.0, 1500000.0, 13.5, 36, 31),
('LA-2024-007200', 'CUST-00720', 'John Silva', '198001245678V', '+94 77 123 4567', 'Housing Loan', 72000.0, 6000000.0, 12.0, 120, 45);

-- Insert restructuring cases
INSERT INTO restructure_cases (id, customer_id, customer_name, nic_number, contact_number, loan_account_no, loan_type, current_emi, outstanding_balance, interest_rate, remaining_tenure, dpd, classification, proposed_emi, proposed_tenure, revised_interest_rate, stage, assigned_officer, status, creation_date, approval_recommendation, monitoring_activated, monitoring_period_days, monitoring_days_completed, monitoring_emi_status, monitoring_last_payment, monitoring_missed_payments, monitoring_compliance_status) VALUES
('CF-2025-0891', 'CUST-00421', 'Nimal Perera', '198801245678V', '+94 77 123 4567', 'LA-2024-008912', 'Personal Loan', 32450.0, 2840000.0, 14.5, 48, 45, 'Restructure (<90 Days)', 24000.0, 60, 12.5, 4, 'K. Jayawardena', 'Pending Approval', '2026-06-12', 'Based on DPD analysis and financial profile, this case qualifies for RESTRUCTURING under Policy Ref. CR-2024-04.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-0890', 'CUST-00210', 'Sunil Fernando', '197548962314V', '+94 71 456 7890', 'LA-2024-007890', 'Home Loan', 85000.0, 8500000.0, 12.0, 120, 102, 'Reschedule (>90 Days)', 65000.0, 156, 11.5, 7, 'R. Silva', 'Monitoring Active', '2026-05-10', 'Customer DPD is 102. Under CBSL directives, account is rescheduled with a 120-day monitoring period.', TRUE, 120, 30, 'Up to Date', '10 Jun 2026', 0, 'Compliant'),
('CF-2025-0889', 'CUST-00654', 'Amara Wijesinghe', '198256123478V', '+94 72 789 0123', 'LA-2024-009988', 'SME Loan', 150000.0, 12000000.0, 15.0, 60, 78, 'Restructure (<90 Days)', 110000.0, 84, 13.0, 2, 'T. Kumara', 'Under Review', '2026-06-15', '', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending'),
('CF-2025-0888', 'CUST-00991', 'Gayan Madushanka', '199145236789V', '+94 76 321 6549', 'LA-2024-006655', 'Vehicle Loan', 45000.0, 1500000.0, 13.5, 36, 31, 'Restructure (<90 Days)', 35000.0, 48, 12.0, 6, 'M. Perera', 'Approved', '2026-06-08', 'Vehicle loan restructure approved to match reduced transport contract income.', FALSE, 90, 0, 'Pending Activation', 'N/A', 0, 'Pending');

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
