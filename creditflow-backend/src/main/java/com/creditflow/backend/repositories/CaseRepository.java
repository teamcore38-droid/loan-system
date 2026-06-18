package com.creditflow.backend.repositories;

import com.creditflow.backend.models.RestructureCase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepository extends JpaRepository<RestructureCase, String> {
}
