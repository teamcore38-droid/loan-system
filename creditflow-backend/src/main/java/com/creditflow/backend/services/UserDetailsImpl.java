package com.creditflow.backend.services;

import com.creditflow.backend.models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class UserDetailsImpl implements UserDetails {
    private Long id;
    private String username;
    private String name;
    private String role;
    private String employeeId;
    private String branch;
    private String status;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String username, String name, String role, String employeeId, String branch, String status, String password,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.role = role;
        this.employeeId = employeeId;
        this.branch = branch;
        this.status = status;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(User user) {
        // Map roles. Prepend "ROLE_" to make it a standard Spring Security authority
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase().replace(" ", "_"));

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getRole(),
                user.getEmployeeId(),
                user.getBranch(),
                user.getStatus(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getEmployeeId() { return employeeId; }
    public String getBranch() { return branch; }
    public String getStatus() { return status; }

    @Override
    public String getPassword() { return password; }
    @Override
    public String getUsername() { return username; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return !"Locked".equals(status); }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return "Active".equals(status); }
}
