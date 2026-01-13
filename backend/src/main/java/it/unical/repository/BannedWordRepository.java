package it.unical.repository;

import it.unical.model.BannedWord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BannedWordRepository extends JpaRepository<BannedWord, Long> {
    Optional<BannedWord> findByPhrase(String phrase);
}
