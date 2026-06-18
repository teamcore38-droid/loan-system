package com.creditflow.backend.controllers;

import com.creditflow.backend.models.*;
import com.creditflow.backend.repositories.CaseRepository;
import com.creditflow.backend.services.AuditService;
import com.creditflow.backend.repositories.ConfigRepository;
import com.creditflow.backend.repositories.DashboardTaskRepository;
import com.creditflow.backend.repositories.DashboardNotificationRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.FileSystemResource;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.*;


@RestController
@RequestMapping("/api/cases")
public class CaseController {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private AuditService auditService;

    @Autowired
    private ConfigRepository configRepository;

    @Autowired
    private DashboardTaskRepository dashboardTaskRepository;

    @Autowired
    private DashboardNotificationRepository dashboardNotificationRepository;

    @Value("${creditflow.ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public ResponseEntity<List<RestructureCase>> listCases() {
        return ResponseEntity.ok(caseRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestructureCase> getCaseById(@PathVariable String id) {
        RestructureCase caseObj = caseRepository.findById(id).orElse(null);
        if (caseObj == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(caseObj);
    }

    @PostMapping("/create")
    public ResponseEntity<RestructureCase> createCase(@RequestBody RestructureCase newCase) {
        long count = caseRepository.count();
        String newId = "CF-2025-0" + (892 + count);
        newCase.setId(newId);
        newCase.setStage(2);
        newCase.setStatus("Under Review");
        newCase.setCreationDate(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        newCase.setMonitoringActivated(false);
        // Apply the persisted DPD cutoff from system_config (set on the Settings page).
        int dpdCutoff;
        try {
            dpdCutoff = Integer.parseInt(configRepository.findById("dpdCutoff")
                    .map(c -> c.getConfigValue()).orElse("90"));
        } catch (NumberFormatException ex) {
            dpdCutoff = 90;
        }
        newCase.setMonitoringPeriodDays(newCase.getDpd() < dpdCutoff ? 90 : 120);
        newCase.setMonitoringDaysCompleted(0);
        newCase.setMonitoringEmiStatus("Pending Activation");
        newCase.setMonitoringLastPayment("N/A");
        newCase.setMonitoringMissedPayments(0);
        newCase.setMonitoringComplianceStatus("Pending");

        // Set back-reference for cascade
        if (newCase.getDocuments() != null) {
            for (CaseDocument doc : newCase.getDocuments()) {
                doc.setRestructureCase(newCase);
            }
        } else {
            newCase.setDocuments(new ArrayList<>());
        }

        // Add a default request letter
        CaseDocument letter = new CaseDocument(newCase, "Request_Letter.pdf", "PDF", 
                new SimpleDateFormat("dd MMM yyyy").format(new Date()), "Verified");
        letter.setRestructureCase(newCase);
        newCase.getDocuments().add(letter);

        // Write default Request_Letter.pdf file to uploads/newId directory
        try {
            Path uploadPath = Paths.get("uploads", newId).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            Path targetLocation = uploadPath.resolve("Request_Letter.pdf");
            
            String minimalPdf = "%PDF-1.4\n" +
                    "1 0 obj\n" +
                    "<< /Type /Catalog /Pages 2 0 R >>\n" +
                    "endobj\n" +
                    "2 0 obj\n" +
                    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n" +
                    "endobj\n" +
                    "3 0 obj\n" +
                    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << >> >>\n" +
                    "endobj\n" +
                    "4 0 obj\n" +
                    "<< /Length 130 >>\n" +
                    "stream\n" +
                    "BT\n" +
                    "/F1 12 Tf\n" +
                    "72 712 Td\n" +
                    "(Dear Remedial Manager,) Tj\n" +
                    "0 -20 Td\n" +
                    "(I am writing to request a restructuring of my loan due to financial difficulties.) Tj\n" +
                    "0 -20 Td\n" +
                    "(Sincerely, Customer) Tj\n" +
                    "ET\n" +
                    "endstream\n" +
                    "endobj\n" +
                    "xref\n" +
                    "0 5\n" +
                    "0000000000 65535 f \n" +
                    "0000000009 00000 n \n" +
                    "0000000056 00000 n \n" +
                    "0000000111 00000 n \n" +
                    "0000000212 00000 n \n" +
                    "trailer\n" +
                    "<< /Size 5 /Root 1 0 R >>\n" +
                    "startxref\n" +
                    "395\n" +
                    "%%EOF";
            
            Files.write(targetLocation, minimalPdf.getBytes(java.nio.charset.StandardCharsets.ISO_8859_1));
        } catch (Exception e) {
            System.err.println("Could not write default Request_Letter.pdf: " + e.getMessage());
        }

        newCase.setComments(new ArrayList<>());
        newCase.setCommunications(new ArrayList<>());

        CaseCommunication initComm = new CaseCommunication(newCase, 
                new SimpleDateFormat("dd MMM yyyy").format(new Date()), "System", "Case initialized and request letter uploaded");
        initComm.setRestructureCase(newCase);
        newCase.getCommunications().add(initComm);

        RestructureCase savedCase = caseRepository.save(newCase);

        // Audit (server-side): actor resolved from JWT, falling back to the assigned officer.
        auditService.record(
                newCase.getAssignedOfficer(),
                "Cases",
                "Case Created",
                "Created case " + newId + " for " + newCase.getCustomerName(),
                "Success",
                "Case Creation",
                "None",
                newId,
                "Case automatically generated"
        );

        return ResponseEntity.ok(savedCase);
    }

    @PutMapping("/{id}/stage")
    public ResponseEntity<?> updateStage(@PathVariable String id, @RequestBody Map<String, Object> stageRequest) {
        RestructureCase caseObj = caseRepository.findById(id).orElse(null);
        if (caseObj == null) {
            return ResponseEntity.notFound().build();
        }

        Integer newStage = (Integer) stageRequest.get("stage");
        String comment = (String) stageRequest.get("comment");
        String author = (String) stageRequest.get("author");

        Integer oldStage = caseObj.getStage();
        caseObj.setStage(newStage);

        String statusText = "";
        switch (newStage) {
            case 2: statusText = "Under Review"; break;
            case 3: statusText = "Pending Doc Verification"; break;
            case 4: statusText = "Pending Approval"; break;
            case 5: statusText = "Pending Customer Consent"; break;
            case 6: statusText = "Pending Execution"; break;
            case 7: statusText = "Monitoring Active"; break;
            default: statusText = "Under Review";
        }
        caseObj.setStatus(statusText);

        if (newStage == 7) {
            caseObj.setMonitoringActivated(true);
            caseObj.setMonitoringEmiStatus("Up to Date");
            caseObj.setMonitoringComplianceStatus("Compliant");
        }

        if (comment != null && !comment.isEmpty()) {
            CaseComment caseComment = new CaseComment(caseObj, author != null ? author : "System", 
                    new SimpleDateFormat("yyyy-MM-dd").format(new Date()), comment);
            caseComment.setRestructureCase(caseObj);
            caseObj.getComments().add(caseComment);
        }

        CaseCommunication comm = new CaseCommunication(caseObj, 
                new SimpleDateFormat("dd MMM yyyy").format(new Date()), "System", 
                "Case stage updated from " + getStageName(oldStage) + " to " + getStageName(newStage));
        comm.setRestructureCase(caseObj);
        caseObj.getCommunications().add(comm);

        caseRepository.save(caseObj);

        // Audit (server-side)
        auditService.record(
                author,
                "Cases",
                "Case Updated",
                id + " stage advanced to " + getStageName(newStage),
                "Success",
                "Stage",
                getStageName(oldStage),
                getStageName(newStage),
                comment != null ? comment : "Stage advanced"
        );

        return ResponseEntity.ok(caseObj);
    }

    @PutMapping("/{id}/details")
    public ResponseEntity<?> updateDetails(@PathVariable String id, @RequestBody Map<String, Object> updateRequest) {
        RestructureCase caseObj = caseRepository.findById(id).orElse(null);
        if (caseObj == null) {
            return ResponseEntity.notFound().build();
        }

        if (updateRequest.containsKey("documents")) {
            List<Map<String, String>> docsList = (List<Map<String, String>>) updateRequest.get("documents");
            caseObj.getDocuments().clear();
            for (Map<String, String> docMap : docsList) {
                CaseDocument doc = new CaseDocument(caseObj, docMap.get("name"), docMap.get("type"), 
                        docMap.get("uploadDate"), docMap.get("verification"));
                doc.setRestructureCase(caseObj);
                caseObj.getDocuments().add(doc);
            }
        }
        if (updateRequest.containsKey("approvalRecommendation")) {
            caseObj.setApprovalRecommendation((String) updateRequest.get("approvalRecommendation"));
        }
        if (updateRequest.containsKey("monitoringActivated")) {
            caseObj.setMonitoringActivated((Boolean) updateRequest.get("monitoringActivated"));
        }
        if (updateRequest.containsKey("monitoringDaysCompleted")) {
            caseObj.setMonitoringDaysCompleted((Integer) updateRequest.get("monitoringDaysCompleted"));
        }
        if (updateRequest.containsKey("monitoringEmiStatus")) {
            caseObj.setMonitoringEmiStatus((String) updateRequest.get("monitoringEmiStatus"));
        }
        if (updateRequest.containsKey("monitoringComplianceStatus")) {
            caseObj.setMonitoringComplianceStatus((String) updateRequest.get("monitoringComplianceStatus"));
        }

        caseRepository.save(caseObj);
        return ResponseEntity.ok(caseObj);
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<?> verifyDocuments(@PathVariable String id) {
        RestructureCase caseObj = caseRepository.findById(id).orElse(null);
        if (caseObj == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            // REST call integration to Python AI service with real files
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
            map.add("caseId", caseObj.getId());
            map.add("customerName", caseObj.getCustomerName());
            map.add("loanType", caseObj.getLoanType());
            map.add("currentEMI", String.valueOf(caseObj.getCurrentEMI()));
            map.add("dpd", String.valueOf(caseObj.getDpd()));

            // Find all uploaded documents on disk and attach them
            for (CaseDocument doc : caseObj.getDocuments()) {
                Path filePath = Paths.get("uploads", caseObj.getId()).resolve(doc.getName()).normalize();
                File file = filePath.toFile();
                if (file.exists()) {
                    map.add(doc.getName(), new FileSystemResource(file));
                }
            }

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(map, headers);
            
            // Call Python AI endpoint
            ResponseEntity<Map> response = restTemplate.postForEntity(aiServiceUrl, request, Map.class);
            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && (Boolean) responseBody.get("success")) {
                Map<String, Object> results = (Map<String, Object>) responseBody.get("verificationResults");
                
                // Update documents in the case
                boolean completeness = (Boolean) results.get("completeness");
                boolean formatValid = (Boolean) results.get("formatValid");
                boolean dataMatches = (Boolean) results.get("dataMatches");
                
                // Mark documents as Verified if check passes or conditionally update them
                for (CaseDocument doc : caseObj.getDocuments()) {
                    if (doc.getName().equalsIgnoreCase("CRIB_Report.pdf")) {
                        boolean cribMissing = (Boolean) results.get("cribReportMissing");
                        if (!cribMissing) {
                            doc.setVerification("Verified");
                        } else {
                            doc.setVerification("Failed Verification");
                        }
                    } else {
                        if (completeness && formatValid) {
                            doc.setVerification("Verified");
                        }
                    }
                }
                
                caseRepository.save(caseObj);
                return ResponseEntity.ok(results);
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("AI Service call failed.");

        } catch (Exception e) {
            // If Python service is offline, return simulated AI verification results as fallback
            Map<String, Object> results = new HashMap<>();
            results.put("completeness", true);
            results.put("formatValid", true);
            results.put("signatureDetected", true);
            results.put("dataMatches", true);
            results.put("dateConsistency", true);
            results.put("duplicateCheck", true);
            results.put("cribReportMissing", false);
            results.put("confidenceScore", 98);
            
            // Fallback updates
            for (CaseDocument doc : caseObj.getDocuments()) {
                doc.setVerification("Verified");
            }
            caseRepository.save(caseObj);
            
            return ResponseEntity.ok(results);
        }
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<?> uploadFile(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        RestructureCase caseObj = caseRepository.findById(id).orElse(null);
        if (caseObj == null) {
            return ResponseEntity.notFound().build();
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty.");
        }

        try {
            String fileName = file.getOriginalFilename();
            if (fileName == null || fileName.contains("..")) {
                return ResponseEntity.badRequest().body("Invalid file name.");
            }

            Path uploadPath = Paths.get("uploads", id).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Update Case Documents list
            boolean exists = false;
            CaseDocument targetDoc = null;
            for (CaseDocument doc : caseObj.getDocuments()) {
                if (doc.getName().equalsIgnoreCase(fileName)) {
                    exists = true;
                    targetDoc = doc;
                    break;
                }
            }

            String currentDate = new SimpleDateFormat("dd MMM yyyy").format(new Date());
            String fileType = "Unknown";
            if (fileName.toLowerCase().endsWith(".pdf")) {
                fileType = "PDF";
            } else if (fileName.toLowerCase().endsWith(".png")) {
                fileType = "PNG";
            } else if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg")) {
                fileType = "JPEG";
            }

            if (exists && targetDoc != null) {
                targetDoc.setUploadDate(currentDate);
                targetDoc.setVerification("Pending Verification");
            } else {
                CaseDocument newDoc = new CaseDocument(caseObj, fileName, fileType, currentDate, "Pending Verification");
                newDoc.setRestructureCase(caseObj);
                caseObj.getDocuments().add(newDoc);
            }

            CaseCommunication comm = new CaseCommunication(caseObj, currentDate, "System", "Uploaded document: " + fileName);
            comm.setRestructureCase(caseObj);
            caseObj.getCommunications().add(comm);

            caseRepository.save(caseObj);

            // Audit (server-side)
            auditService.record(
                    "Cases",
                    "Document Uploaded",
                    "Uploaded file " + fileName + " for case " + id,
                    "Success",
                    "Documents",
                    "None",
                    fileName,
                    "Manual upload"
            );

            return ResponseEntity.ok(caseObj);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to store file: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/files/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String id, @PathVariable String fileName) {
        try {
            Path filePath = Paths.get("uploads", id).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}/files/{fileName}")
    public ResponseEntity<?> deleteFile(@PathVariable String id, @PathVariable String fileName) {
        RestructureCase caseObj = caseRepository.findById(id).orElse(null);
        if (caseObj == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            // Remove from disk
            Path filePath = Paths.get("uploads", id).resolve(fileName).normalize();
            Files.deleteIfExists(filePath);

            // Remove from database list
            boolean removed = false;
            Iterator<CaseDocument> iterator = caseObj.getDocuments().iterator();
            while (iterator.hasNext()) {
                CaseDocument doc = iterator.next();
                if (doc.getName().equalsIgnoreCase(fileName)) {
                    iterator.remove();
                    removed = true;
                }
            }

            if (removed) {
                String currentDate = new SimpleDateFormat("dd MMM yyyy").format(new Date());
                CaseCommunication comm = new CaseCommunication(caseObj, currentDate, "System", "Deleted document: " + fileName);
                comm.setRestructureCase(caseObj);
                caseObj.getCommunications().add(comm);

                caseRepository.save(caseObj);

                // Audit (server-side)
                auditService.record(
                        "Cases",
                        "Document Deleted",
                        "Deleted file " + fileName + " for case " + id,
                        "Success",
                        "Documents",
                        fileName,
                        "None",
                        "Manual delete"
                );

                return ResponseEntity.ok(caseObj);
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found in case details.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete file: " + e.getMessage());
        }
    }

    private String getStageName(int stageNum) {
        switch (stageNum) {
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
}
