package com.creditflow.backend.repositories;

import com.creditflow.backend.models.DashboardNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DashboardNotificationRepository extends JpaRepository<DashboardNotification, Long> {
    List<DashboardNotification> findByRole(String role);
    List<DashboardNotification> findByCaseId(String caseId);
    void deleteByCaseId(String caseId);
}
