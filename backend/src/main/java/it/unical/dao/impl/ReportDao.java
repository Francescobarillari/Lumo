package it.unical.dao.impl;

import it.unical.dao.base.DaoException;

import it.unical.model.Report;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class ReportDao {
    private final DataSource dataSource;

    public ReportDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<Report> findAll() {
        String sql = "SELECT * FROM reports";
        return fetchReportList(sql);
    }

    public List<Report> findAll(Sort sort) {
        String orderBy = buildOrderBy(sort);
        String sql = "SELECT * FROM reports" + orderBy;
        return fetchReportList(sql);
    }

    public Optional<Report> findById(Long id) {
        String sql = "SELECT * FROM reports WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapReport(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new DaoException("ReportDao.findById failed", ex);
        }
    }

    public Report save(Report report) {
        if (report == null) {
            throw new IllegalArgumentException("ReportDao.save report is null");
        }
        if (report.getId() == null) {
            insertReport(report);
        } else {
            updateReport(report);
        }
        return report;
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM reports WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("ReportDao.deleteById failed", ex);
        }
    }

    private List<Report> fetchReportList(String sql) {
        List<Report> reports = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                reports.add(mapReport(rs));
            }
            return reports;
        } catch (SQLException ex) {
            throw new DaoException("ReportDao.findAll failed", ex);
        }
    }

    private void insertReport(Report report) {
        String sql = "INSERT INTO reports (reporter_id, reported_user_id, reported_event_id, target_type, reason, "
                + "details, image_data, image_content_type, image_file_name, created_at) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            LocalDateTime createdAt = report.getCreatedAt() != null ? report.getCreatedAt() : LocalDateTime.now();
            bindReport(stmt, report, createdAt, false);
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    report.setId(keys.getLong(1));
                }
            }
            report.setCreatedAt(createdAt);
        } catch (SQLException ex) {
            throw new DaoException("ReportDao.insertReport failed", ex);
        }
    }

    private void updateReport(Report report) {
        String sql = "UPDATE reports SET reporter_id = ?, reported_user_id = ?, reported_event_id = ?, "
                + "target_type = ?, reason = ?, details = ?, image_data = ?, image_content_type = ?, "
                + "image_file_name = ?, created_at = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            bindReport(stmt, report, report.getCreatedAt(), true);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("ReportDao.updateReport failed", ex);
        }
    }

    private void bindReport(PreparedStatement stmt, Report report, LocalDateTime createdAt, boolean includeId)
            throws SQLException {
        stmt.setObject(1, report.getReporterId());
        stmt.setObject(2, report.getReportedUserId());
        stmt.setObject(3, report.getReportedEventId());
        stmt.setString(4, report.getTargetType());
        stmt.setString(5, report.getReason());
        stmt.setString(6, report.getDetails());
        stmt.setBytes(7, report.getImageData());
        stmt.setString(8, report.getImageContentType());
        stmt.setString(9, report.getImageFileName());
        stmt.setObject(10, createdAt);
        if (includeId) {
            stmt.setLong(11, report.getId());
        }
    }

    private Report mapReport(ResultSet rs) throws SQLException {
        Report report = new Report();
        report.setId(rs.getLong("id"));
        report.setReporterId((Long) rs.getObject("reporter_id"));
        report.setReportedUserId((Long) rs.getObject("reported_user_id"));
        report.setReportedEventId((Long) rs.getObject("reported_event_id"));
        report.setTargetType(rs.getString("target_type"));
        report.setReason(rs.getString("reason"));
        report.setDetails(rs.getString("details"));
        report.setImageData(rs.getBytes("image_data"));
        report.setImageContentType(rs.getString("image_content_type"));
        report.setImageFileName(rs.getString("image_file_name"));
        report.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        return report;
    }

    private String buildOrderBy(Sort sort) {
        if (sort == null || sort.isUnsorted()) {
            return "";
        }
        Sort.Order order = sort.iterator().next();
        String property = order.getProperty();
        String column = mapColumn(property);
        if (column == null) {
            return "";
        }
        String direction = order.isAscending() ? "ASC" : "DESC";
        return " ORDER BY " + column + " " + direction;
    }

    private String mapColumn(String property) {
        if (property == null) {
            return null;
        }
        if ("createdAt".equals(property)) {
            return "created_at";
        }
        return property;
    }
}
