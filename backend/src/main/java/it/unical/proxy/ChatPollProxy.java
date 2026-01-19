package it.unical.proxy;

import it.unical.dao.base.DaoException;
import it.unical.model.ChatPoll;
import it.unical.model.ChatPollOption;
import it.unical.model.ChatPollVote;
import it.unical.model.User;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ChatPollProxy extends ChatPoll {
    private final DataSource dataSource;

    public ChatPollProxy(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<ChatPollOption> getOptions() {
        List<ChatPollOption> options = super.getOptions();
        if (options == null || options.isEmpty()) {
            options = loadOptions();
            super.setOptions(options);
        }
        return options;
    }

    @Override
    public List<ChatPollVote> getVotes() {
        List<ChatPollVote> votes = super.getVotes();
        if (votes == null || votes.isEmpty()) {
            votes = loadVotes();
            super.setVotes(votes);
        }
        return votes;
    }

    private List<ChatPollOption> loadOptions() {
        List<ChatPollOption> options = new ArrayList<>();
        if (dataSource == null || getId() == null) {
            return options;
        }
        String sql = "SELECT id, poll_id, text FROM chat_poll_option WHERE poll_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, getId());
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    ChatPollOption option = new ChatPollOption();
                    option.setId(rs.getLong("id"));
                    option.setText(rs.getString("text"));
                    option.setPoll(this);
                    options.add(option);
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("ChatPollProxy.loadOptions failed", ex);
        }
        return options;
    }

    private List<ChatPollVote> loadVotes() {
        List<ChatPollVote> votes = new ArrayList<>();
        if (dataSource == null || getId() == null) {
            return votes;
        }
        String sql = "SELECT v.id, v.poll_id, v.option_id, v.user_id, v.created_at, u.name, u.profile_image "
                + "FROM chat_poll_vote v LEFT JOIN users u ON v.user_id = u.id WHERE v.poll_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, getId());
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    votes.add(mapVote(rs));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("ChatPollProxy.loadVotes failed", ex);
        }
        return votes;
    }

    private ChatPollVote mapVote(ResultSet rs) throws SQLException {
        ChatPollVote vote = new ChatPollVote();
        vote.setId(rs.getLong("id"));
        vote.setPoll(this);

        Long optionId = (Long) rs.getObject("option_id");
        if (optionId != null) {
            ChatPollOption option = new ChatPollOption();
            option.setId(optionId);
            vote.setOption(option);
        }

        Long userId = (Long) rs.getObject("user_id");
        if (userId != null) {
            User user = new UserProxy(dataSource);
            user.setId(userId);
            user.setName(rs.getString("name"));
            user.setProfileImage(rs.getString("profile_image"));
            vote.setUser(user);
        }

        vote.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        return vote;
    }
}
