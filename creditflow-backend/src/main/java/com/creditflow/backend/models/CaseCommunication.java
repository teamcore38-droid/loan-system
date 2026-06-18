package com.creditflow.backend.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "case_communications")
public class CaseCommunication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    @JsonIgnore
    private RestructureCase restructureCase;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private String type;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String details;

    public CaseCommunication() {}

    public CaseCommunication(RestructureCase restructureCase, String date, String type, String details) {
        this.restructureCase = restructureCase;
        this.date = date;
        this.type = type;
        this.details = details;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public RestructureCase getRestructureCase() { return restructureCase; }
    public void setRestructureCase(RestructureCase restructureCase) { this.restructureCase = restructureCase; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
