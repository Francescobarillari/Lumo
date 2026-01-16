package it.unical.service;

import it.unical.api.ReportResponse;
import it.unical.model.Event;
import it.unical.model.Report;
import it.unical.model.User;
import it.unical.repository.EventRepository;
import it.unical.repository.ReportRepository;
import it.unical.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReportService {
    private static final String TARGET_USER = "USER";
    private static final String TARGET_EVENT = "EVENT";

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository, EventRepository eventRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    public ReportResponse createReport(Long reporterId, String targetType, Long targetId, String reason,
                                       String details, MultipartFile image) {
        String normalizedType = normalizeTargetType(targetType);
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new IllegalArgumentException("Reporter not found"));

        Report report = new Report();
        report.setReporterId(reporterId);
        report.setTargetType(normalizedType);
        report.setReason(reason != null ? reason.trim() : "");
        report.setDetails(details != null ? details.trim() : null);

        if (TARGET_USER.equals(normalizedType)) {
            User reportedUser = userRepository.findById(targetId)
                    .orElseThrow(() -> new IllegalArgumentException("Reported user not found"));
            report.setReportedUserId(reportedUser.getId());
        } else if (TARGET_EVENT.equals(normalizedType)) {
            Event reportedEvent = eventRepository.findById(targetId)
                    .orElseThrow(() -> new IllegalArgumentException("Reported event not found"));
            report.setReportedEventId(reportedEvent.getId());
        }

        if (image != null && !image.isEmpty()) {
            try {
                report.setImageData(image.getBytes());
                report.setImageContentType(image.getContentType());
                report.setImageFileName(image.getOriginalFilename());
            } catch (IOException e) {
                throw new RuntimeException("Unable to read report image", e);
            }
        }

        Report saved = reportRepository.save(report);
        return toResponse(saved, reporter, resolveTargetName(saved), buildImageUrl(saved));
    }

    public List<ReportResponse> getAllReports() {
        List<Report> reports = reportRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return reports.stream()
                .map(report -> {
                    String reporterName = resolveReporterName(report.getReporterId());
                    return toResponse(report, reporterName, resolveTargetName(report), buildImageUrl(report));
                })
                .collect(Collectors.toList());
    }

    public Optional<Report> getReport(Long id) {
        return reportRepository.findById(id);
    }

    private String normalizeTargetType(String targetType) {
        if (targetType == null) {
            throw new IllegalArgumentException("Missing targetType");
        }
        String normalized = targetType.trim().toUpperCase();
        if (!TARGET_USER.equals(normalized) && !TARGET_EVENT.equals(normalized)) {
            throw new IllegalArgumentException("Invalid targetType");
        }
        return normalized;
    }

    private String resolveReporterName(Long reporterId) {
        return userRepository.findById(reporterId)
                .map(User::getName)
                .orElse("Unknown");
    }

    private String resolveTargetName(Report report) {
        if (TARGET_USER.equals(report.getTargetType())) {
            if (report.getReportedUserId() == null) {
                return "Unknown";
            }
            return userRepository.findById(report.getReportedUserId())
                    .map(User::getName)
                    .orElse("Unknown");
        }
        if (report.getReportedEventId() == null) {
            return "Unknown";
        }
        return eventRepository.findById(report.getReportedEventId())
                .map(Event::getTitle)
                .orElse("Unknown");
    }

    private String buildImageUrl(Report report) {
        if (report.getImageData() == null || report.getImageData().length == 0) {
            return null;
        }
        return "http://localhost:8080/api/admin/reports/" + report.getId() + "/image";
    }

    private ReportResponse toResponse(Report report, User reporter, String targetName, String imageUrl) {
        return toResponse(report, reporter != null ? reporter.getName() : "Unknown", targetName, imageUrl);
    }

    private ReportResponse toResponse(Report report, String reporterName, String targetName, String imageUrl) {
        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setReporterId(report.getReporterId());
        response.setReporterName(reporterName);
        response.setTargetType(report.getTargetType());
        if (TARGET_USER.equals(report.getTargetType())) {
            response.setTargetId(report.getReportedUserId());
        } else {
            response.setTargetId(report.getReportedEventId());
        }
        response.setTargetName(targetName);
        response.setReason(report.getReason());
        response.setDetails(report.getDetails());
        response.setCreatedAt(report.getCreatedAt());
        response.setHasImage(report.getImageData() != null && report.getImageData().length > 0);
        response.setImageUrl(imageUrl);
        return response;
    }
}
