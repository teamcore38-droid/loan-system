package com.creditflow.backend.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restructure_cases")
public class RestructureCase {
    @Id
    private String id;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "nic_number", nullable = false)
    private String nicNumber;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "loan_account_no", nullable = false)
    private String loanAccountNo;

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

    @Column(nullable = false)
    private String classification;

    @Column(name = "proposed_emi", nullable = false)
    private Double proposedEMI;

    @Column(name = "proposed_tenure", nullable = false)
    private Integer proposedTenure;

    @Column(name = "revised_interest_rate", nullable = false)
    private Double revisedInterestRate;

    @Column(nullable = false)
    private Integer stage;

    @Column(name = "assigned_officer", nullable = false)
    private String assignedOfficer;

    @Column(nullable = false)
    private String status;

    @Column(name = "creation_date", nullable = false)
    private String creationDate;

    @Column(name = "approval_recommendation", columnDefinition = "TEXT")
    private String approvalRecommendation;

    // Monitoring columns mapped directly
    @Column(name = "monitoring_activated")
    private Boolean monitoringActivated = false;

    @Column(name = "monitoring_period_days")
    private Integer monitoringPeriodDays = 90;

    @Column(name = "monitoring_days_completed")
    private Integer monitoringDaysCompleted = 0;

    @Column(name = "monitoring_emi_status")
    private String monitoringEmiStatus = "Pending";

    @Column(name = "monitoring_last_payment")
    private String monitoringLastPayment = "N/A";

    @Column(name = "monitoring_missed_payments")
    private Integer monitoringMissedPayments = 0;

    @Column(name = "monitoring_compliance_status")
    private String monitoringComplianceStatus = "Pending";

    // Related collections
    @OneToMany(mappedBy = "restructureCase", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CaseDocument> documents = new ArrayList<>();

    @OneToMany(mappedBy = "restructureCase", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CaseComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "restructureCase", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CaseCommunication> communications = new ArrayList<>();

    public RestructureCase() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getNicNumber() { return nicNumber; }
    public void setNicNumber(String nicNumber) { this.nicNumber = nicNumber; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getLoanAccountNo() { return loanAccountNo; }
    public void setLoanAccountNo(String loanAccountNo) { this.loanAccountNo = loanAccountNo; }
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
    public String getClassification() { return classification; }
    public void setClassification(String classification) { this.classification = classification; }
    public Double getProposedEMI() { return proposedEMI; }
    public void setProposedEMI(Double proposedEMI) { this.proposedEMI = proposedEMI; }
    public Integer getProposedTenure() { return proposedTenure; }
    public void setProposedTenure(Integer proposedTenure) { this.proposedTenure = proposedTenure; }
    public Double getRevisedInterestRate() { return revisedInterestRate; }
    public void setRevisedInterestRate(Double revisedInterestRate) { this.revisedInterestRate = revisedInterestRate; }
    public Integer getStage() { return stage; }
    public void setStage(Integer stage) { this.stage = stage; }
    public String getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(String assignedOfficer) { this.assignedOfficer = assignedOfficer; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCreationDate() { return creationDate; }
    public void setCreationDate(String creationDate) { this.creationDate = creationDate; }
    public String getApprovalRecommendation() { return approvalRecommendation; }
    public void setApprovalRecommendation(String approvalRecommendation) { this.approvalRecommendation = approvalRecommendation; }
    public Boolean getMonitoringActivated() { return monitoringActivated; }
    public void setMonitoringActivated(Boolean monitoringActivated) { this.monitoringActivated = monitoringActivated; }
    public Integer getMonitoringPeriodDays() { return monitoringPeriodDays; }
    public void setMonitoringPeriodDays(Integer monitoringPeriodDays) { this.monitoringPeriodDays = monitoringPeriodDays; }
    public Integer getMonitoringDaysCompleted() { return monitoringDaysCompleted; }
    public void setMonitoringDaysCompleted(Integer monitoringDaysCompleted) { this.monitoringDaysCompleted = monitoringDaysCompleted; }
    public String getMonitoringEmiStatus() { return monitoringEmiStatus; }
    public void setMonitoringEmiStatus(String monitoringEmiStatus) { this.monitoringEmiStatus = monitoringEmiStatus; }
    public String getMonitoringLastPayment() { return monitoringLastPayment; }
    public void setMonitoringLastPayment(String monitoringLastPayment) { this.monitoringLastPayment = monitoringLastPayment; }
    public Integer getMonitoringMissedPayments() { return monitoringMissedPayments; }
    public void setMonitoringMissedPayments(Integer monitoringMissedPayments) { this.monitoringMissedPayments = monitoringMissedPayments; }
    public String getMonitoringComplianceStatus() { return monitoringComplianceStatus; }
    public void setMonitoringComplianceStatus(String monitoringComplianceStatus) { this.monitoringComplianceStatus = monitoringComplianceStatus; }
    public List<CaseDocument> getDocuments() { return documents; }
    public void setDocuments(List<CaseDocument> documents) { this.documents = documents; }
    public List<CaseComment> getComments() { return comments; }
    public void setComments(List<CaseComment> comments) { this.comments = comments; }
    public List<CaseCommunication> getCommunications() { return communications; }
    public void setCommunications(List<CaseCommunication> communications) { this.communications = communications; }
}
