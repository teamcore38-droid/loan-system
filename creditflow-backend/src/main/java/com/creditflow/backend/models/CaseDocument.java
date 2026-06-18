package com.creditflow.backend.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "case_documents")
public class CaseDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    @JsonIgnore
    private RestructureCase restructureCase;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(name = "upload_date", nullable = false)
    private String uploadDate;

    @Column(nullable = false)
    private String verification;

    public CaseDocument() {}

    public CaseDocument(RestructureCase restructureCase, String name, String type, String uploadDate, String verification) {
        this.restructureCase = restructureCase;
        this.name = name;
        this.type = type;
        this.uploadDate = uploadDate;
        this.verification = verification;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public RestructureCase getRestructureCase() { return restructureCase; }
    public void setRestructureCase(RestructureCase restructureCase) { this.restructureCase = restructureCase; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getUploadDate() { return uploadDate; }
    public void setUploadDate(String uploadDate) { this.uploadDate = uploadDate; }
    public String getVerification() { return verification; }
    public void setVerification(String verification) { this.verification = verification; }
}
