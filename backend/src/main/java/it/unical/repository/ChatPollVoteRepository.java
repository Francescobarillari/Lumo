package it.unical.repository;

import it.unical.model.ChatPoll;
import it.unical.model.ChatPollOption;
import it.unical.model.ChatPollVote;
import it.unical.model.User;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ChatPollVoteRepository {
    private final DataSource dataSource;

    public ChatPollVoteRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<ChatPollVote> findByPoll_Id(Long pollId) {
        String sql = "SELECT v.id, v.poll_id, v.option_id, v.user_id, v.created_at, "
                + "u.name, u.profile_image "
                + "FROM chat_poll_vote v "
                + "LEFT JOIN users u ON v.user_id = u.id "
                + "WHERE v.poll_id = ?";
        List<ChatPollVote> votes = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, pollId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    votes.add(mapVote(rs));
                }
            }
            return votes;
        } catch (SQLException ex) {
            throw new DaoException("ChatPollVoteRepository.findByPoll_Id failed", ex);
        }
    }

    public void deleteByPoll_IdAndUser_Id(Long pollId, Long userId) {
        String sql = "DELETE FROM chat_poll_vote WHERE poll_id = ? AND user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, pollId);
            stmt.setLong(2, userId);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("ChatPollVoteRepository.deleteByPoll_IdAndUser_Id failed", ex);
        }
    }

    public ChatPollVote save(ChatPollVote vote) {
        if (vote == null) {
            throw new IllegalArgumentException("ChatPollVoteRepository.save vote is null");
        }
        if (vote.getId() == null) {
            insertVote(vote);
        } else {
            updateVote(vote);
        }
        return vote;
    }

    private void insertVote(ChatPollVote vote) {
        String sql = "INSERT INTO chat_poll_vote (poll_id, option_id, user_id, created_at) VALUES (?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setObject(1, vote.getPoll() != null ? vote.getPoll().getId() : null);
            stmt.setObject(2, vote.getOption() != null ? vote.getOption().getId() : null);
            stmt.setObject(3, vote.getUser() != null ? vote.getUser().getId() : null);
            stmt.setObject(4, vote.getCreatedAt());
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    vote.setId(keys.getLong(1));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("ChatPollVoteRepository.insertVote failed", ex);
        }
    }

    private void updateVote(ChatPollVote vote) {
        String sql = "UPDATE chat_poll_vote SET poll_id = ?, option_id = ?, user_id = ?, created_at = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, vote.getPoll() != null ? vote.getPoll().getId() : null);
            stmt.setObject(2, vote.getOption() != null ? vote.getOption().getId() : null);
            stmt.setObject(3, vote.getUser() != null ? vote.getUser().getId() : null);
            stmt.setObject(4, vote.getCreatedAt());
            stmt.setLong(5, vote.getId());
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("ChatPollVoteRepository.updateVote failed", ex);
        }
    }

    private ChatPollVote mapVote(ResultSet rs) throws SQLException {
        ChatPollVote vote = new ChatPollVote();
        vote.setId(rs.getLong("id"));

        Long pollId = (Long) rs.getObject("poll_id");
        if (pollId != null) {
            ChatPoll poll = new ChatPoll();
            poll.setId(pollId);
            vote.setPoll(poll);
        }

        Long optionId = (Long) rs.getObject("option_id");
        if (optionId != null) {
            ChatPollOption option = new ChatPollOption();
            option.setId(optionId);
            vote.setOption(option);
        }

        Long userId = (Long) rs.getObject("user_id");
        if (userId != null) {
            User user = new User();
            user.setId(userId);
            user.setName(rs.getString("name"));
            user.setProfileImage(rs.getString("profile_image"));
            vote.setUser(user);
        }

        vote.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        return vote;
    }
}
