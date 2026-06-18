package com.creditflow.backend.controllers;

import com.creditflow.backend.models.RestructureCase;
import com.creditflow.backend.repositories.CaseRepository;
import com.creditflow.backend.services.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Real reporting/analytics endpoints. Everything is computed from the live
 * RestructureCase data in the database — no hardcoded statistics. CSV exports
 * are generated server-side and streamed back as real downloadable files.
 */
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private AuditService auditService;

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // ---------------------------------------------------------------- analytics

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> analytics(
            @RequestParam(required = false) String loanType,
            @RequestParam(required = false) String range,
            @RequestParam(required = false) String branch) {

        List<RestructureCase> cases = filter(loanType, range);
        return ResponseEntity.ok(buildAnalytics(cases));
    }

    private Map<String, Object> buildAnalytics(List<RestructureCase> cases) {
        Map<String, Object> out = new LinkedHashMap<>();
        int total = cases.size();

        long rescheduled = cases.stream().filter(this::isRescheduled).count();
        double portfolio = cases.stream()
                .mapToDouble(c -> c.getOutstandingBalance() == null ? 0 : c.getOutstandingBalance()).sum();
        double avgDpd = cases.stream()
                .mapToInt(c -> c.getDpd() == null ? 0 : c.getDpd()).average().orElse(0);

        long completed = cases.stream().filter(this::isApproved).count();
        long activated = cases.stream().filter(c -> Boolean.TRUE.equals(c.getMonitoringActivated())).count();
        long compliant = cases.stream()
                .filter(c -> Boolean.TRUE.equals(c.getMonitoringActivated())
                        && "Compliant".equalsIgnoreCase(c.getMonitoringComplianceStatus())).count();

        out.put("totalRestructured", total);
        out.put("totalRescheduled", rescheduled);
        out.put("successRate", total == 0 ? 0 : round1(completed * 100.0 / total));
        out.put("avgDpd", (int) Math.round(avgDpd));
        out.put("totalPortfolio", portfolio);
        out.put("complianceRate", activated == 0 ? 0 : round1(compliant * 100.0 / activated));

        out.put("loanTypeDistribution", loanTypeDistribution(cases, total));
        out.put("monthlyVolume", monthlyVolume(cases));
        out.put("officerPerformance", officerPerformance(cases));
        return out;
    }

    private List<Map<String, Object>> loanTypeDistribution(List<RestructureCase> cases, int total) {
        Map<String, Long> byType = cases.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getLoanType() == null ? "Other" : c.getLoanType(),
                        LinkedHashMap::new, Collectors.counting()));
        List<Map<String, Object>> dist = new ArrayList<>();
        byType.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .forEach(e -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("label", e.getKey());
                    row.put("count", e.getValue());
                    row.put("percent", total == 0 ? 0 : round1(e.getValue() * 100.0 / total));
                    dist.add(row);
                });
        return dist;
    }

    private List<Map<String, Object>> monthlyVolume(List<RestructureCase> cases) {
        List<Map<String, Object>> out = new ArrayList<>();
        YearMonth now = YearMonth.now();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = now.minusMonths(i);
            long restructured = cases.stream().filter(c -> sameMonth(c, ym)).count();
            long resched = cases.stream().filter(c -> sameMonth(c, ym) && isRescheduled(c)).count();
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("month", ym.getMonth().getDisplayName(java.time.format.TextStyle.SHORT, Locale.ENGLISH));
            row.put("restructured", restructured);
            row.put("rescheduled", resched);
            out.add(row);
        }
        return out;
    }

    private List<Map<String, Object>> officerPerformance(List<RestructureCase> cases) {
        Map<String, List<RestructureCase>> byOfficer = cases.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getAssignedOfficer() == null ? "Unassigned" : c.getAssignedOfficer(),
                        LinkedHashMap::new, Collectors.toList()));
        List<Map<String, Object>> out = new ArrayList<>();
        byOfficer.forEach((officer, list) -> {
            long approved = list.stream().filter(this::isApproved).count();
            long rejected = list.stream().filter(this::isRejected).count();
            int handled = list.size();
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("name", officer);
            row.put("cases", handled);
            row.put("approved", approved);
            row.put("rejected", rejected);
            row.put("rate", handled == 0 ? "0%" : Math.round(approved * 100.0 / handled) + "%");
            out.add(row);
        });
        out.sort((a, b) -> Integer.compare((Integer) b.get("cases"), (Integer) a.get("cases")));
        return out;
    }

    // ---------------------------------------------------------------- CSV export

    @GetMapping("/export")
    public ResponseEntity<String> export(
            @RequestParam(required = false, defaultValue = "Restructuring Summary") String type,
            @RequestParam(required = false) String loanType,
            @RequestParam(required = false) String range) {

        List<RestructureCase> cases = filter(loanType, range);
        String csv = buildCsv(type, cases);

        auditService.record("Reports", "Report Exported",
                "Exported \"" + type + "\" report (CSV, " + cases.size() + " records)", "Success",
                "Report", "None", type, "CSV export");

        String filename = type.replaceAll("[^A-Za-z0-9]+", "_")
                + "_" + LocalDate.now().format(DATE) + ".csv";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(csv);
    }

    private String buildCsv(String type, List<RestructureCase> cases) {
        StringBuilder sb = new StringBuilder();
        switch (type == null ? "" : type) {
            case "Officer Productivity Report": {
                sb.append("Officer,Cases Handled,Approved,Rejected,Success Rate\n");
                for (Map<String, Object> o : officerPerformance(cases)) {
                    sb.append(csv(o.get("name"))).append(',')
                      .append(o.get("cases")).append(',')
                      .append(o.get("approved")).append(',')
                      .append(o.get("rejected")).append(',')
                      .append(csv(o.get("rate"))).append('\n');
                }
                break;
            }
            case "DPD Classification Report": {
                sb.append("Classification,Cases,Avg DPD,Total Outstanding (LKR)\n");
                Map<String, List<RestructureCase>> byClass = cases.stream()
                        .collect(Collectors.groupingBy(
                                c -> c.getClassification() == null ? "Unclassified" : c.getClassification(),
                                LinkedHashMap::new, Collectors.toList()));
                for (Map.Entry<String, List<RestructureCase>> e : byClass.entrySet()) {
                    double avg = e.getValue().stream().mapToInt(c -> c.getDpd() == null ? 0 : c.getDpd()).average().orElse(0);
                    double outstanding = e.getValue().stream().mapToDouble(c -> c.getOutstandingBalance() == null ? 0 : c.getOutstandingBalance()).sum();
                    sb.append(csv(e.getKey())).append(',')
                      .append(e.getValue().size()).append(',')
                      .append((int) Math.round(avg)).append(',')
                      .append(String.format(Locale.US, "%.2f", outstanding)).append('\n');
                }
                break;
            }
            case "Compliance Report": {
                sb.append("Case ID,Customer,Monitoring Active,Compliance Status,EMI Status,Missed Payments\n");
                for (RestructureCase c : cases) {
                    if (!Boolean.TRUE.equals(c.getMonitoringActivated())) continue;
                    sb.append(csv(c.getId())).append(',')
                      .append(csv(c.getCustomerName())).append(',')
                      .append("Yes").append(',')
                      .append(csv(c.getMonitoringComplianceStatus())).append(',')
                      .append(csv(c.getMonitoringEmiStatus())).append(',')
                      .append(c.getMonitoringMissedPayments() == null ? 0 : c.getMonitoringMissedPayments()).append('\n');
                }
                break;
            }
            default: { // Restructuring Summary
                sb.append("Case ID,Customer,Loan Type,DPD,Outstanding (LKR),Current EMI,Proposed EMI,Stage,Status,Officer,Compliance\n");
                for (RestructureCase c : cases) {
                    sb.append(csv(c.getId())).append(',')
                      .append(csv(c.getCustomerName())).append(',')
                      .append(csv(c.getLoanType())).append(',')
                      .append(c.getDpd() == null ? 0 : c.getDpd()).append(',')
                      .append(String.format(Locale.US, "%.2f", c.getOutstandingBalance() == null ? 0 : c.getOutstandingBalance())).append(',')
                      .append(String.format(Locale.US, "%.2f", c.getCurrentEMI() == null ? 0 : c.getCurrentEMI())).append(',')
                      .append(String.format(Locale.US, "%.2f", c.getProposedEMI() == null ? 0 : c.getProposedEMI())).append(',')
                      .append(csv(stageName(c.getStage()))).append(',')
                      .append(csv(c.getStatus())).append(',')
                      .append(csv(c.getAssignedOfficer())).append(',')
                      .append(csv(c.getMonitoringComplianceStatus())).append('\n');
                }
                break;
            }
        }
        return sb.toString();
    }

    // ---------------------------------------------------------------- helpers

    private List<RestructureCase> filter(String loanType, String range) {
        return caseRepository.findAll().stream()
                .filter(c -> loanType == null || loanType.isBlank()
                        || "All Types".equalsIgnoreCase(loanType)
                        || loanType.equalsIgnoreCase(c.getLoanType()))
                .filter(c -> inRange(c, range))
                .collect(Collectors.toList());
    }

    private boolean inRange(RestructureCase c, String range) {
        if (range == null || range.isBlank()) return true;
        LocalDate created = parseDate(c.getCreationDate());
        if (created == null) return true;
        String r = range.toLowerCase();
        if (r.contains("90")) {
            return !created.isBefore(LocalDate.now().minusDays(90));
        }
        if (r.startsWith("full year")) {
            String digits = range.replaceAll("[^0-9]", "");
            if (digits.length() >= 4) {
                int year = Integer.parseInt(digits.substring(0, 4));
                return created.getYear() == year;
            }
        }
        return true; // month-range labels: no extra filtering
    }

    private boolean sameMonth(RestructureCase c, YearMonth ym) {
        LocalDate d = parseDate(c.getCreationDate());
        return d != null && d.getYear() == ym.getYear() && d.getMonthValue() == ym.getMonthValue();
    }

    private LocalDate parseDate(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return LocalDate.parse(s.substring(0, 10), DATE);
        } catch (Exception e) {
            return null;
        }
    }

    private boolean isRescheduled(RestructureCase c) {
        return c.getProposedTenure() != null && c.getRemainingTenure() != null
                && c.getProposedTenure() > c.getRemainingTenure();
    }

    private boolean isApproved(RestructureCase c) {
        if (Boolean.TRUE.equals(c.getMonitoringActivated())) return true;
        if (c.getStage() != null && c.getStage() >= 5) return true;
        return c.getApprovalRecommendation() != null
                && c.getApprovalRecommendation().toLowerCase().contains("approve");
    }

    private boolean isRejected(RestructureCase c) {
        if (c.getApprovalRecommendation() != null
                && c.getApprovalRecommendation().toLowerCase().contains("reject")) return true;
        return c.getStatus() != null && c.getStatus().toLowerCase().contains("reject");
    }

    private String stageName(Integer stage) {
        if (stage == null) return "Unknown";
        switch (stage) {
            case 1: return "Request Submitted";
            case 2: return "Remedial Review";
            case 3: return "Doc Verification";
            case 4: return "Credit Approval";
            case 5: return "Sales Consent";
            case 6: return "CCPU Execution";
            case 7: return "Monitoring Active";
            default: return "Unknown";
        }
    }

    private double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    private String csv(Object value) {
        String s = value == null ? "" : value.toString();
        if (s.contains(",") || s.contains("\"") || s.contains("\n")) {
            s = "\"" + s.replace("\"", "\"\"") + "\"";
        }
        return s;
    }
}
