package com.creditflow.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "loans")
public class Loan {
    @Id
    @Column(name = "account_no")
    private String accountNo;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "nic_number", nullable = false)
    private String nicNumber;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "loan_type", nullable = false)
    private String loanType;

    @Column(name = "current_emi", nullable = false)
    private Double currentEMI;

    @Column(name = "outstanding_balance", nullable = false)
    private Double outstandingBalance;

    @Column(name = "interest_rate", nullable = false)
    private Double interestRate;

    @Column(name = "remaining_tenure", nullable = false)
    private Integer remainingTenure;

    @Column(nullable = false)
    private Integer dpd;

    public Loan() {}

    // Getters and Setters
    public String getAccountNo() { return accountNo; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getNicNumber() { return nicNumber; }
    public void setNicNumber(String nicNumber) { this.nicNumber = nicNumber; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }
    public Double getCurrentEMI() { return currentEMI; }
    public void setCurrentEMI(Double currentEMI) { this.currentEMI = currentEMI; }
    public Double getOutstandingBalance() { return outstandingBalance; }
    public void setOutstandingBalance(Double outstandingBalance) { this.outstandingBalance = outstandingBalance; }
    public Double getInterestRate() { return interestRate; }
    public void setInterestRate(Double interestRate) { this.interestRate = interestRate; }
    public Integer getRemainingTenure() { return remainingTenure; }
    public void setRemainingTenure(Integer remainingTenure) { this.remainingTenure = remainingTenure; }
    public Integer getDpd() { return dpd; }
    public void setDpd(Integer dpd) { this.dpd = dpd; }
}
