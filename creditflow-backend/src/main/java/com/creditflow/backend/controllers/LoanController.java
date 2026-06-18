package com.creditflow.backend.controllers;

import com.creditflow.backend.models.Loan;
import com.creditflow.backend.repositories.LoanRepository;
import com.creditflow.backend.services.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/loans")
public class LoanController {
    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private AuditService auditService;

    @GetMapping("/{accountNo}")
    public ResponseEntity<?> getLoanByAccount(@PathVariable String accountNo) {
        Loan loan = loanRepository.findById(accountNo).orElse(null);
        if (loan == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(loan);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createLoan(@RequestBody Loan loan) {
        if (loanRepository.existsById(loan.getAccountNo())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Loan account already exists in Core Banking System.");
            return ResponseEntity.badRequest().body(error);
        }
        Loan saved = loanRepository.save(loan);

        auditService.record(
                "Loans",
                "Loan Seeded",
                "Loan account " + saved.getAccountNo() + " created in Core Banking System",
                "Success",
                "Loan Account",
                "None",
                saved.getAccountNo(),
                "Manual seed"
        );

        return ResponseEntity.ok(saved);
    }
}
