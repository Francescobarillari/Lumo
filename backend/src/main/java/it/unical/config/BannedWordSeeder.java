package it.unical.config;

import it.unical.model.BannedWord;
import it.unical.repository.BannedWordRepository;
import it.unical.service.ContentFilterService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Component
public class BannedWordSeeder implements CommandLineRunner {
    private final BannedWordRepository bannedWordRepository;
    private final ContentFilterService contentFilterService;

    public BannedWordSeeder(BannedWordRepository bannedWordRepository, ContentFilterService contentFilterService) {
        this.bannedWordRepository = bannedWordRepository;
        this.contentFilterService = contentFilterService;
    }

    @Override
    public void run(String... args) throws Exception {
        ClassPathResource resource = new ClassPathResource("banned-words.txt");
        if (!resource.exists()) {
            return;
        }
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String trimmed = line.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("#")) {
                    continue;
                }
                if (bannedWordRepository.findByPhrase(trimmed).isPresent()) {
                    continue;
                }
                BannedWord word = new BannedWord();
                word.setPhrase(trimmed);
                bannedWordRepository.save(word);
            }
        }
        contentFilterService.refresh();
    }
}
