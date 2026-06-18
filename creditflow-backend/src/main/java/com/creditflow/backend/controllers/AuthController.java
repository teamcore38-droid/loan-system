package com.creditflow.backend.controllers;

import com.creditflow.backend.jwt.JwtUtils;
import com.creditflow.backend.models.User;
import com.creditflow.backend.repositories.UserRepository;
import com.creditflow.backend.services.AuditService;
import com.creditflow.backend.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuditService auditService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        String role = loginRequest.get("role");

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            auditService.record(username, "Auth", "Login Failed",
                    "Failed login attempt for unknown username: " + username, "Failed",
                    null, null, null, null);
            Map<String, String> err = new HashMap<>();
            err.put("error", "Invalid username or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        if ("Locked".equals(user.getStatus())) {
            auditService.record(user.getName(), "Auth", "Login Failed",
                    user.getName() + " attempted login on a locked account", "Warning",
                    null, null, null, null);
            Map<String, String> err = new HashMap<>();
            err.put("error", "Account is locked. Contact Super Admin.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
        }

        if ("Inactive".equals(user.getStatus())) {
            auditService.record(user.getName(), "Auth", "Login Failed",
                    user.getName() + " attempted login on an inactive account", "Warning",
                    null, null, null, null);
            Map<String, String> err = new HashMap<>();
            err.put("error", "Account is inactive.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
        }

        if (!user.getRole().equals(role)) {
            auditService.record(user.getName(), "Auth", "Login Failed",
                    user.getName() + " attempted login under wrong role: " + role, "Failed",
                    null, null, null, null);
            Map<String, String> err = new HashMap<>();
            err.put("error", "User is not registered under role: " + role);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
        }

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));
        } catch (org.springframework.security.core.AuthenticationException ex) {
            auditService.record(user.getName(), "Auth", "Login Failed",
                    "Invalid password for " + user.getName(), "Failed",
                    null, null, null, null);
            Map<String, String> err = new HashMap<>();
            err.put("error", "Invalid username or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("id", userDetails.getId());
        response.put("username", userDetails.getUsername());
        response.put("name", userDetails.getName());
        response.put("role", userDetails.getRole());
        response.put("employeeId", userDetails.getEmployeeId());
        response.put("branch", userDetails.getBranch());
        response.put("status", userDetails.getStatus());
        response.put("permissions", user.getPermissions());

        // Actor resolves from the freshly authenticated principal in the security context.
        auditService.record("Auth", "Login Success",
                userDetails.getName() + " logged in as " + role, "Success");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> signUpRequest) {
        String username = signUpRequest.get("username");
        if (userRepository.findByUsername(username).isPresent()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Username already registered.");
            return ResponseEntity.badRequest().body(err);
        }

        User user = new User(
                username,
                encoder.encode(signUpRequest.get("password")),
                signUpRequest.get("fullName"),
                signUpRequest.get("role"),
                "EMP-00" + (userRepository.count() + 15),
                signUpRequest.get("branch"),
                "Active",
                signUpRequest.get("role").equals("Remedial Officer") ? "Create Cases, Upload Documents" : "Audit Access"
        );

        userRepository.save(user);

        auditService.record(user.getName(), "Auth", "User Registered",
                "New account created for " + user.getName() + " (" + user.getRole() + ")", "Success",
                "Account", "None", user.getUsername(), "Self-service signup");

        Map<String, String> success = new HashMap<>();
        success.put("message", "User registered successfully!");
        return ResponseEntity.ok(success);
    }
}
