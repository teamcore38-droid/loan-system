package com.creditflow.backend.controllers;

import com.creditflow.backend.models.AuditLog;
import com.creditflow.backend.repositories.LogRepository;
import com.creditflow.backend.services.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogController {
    @Autowired
    private LogRepository logRepository;

    @Autowired
    private AuditService auditService;

    @GetMapping("/list")
    public ResponseEntity<List<AuditLog>> getLogs() {
        return ResponseEntity.ok(logRepository.findAllByOrderByTimestampDesc());
    }

    // Accepts an audit event from the client but does NOT trust the client to set the
    // id, timestamp, IP address, or acting user. AuditService regenerates those
    // authoritatively from the server clock, the live request, and the JWT principal.
    @PostMapping("/create")
    public ResponseEntity<?> createLog(@RequestBody AuditLog auditLog) {
        AuditLog saved = auditService.recordFromRequest(auditLog);
        return ResponseEntity.ok(saved);
    }
}
