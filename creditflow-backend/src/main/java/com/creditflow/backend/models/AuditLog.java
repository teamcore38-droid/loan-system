package com.creditflow.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    private String id;

    @Column(nullable = false)
    private String timestamp;

    @Column(nullable = false)
    private String user;

    @Column(nullable = false)
    private String module;

    @Column(nullable = false)
    private String action;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String details;

    @Column(name = "ip_address", nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private String status;

    @Column(name = "change_field")
    private String changeField;

    @Column(name = "change_before", columnDefinition = "TEXT")
    private String changeBefore;

    @Column(name = "change_after", columnDefinition = "TEXT")
    private String changeAfter;

    @Column(name = "change_comment", columnDefinition = "TEXT")
    private String changeComment;

    public AuditLog() {}

    public AuditLog(String id, String timestamp, String user, String module, String action, String details, String ipAddress, String status, String changeField, String changeBefore, String changeAfter, String changeComment) {
        this.id = id;
        this.timestamp = timestamp;
        this.user = user;
        this.module = module;
        this.action = action;
        this.details = details;
        this.ipAddress = ipAddress;
        this.status = status;
        this.changeField = changeField;
        this.changeBefore = changeBefore;
        this.changeAfter = changeAfter;
        this.changeComment = changeComment;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }
    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getChangeField() { return changeField; }
    public void setChangeField(String changeField) { this.changeField = changeField; }
    public String getChangeBefore() { return changeBefore; }
    public void setChangeBefore(String changeBefore) { this.changeBefore = changeBefore; }
    public String getChangeAfter() { return changeAfter; }
    public void setChangeAfter(String changeAfter) { this.changeAfter = changeAfter; }
    public String getChangeComment() { return changeComment; }
    public void setChangeComment(String changeComment) { this.changeComment = changeComment; }
}
