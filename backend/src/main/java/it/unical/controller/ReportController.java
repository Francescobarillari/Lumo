package it.unical.controller;

import it.unical.api.ReportResponse;
import it.unical.service.ReportService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportResponse> createReport(
            @RequestParam Long reporterId,
            @RequestParam String targetType,
            @RequestParam Long targetId,
            @RequestParam String reason,
            @RequestParam(required = false) String details,
            @RequestParam(required = false) MultipartFile image) {
        if (reason == null || reason.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        ReportResponse response = reportService.createReport(reporterId, targetType, targetId, reason, details, image);
        return ResponseEntity.ok(response);
    }
}
