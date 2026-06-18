package com.creditflow.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "dashboard_tasks")
public class DashboardTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private boolean done = false;

    @Column(name = "case_id")
    private String caseId;

    public DashboardTask() {}

    public DashboardTask(String role, String text, boolean done, String caseId) {
        this.role = role;
        this.text = text;
        this.done = done;
        this.caseId = caseId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }
    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }
}
