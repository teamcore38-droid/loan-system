package com.creditflow.backend.repositories;

import com.creditflow.backend.models.DashboardTask;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DashboardTaskRepository extends JpaRepository<DashboardTask, Long> {
    List<DashboardTask> findByRole(String role);
    List<DashboardTask> findByCaseId(String caseId);
    void deleteByCaseId(String caseId);
}
