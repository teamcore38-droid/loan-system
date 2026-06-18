package com.creditflow.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role;

    @Column(name = "employee_id", unique = true, nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String branch;

    @Column(nullable = false)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String permissions;

    public User() {}

    public User(String username, String password, String name, String role, String employeeId, String branch, String status, String permissions) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.role = role;
        this.employeeId = employeeId;
        this.branch = branch;
        this.status = status;
        this.permissions = permissions;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPermissions() { return permissions; }
    public void setPermissions(String permissions) { this.permissions = permissions; }
}
