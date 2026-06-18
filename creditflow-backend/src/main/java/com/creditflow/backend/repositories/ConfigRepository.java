package com.creditflow.backend.repositories;

import com.creditflow.backend.models.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfigRepository extends JpaRepository<SystemConfig, String> {
}
