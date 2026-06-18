package com.creditflow.backend.controllers;

import com.creditflow.backend.models.SystemConfig;
import com.creditflow.backend.repositories.ConfigRepository;
import com.creditflow.backend.services.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Persists system-wide parameters (DPD cutoff, AI confidence threshold, ...) to the
 * system_config table. Replaces the previous behaviour where Settings only flashed a
 * success banner without saving anything.
 */
@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @Autowired
    private ConfigRepository configRepository;

    @Autowired
    private AuditService auditService;

    // Sensible defaults, used to backfill the table the first time it is read.
    private static final Map<String, String> DEFAULTS = Map.of(
            "dpdCutoff", "90",
            "aiConfidenceThreshold", "80"
    );

    @GetMapping
    public ResponseEntity<Map<String, String>> getConfig() {
        Map<String, String> result = new LinkedHashMap<>();
        // Seed any missing defaults so the UI always has values to bind to.
        DEFAULTS.forEach((k, v) -> {
            if (!configRepository.existsById(k)) {
                configRepository.save(new SystemConfig(k, v));
            }
        });
        configRepository.findAll().forEach(c -> result.put(c.getConfigKey(), c.getConfigValue()));
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<Map<String, String>> updateConfig(@RequestBody Map<String, String> incoming) {
        Map<String, String> saved = new LinkedHashMap<>();
        StringBuilder changes = new StringBuilder();

        for (Map.Entry<String, String> e : incoming.entrySet()) {
            String key = e.getKey();
            String newValue = e.getValue() == null ? "" : e.getValue();

            SystemConfig existing = configRepository.findById(key).orElse(null);
            String oldValue = existing != null ? existing.getConfigValue() : "(unset)";

            configRepository.save(new SystemConfig(key, newValue));
            saved.put(key, newValue);

            if (changes.length() > 0) changes.append("; ");
            changes.append(key).append(": ").append(oldValue).append(" -> ").append(newValue);
        }

        // Server-side audit trail of the configuration change.
        auditService.record(
                "Settings",
                "Config Updated",
                "System parameters updated (" + changes + ")",
                "Warning",
                "System Parameters",
                "Previous values",
                changes.toString(),
                "Saved from Settings page"
        );

        return ResponseEntity.ok(saved);
    }
}
