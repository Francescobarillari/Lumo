package it.unical.controller;

import it.unical.dto.moderation.ModerationCheckRequest;
import it.unical.service.ContentFilterService;
import org.springframework.web.bind.annotation.*;

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
