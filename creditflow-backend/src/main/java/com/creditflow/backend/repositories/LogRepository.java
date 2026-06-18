package com.creditflow.backend.repositories;

import com.creditflow.backend.models.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogRepository extends JpaRepository<AuditLog, String> {
    List<AuditLog> findAllByOrderByTimestampDesc();
}
