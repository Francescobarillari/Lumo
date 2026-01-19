package it.unical.dao.impl;

import it.unical.dao.base.DaoException;

import it.unical.model.ChatPollOption;
import it.unical.proxy.ChatPollProxy;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ChatPollOptionDao {
    private final DataSource dataSource;

    public ChatPollOptionDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<ChatPollOption> findByPoll_Id(Long pollId) {
        String sql = "SELECT id, poll_id, text FROM chat_poll_option WHERE poll_id = ?";
        List<ChatPollOption> options = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, pollId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    options.add(mapOption(rs));
                }
            }
            return options;
        } catch (SQLException ex) {
            throw new DaoException("ChatPollOptionDao.findByPoll_Id failed", ex);
        }
    }

    public ChatPollOption save(ChatPollOption option) {
        if (option == null) {
            throw new IllegalArgumentException("ChatPollOptionDao.save option is null");
        }
        if (option.getId() == null) {
            insertOption(option);
        } else {
            updateOption(option);
        }
        return option;
    }

    private void insertOption(ChatPollOption option) {
        String sql = "INSERT INTO chat_poll_option (poll_id, text) VALUES (?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setObject(1, option.getPoll() != null ? option.getPoll().getId() : null);
            stmt.setString(2, option.getText());
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    option.setId(keys.getLong(1));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("ChatPollOptionDao.insertOption failed", ex);
        }
    }

    private void updateOption(ChatPollOption option) {
        String sql = "UPDATE chat_poll_option SET poll_id = ?, text = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, option.getPoll() != null ? option.getPoll().getId() : null);
            stmt.setString(2, option.getText());
            stmt.setLong(3, option.getId());
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("ChatPollOptionDao.updateOption failed", ex);
        }
    }

    private ChatPollOption mapOption(ResultSet rs) throws SQLException {
        ChatPollOption option = new ChatPollOption();
        option.setId(rs.getLong("id"));
        option.setText(rs.getString("text"));
        Long pollId = (Long) rs.getObject("poll_id");
        if (pollId != null) {
            ChatPollProxy poll = new ChatPollProxy(dataSource);
            poll.setId(pollId);
            option.setPoll(poll);
        }
        return option;
    }
}
