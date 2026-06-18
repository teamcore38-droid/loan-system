package com.creditflow.backend.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "case_comments")
public class CaseComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    @JsonIgnore
    private RestructureCase restructureCase;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private String date;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    public CaseComment() {}

    public CaseComment(RestructureCase restructureCase, String author, String date, String text) {
        this.restructureCase = restructureCase;
        this.author = author;
        this.date = date;
        this.text = text;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public RestructureCase getRestructureCase() { return restructureCase; }
    public void setRestructureCase(RestructureCase restructureCase) { this.restructureCase = restructureCase; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
