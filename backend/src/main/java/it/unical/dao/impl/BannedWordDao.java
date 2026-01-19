package it.unical.dao.impl;

import it.unical.dao.base.DaoException;

import it.unical.model.BannedWord;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class BannedWordDao {
    private final DataSource dataSource;

    public BannedWordDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Optional<BannedWord> findByPhrase(String phrase) {
        String sql = "SELECT id, phrase FROM banned_word WHERE phrase = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, phrase);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapWord(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new DaoException("BannedWordDao.findByPhrase failed", ex);
        }
    }

    public List<BannedWord> findAll() {
        String sql = "SELECT id, phrase FROM banned_word";
        List<BannedWord> words = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                words.add(mapWord(rs));
            }
            return words;
        } catch (SQLException ex) {
            throw new DaoException("BannedWordDao.findAll failed", ex);
        }
    }

    public BannedWord save(BannedWord word) {
        if (word == null) {
            throw new IllegalArgumentException("BannedWordDao.save word is null");
        }
        if (word.getId() == null) {
            insertWord(word);
        } else {
            updateWord(word);
        }
        return word;
    }

    private void insertWord(BannedWord word) {
        String sql = "INSERT INTO banned_word (phrase) VALUES (?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, word.getPhrase());
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    word.setId(keys.getLong(1));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("BannedWordDao.insertWord failed", ex);
        }
    }

    private void updateWord(BannedWord word) {
        String sql = "UPDATE banned_word SET phrase = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, word.getPhrase());
            stmt.setLong(2, word.getId());
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("BannedWordDao.updateWord failed", ex);
        }
    }

    private BannedWord mapWord(ResultSet rs) throws SQLException {
        BannedWord word = new BannedWord();
        word.setId(rs.getLong("id"));
        word.setPhrase(rs.getString("phrase"));
        return word;
    }
}
