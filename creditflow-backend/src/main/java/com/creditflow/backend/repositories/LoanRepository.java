package com.creditflow.backend.repositories;

import com.creditflow.backend.models.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan, String> {
}
