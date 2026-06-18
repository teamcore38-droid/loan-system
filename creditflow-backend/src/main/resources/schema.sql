-- Database schema for CreditFlow

DROP TABLE IF EXISTS system_config;
DROP TABLE IF EXISTS case_communications;
DROP TABLE IF EXISTS case_comments;
DROP TABLE IF EXISTS case_documents;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS dashboard_tasks;
DROP TABLE IF EXISTS dashboard_notifications;
DROP TABLE IF EXISTS restructure_cases;
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    branch VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    permissions TEXT
);

CREATE TABLE loans (
    account_no VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    nic_number VARCHAR(30) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    loan_type VARCHAR(50) NOT NULL,
    current_emi DOUBLE NOT NULL,
    outstanding_balance DOUBLE NOT NULL,
    interest_rate DOUBLE NOT NULL,
    remaining_tenure INT NOT NULL,
    dpd INT NOT NULL
);

CREATE TABLE restructure_cases (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    nic_number VARCHAR(30) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    loan_account_no VARCHAR(50) NOT NULL,
    loan_type VARCHAR(50) NOT NULL,
    current_emi DOUBLE NOT NULL,
    outstanding_balance DOUBLE NOT NULL,
    interest_rate DOUBLE NOT NULL,
    remaining_tenure INT NOT NULL,
    dpd INT NOT NULL,
    classification VARCHAR(50) NOT NULL,
    proposed_emi DOUBLE NOT NULL,
    proposed_tenure INT NOT NULL,
    revised_interest_rate DOUBLE NOT NULL,
    stage INT NOT NULL,
    assigned_officer VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    creation_date VARCHAR(20) NOT NULL,
    approval_recommendation TEXT,
    monitoring_activated BOOLEAN DEFAULT FALSE,
    monitoring_period_days INT NOT NULL,
    monitoring_days_completed INT NOT NULL,
    monitoring_emi_status VARCHAR(50),
    monitoring_last_payment VARCHAR(50),
    monitoring_missed_payments INT DEFAULT 0,
    monitoring_compliance_status VARCHAR(50)
);

CREATE TABLE case_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    upload_date VARCHAR(20) NOT NULL,
    verification VARCHAR(50) NOT NULL,
    FOREIGN KEY (case_id) REFERENCES restructure_cases(id) ON DELETE CASCADE
);

CREATE TABLE case_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL,
    author VARCHAR(100) NOT NULL,
    date VARCHAR(20) NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (case_id) REFERENCES restructure_cases(id) ON DELETE CASCADE
);

CREATE TABLE case_communications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL,
    date VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    FOREIGN KEY (case_id) REFERENCES restructure_cases(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    timestamp VARCHAR(30) NOT NULL,
    user VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    change_field VARCHAR(50),
    change_before TEXT,
    change_after TEXT,
    change_comment TEXT
);

CREATE TABLE dashboard_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    text VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    case_id VARCHAR(50),
    FOREIGN KEY (case_id) REFERENCES restructure_cases(id) ON DELETE CASCADE
);

CREATE TABLE dashboard_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    message VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    case_id VARCHAR(50),
    FOREIGN KEY (case_id) REFERENCES restructure_cases(id) ON DELETE CASCADE
);

CREATE TABLE system_config (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value VARCHAR(255) NOT NULL
);
