package it.unical.dao.impl;

import it.unical.dao.base.DaoException;

import it.unical.model.ChatPoll;
import it.unical.model.ChatPollOption;
import it.unical.model.ChatPollVote;
import it.unical.model.EventChat;
import it.unical.model.User;
import it.unical.proxy.ChatPollProxy;
import it.unical.proxy.EventChatProxy;
import it.unical.proxy.UserProxy;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class ChatPollDao {
    private final DataSource dataSource;

    public ChatPollDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<ChatPoll> findByChat_IdOrderByCreatedAtDesc(Long chatId) {
        String sql = "SELECT id, chat_id, question, created_at, ends_at, is_closed, created_by "
                + "FROM chat_poll WHERE chat_id = ? ORDER BY created_at DESC";
        List<ChatPoll> polls = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, chatId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    ChatPoll poll = mapPoll(rs);
                    polls.add(poll);
                }
            }
            return polls;
        } catch (SQLException ex) {
            throw new DaoException("ChatPollDao.findByChat_IdOrderByCreatedAtDesc failed", ex);
        }
    }

    public Optional<ChatPoll> findByIdAndChat_Id(Long pollId, Long chatId) {
        String sql = "SELECT id, chat_id, question, created_at, ends_at, is_closed, created_by "
                + "FROM chat_poll WHERE id = ? AND chat_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, pollId);
            stmt.setLong(2, chatId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    ChatPoll poll = mapPoll(rs);
                    return Optional.of(poll);
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new DaoException("ChatPollDao.findByIdAndChat_Id failed", ex);
        }
    }

    public ChatPoll save(ChatPoll poll) {
        if (poll == null) {
            throw new IllegalArgumentException("ChatPollDao.save poll is null");
        }

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                if (poll.getId() == null) {
                    insertPoll(conn, poll);
                } else {
                    updatePoll(conn, poll);
                }

                if (poll.getOptions() != null) {
                    for (ChatPollOption option : poll.getOptions()) {
                        if (option.getId() == null) {
                            insertOption(conn, poll.getId(), option);
                        }
                    }
                }

                if (poll.getVotes() != null) {
                    for (ChatPollVote vote : poll.getVotes()) {
                        if (vote.getId() == null) {
                            insertVote(conn, poll.getId(), vote);
                        }
                    }
                }

                conn.commit();
                return poll;
            } catch (SQLException ex) {
                conn.rollback();
                throw new DaoException("ChatPollDao.save failed", ex);
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException ex) {
            throw new DaoException("ChatPollDao.save failed", ex);
        }
    }

    private void insertPoll(Connection conn, ChatPoll poll) throws SQLException {
        String sql = "INSERT INTO chat_poll (chat_id, question, created_at, ends_at, is_closed, created_by) "
                + "VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setObject(1, poll.getChat() != null ? poll.getChat().getId() : null);
            stmt.setString(2, poll.getQuestion());
            stmt.setObject(3, poll.getCreatedAt());
            stmt.setObject(4, poll.getEndsAt());
            stmt.setBoolean(5, poll.getIsClosed());
            stmt.setObject(6, poll.getCreatedBy() != null ? poll.getCreatedBy().getId() : null);
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    poll.setId(keys.getLong(1));
                }
            }
        }
    }

    private void updatePoll(Connection conn, ChatPoll poll) throws SQLException {
        String sql = "UPDATE chat_poll SET chat_id = ?, question = ?, created_at = ?, ends_at = ?, is_closed = ?, "
                + "created_by = ? WHERE id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, poll.getChat() != null ? poll.getChat().getId() : null);
            stmt.setString(2, poll.getQuestion());
            stmt.setObject(3, poll.getCreatedAt());
            stmt.setObject(4, poll.getEndsAt());
            stmt.setBoolean(5, poll.getIsClosed());
            stmt.setObject(6, poll.getCreatedBy() != null ? poll.getCreatedBy().getId() : null);
            stmt.setLong(7, poll.getId());
            stmt.executeUpdate();
        }
    }

    private void insertOption(Connection conn, Long pollId, ChatPollOption option) throws SQLException {
        String sql = "INSERT INTO chat_poll_option (poll_id, text) VALUES (?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setLong(1, pollId);
            stmt.setString(2, option.getText());
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    option.setId(keys.getLong(1));
                }
            }
        }
    }

    private void insertVote(Connection conn, Long pollId, ChatPollVote vote) throws SQLException {
        String sql = "INSERT INTO chat_poll_vote (poll_id, option_id, user_id, created_at) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setLong(1, pollId);
            stmt.setObject(2, vote.getOption() != null ? vote.getOption().getId() : null);
            stmt.setObject(3, vote.getUser() != null ? vote.getUser().getId() : null);
            stmt.setObject(4, vote.getCreatedAt());
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    vote.setId(keys.getLong(1));
                }
            }
        }
    }

    private ChatPoll mapPoll(ResultSet rs) throws SQLException {
        ChatPoll poll = new ChatPollProxy(dataSource);
        poll.setId(rs.getLong("id"));
        Long chatId = (Long) rs.getObject("chat_id");
        if (chatId != null) {
            EventChat chat = new EventChatProxy(dataSource);
            chat.setId(chatId);
            poll.setChat(chat);
        }
        poll.setQuestion(rs.getString("question"));
        poll.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        poll.setEndsAt(rs.getObject("ends_at", LocalDateTime.class));
        poll.setIsClosed(rs.getBoolean("is_closed"));
        Long creatorId = (Long) rs.getObject("created_by");
        if (creatorId != null) {
            User creator = new UserProxy(dataSource);
            creator.setId(creatorId);
            poll.setCreatedBy(creator);
        }
        return poll;
    }
}
