package com.creditflow.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "dashboard_notifications")
public class DashboardNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String type; // e.g. "info", "warning", "success", "danger"

    @Column(name = "case_id")
    private String caseId;

    public DashboardNotification() {}

    public DashboardNotification(String role, String message, String type, String caseId) {
        this.role = role;
        this.message = message;
        this.type = type;
        this.caseId = caseId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }
}
