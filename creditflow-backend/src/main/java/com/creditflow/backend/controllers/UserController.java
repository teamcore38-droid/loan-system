package com.creditflow.backend.controllers;

import com.creditflow.backend.models.User;
import com.creditflow.backend.repositories.UserRepository;
import com.creditflow.backend.services.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private AuditService auditService;

    @GetMapping("/list")
    public ResponseEntity<List<User>> listUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveUser(@RequestBody Map<String, Object> userRequest) {
        String employeeId = (String) userRequest.get("employeeId");
        boolean isNew = userRequest.get("isNew") != null && (Boolean) userRequest.get("isNew");

        User user;
        if (isNew) {
            String email = (String) userRequest.get("email");
            String username = email.split("@")[0];
            user = new User(
                    username,
                    encoder.encode("password"), // Default password
                    (String) userRequest.get("name"),
                    (String) userRequest.get("role"),
                    employeeId,
                    (String) userRequest.get("branch"),
                    "Active",
                    (String) userRequest.get("permissions")
            );
        } else {
            user = userRepository.findAll().stream()
                    .filter(u -> u.getEmployeeId().equals(employeeId))
                    .findFirst()
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            user.setName((String) userRequest.get("name"));
            user.setRole((String) userRequest.get("role"));
            user.setBranch((String) userRequest.get("branch"));
            user.setPermissions((String) userRequest.get("permissions"));
        }

        userRepository.save(user);

        auditService.record(
                "Settings",
                isNew ? "User Created" : "User Updated",
                (isNew ? "Created user " : "Updated user ") + user.getName() + " (" + user.getEmployeeId() + ")",
                "Success",
                "User Profile",
                isNew ? "None" : "Existing profile",
                user.getRole() + " / " + user.getBranch(),
                isNew ? "New account provisioned" : "Profile edited"
        );

        return ResponseEntity.ok(user);
    }

    @PutMapping("/toggle-status/{empId}")
    public ResponseEntity<?> toggleStatus(@PathVariable String empId) {
        User user = userRepository.findAll().stream()
                .filter(u -> u.getEmployeeId().equals(empId))
                .findFirst()
                .orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String oldStatus = user.getStatus();
        String newStatus = "Active".equals(user.getStatus()) ? "Inactive" : "Active";
        user.setStatus(newStatus);
        userRepository.save(user);

        auditService.record(
                "Settings",
                "User Status Changed",
                user.getName() + " (" + user.getEmployeeId() + ") status changed to " + newStatus,
                "Warning",
                "Status",
                oldStatus,
                newStatus,
                "Account status toggled"
        );

        return ResponseEntity.ok(user);
    }
}
