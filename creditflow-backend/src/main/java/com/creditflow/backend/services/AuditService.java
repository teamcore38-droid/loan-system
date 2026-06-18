package com.creditflow.backend.services;

import com.creditflow.backend.models.AuditLog;
import com.creditflow.backend.repositories.LogRepository;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Central, authoritative audit logger.
 *
 * The frontend no longer fabricates audit records. Every audit log is created
 * here, on the server, where we can trust:
 *   - the ID (sequential, server-generated),
 *   - the timestamp (server clock),
 *   - the client IP (read from the live HTTP request),
 *   - the acting user (resolved from the authenticated JWT principal).
 *
 * Controllers call {@code record(...)} at the point an action actually happens.
 */
@Service
public class AuditService {

    private final LogRepository logRepository;

    /** Sequence used to build the AUD-yyyyMMdd-N id. Seeded from existing rows at startup. */
    private final AtomicLong sequence = new AtomicLong(101);

    @Autowired
    public AuditService(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    @PostConstruct
    void initSequence() {
        // Continue numbering past whatever is already persisted (seed data + prior runs).
        sequence.set(logRepository.count() + 101);
    }

    /**
     * Record an audit event for the currently authenticated user.
     */
    public AuditLog record(String module, String action, String details, String status) {
        return record(null, module, action, details, status, null, null, null, null);
    }

    /**
     * Record an audit event for the currently authenticated user, including a before/after change set.
     */
    public AuditLog record(String module, String action, String details, String status,
                           String changeField, String changeBefore, String changeAfter, String changeComment) {
        return record(null, module, action, details, status, changeField, changeBefore, changeAfter, changeComment);
    }

    /**
     * Full form. {@code actorOverride} is used only when the acting user cannot be taken
     * from the security context (e.g. a login attempt that has not authenticated yet, or a
     * background/system action). When null, the authenticated principal is used.
     */
    public AuditLog record(String actorOverride, String module, String action, String details, String status,
                           String changeField, String changeBefore, String changeAfter, String changeComment) {
        AuditLog log = new AuditLog(
                nextId(),
                now(),
                resolveActor(actorOverride),
                module,
                action,
                details,
                clientIp(),
                status,
                changeField,
                changeBefore,
                changeAfter,
                changeComment
        );
        return logRepository.save(log);
    }

    /**
     * Persist a log that originated from a client request body while overriding the
     * fields the client must not control (id, timestamp, ip, and the acting user).
     * This keeps the /api/logs/create endpoint authoritative.
     */
    public AuditLog recordFromRequest(AuditLog incoming) {
        AuditLog log = new AuditLog(
                nextId(),
                now(),
                resolveActor(incoming.getUser()),
                incoming.getModule(),
                incoming.getAction(),
                incoming.getDetails(),
                clientIp(),
                incoming.getStatus() != null ? incoming.getStatus() : "Success",
                incoming.getChangeField(),
                incoming.getChangeBefore(),
                incoming.getChangeAfter(),
                incoming.getChangeComment()
        );
        return logRepository.save(log);
    }

    // --- helpers -----------------------------------------------------------

    private synchronized String nextId() {
        return "AUD-" + new SimpleDateFormat("yyyyMMdd").format(new Date()) + "-" + sequence.getAndIncrement();
    }

    private String now() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }

    /**
     * Prefer the authenticated principal's display name. Fall back to the supplied
     * override (for pre-auth or system events), and finally to "System".
     */
    private String resolveActor(String override) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetailsImpl principal) {
            return principal.getName();
        }
        return (override != null && !override.isBlank()) ? override : "System";
    }

    /**
     * Read the real client IP from the active request. Honours a reverse-proxy
     * X-Forwarded-For header when present, otherwise uses the socket remote address.
     */
    private String clientIp() {
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs == null) {
                return "unknown";
            }
            HttpServletRequest request = attrs.getRequest();
            String forwarded = request.getHeader("X-Forwarded-For");
            if (forwarded != null && !forwarded.isBlank()) {
                // First entry is the original client.
                return forwarded.split(",")[0].trim();
            }
            String ip = request.getRemoteAddr();
            return (ip != null && !ip.isBlank()) ? ip : "unknown";
        } catch (Exception e) {
            return "unknown";
        }
    }
}
