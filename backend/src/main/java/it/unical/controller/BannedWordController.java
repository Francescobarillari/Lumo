package it.unical.controller;

import it.unical.service.ContentFilterService;
import it.unical.dto.moderation.ModerationCheckRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/moderation")
public class BannedWordController {
    private final ContentFilterService contentFilterService;

    public BannedWordController(ContentFilterService contentFilterService) {
        this.contentFilterService = contentFilterService;
    }

    @GetMapping("/banned-words")
    public List<String> getBannedWords() {
        return contentFilterService.getBannedPhrases();
    }

    @PostMapping("/check")
    public Map<String, Boolean> checkMessage(@RequestBody ModerationCheckRequest request) {
        boolean banned = contentFilterService.isBanned(request.content());
        return Map.of("banned", banned);
    }
}
