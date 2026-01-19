package it.unical.service;

import it.unical.model.BannedWord;
import it.unical.dao.impl.BannedWordDao;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class ContentFilterService {
    private final BannedWordDao bannedWordRepository;
    private final List<Pattern> patterns = new ArrayList<>();
    private final List<String> rawExact = new ArrayList<>();
    private final Object lock = new Object();
    private volatile boolean loaded = false;

    public ContentFilterService(BannedWordDao bannedWordRepository) {
        this.bannedWordRepository = bannedWordRepository;
    }

    public boolean isBanned(String content) {
        if (content == null || content.isBlank()) {
            return false;
        }
        ensureLoaded();
        for (String raw : rawExact) {
            if (!raw.isEmpty() && content.contains(raw)) {
                return true;
            }
        }
        String normalized = normalize(content);
        if (normalized.isEmpty()) {
            return false;
        }
        for (Pattern pattern : patterns) {
            if (pattern.matcher(normalized).find()) {
                return true;
            }
        }
        return false;
    }

    public List<String> getBannedPhrases() {
        List<BannedWord> words = bannedWordRepository.findAll();
        List<String> phrases = new ArrayList<>();
        for (BannedWord word : words) {
            phrases.add(word.getPhrase());
        }
        return phrases;
    }

    public void refresh() {
        synchronized (lock) {
            patterns.clear();
            rawExact.clear();
            List<String> phrases = new ArrayList<>();
            List<BannedWord> stored = bannedWordRepository.findAll();
            for (BannedWord word : stored) {
                if (word.getPhrase() != null) {
                    phrases.add(word.getPhrase());
                }
            }
            if (phrases.isEmpty()) {
                phrases = loadFromResource();
                for (String phrase : phrases) {
                    if (bannedWordRepository.findByPhrase(phrase).isPresent()) {
                        continue;
                    }
                    BannedWord word = new BannedWord();
                    word.setPhrase(phrase);
                    bannedWordRepository.save(word);
                }
            }
            for (String phrase : phrases) {
                if (phrase == null || phrase.isBlank()) {
                    continue;
                }
                String normalized = normalize(phrase);
                if (normalized.isEmpty()) {
                    rawExact.add(phrase);
                    continue;
                }
                String regex = buildPhrasePattern(normalized);
                patterns.add(Pattern.compile(regex));
            }
            loaded = true;
        }
    }

    public String normalizeForStorage(String input) {
        return normalize(input);
    }

    private void ensureLoaded() {
        if (!loaded) {
            refresh();
        }
    }

    private String normalize(String input) {
        if (input == null) {
            return "";
        }
        String lower = input.toLowerCase(Locale.ROOT);
        String leet = replaceLeet(lower);
        String noDiacritics = Normalizer.normalize(leet, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "");
        String cleaned = noDiacritics.replaceAll("[^a-z0-9]+", " ").trim();
        return cleaned.replaceAll("\\s+", " ");
    }

    private String replaceLeet(String input) {
        StringBuilder builder = new StringBuilder(input.length());
        for (int i = 0; i < input.length(); i++) {
            char c = input.charAt(i);
            builder.append(mapLeet(c));
        }
        return builder.toString();
    }

    private List<String> loadFromResource() {
        List<String> phrases = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource("banned-words.txt");
        if (!resource.exists()) {
            return phrases;
        }
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String trimmed = line.trim();
                if (!trimmed.isEmpty() && !trimmed.startsWith("#")) {
                    phrases.add(trimmed);
                }
            }
        } catch (Exception ignored) {
        }
        return phrases;
    }

    private char mapLeet(char c) {
        switch (c) {
            case '@':
                return 'a';
            case '0':
                return 'o';
            case '1':
            case '!':
                return 'i';
            case '3':
                return 'e';
            case '4':
                return 'a';
            case '5':
            case '$':
                return 's';
            case '7':
                return 't';
            case '8':
                return 'b';
            default:
                return c;
        }
    }

    private String buildPhrasePattern(String normalizedPhrase) {
        String[] tokens = normalizedPhrase.split("\\s+");
        List<String> tokenPatterns = new ArrayList<>();
        for (String token : tokens) {
            if (!token.isEmpty()) {
                tokenPatterns.add(buildTokenPattern(token));
            }
        }
        String joined = String.join("\\s+", tokenPatterns);
        return "(?:^|\\s)" + joined + "(?:\\s|$)";
    }

    private String buildTokenPattern(String token) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < token.length(); i++) {
            if (i > 0) {
                builder.append("\\s*");
            }
            builder.append(Pattern.quote(String.valueOf(token.charAt(i))));
        }
        return builder.toString();
    }
}
