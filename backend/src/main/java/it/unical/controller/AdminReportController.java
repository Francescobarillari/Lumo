package it.unical.controller;

import it.unical.api.ReportResponse;
import it.unical.model.Report;
import it.unical.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminReportController {
    private final ReportService reportService;

    public AdminReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public List<ReportResponse> getReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> downloadReportImage(@PathVariable Long id) {
        Report report = reportService.getReport(id).orElse(null);
        if (report == null || report.getImageData() == null || report.getImageData().length == 0) {
            return ResponseEntity.notFound().build();
        }

        String contentType = report.getImageContentType() != null
                ? report.getImageContentType()
                : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        String fileName = report.getImageFileName() != null ? report.getImageFileName() : ("report-" + id + ".bin");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(report.getImageData());
    }
}
