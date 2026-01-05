package cz.osu.prf.kip.favouriteLinks.controllers;

import cz.osu.prf.kip.favouriteLinks.dtos.WatchlistDto;
import cz.osu.prf.kip.favouriteLinks.services.WatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;

    @GetMapping
    public ResponseEntity<List<WatchlistDto>> getMyWatchlist() {
        return ResponseEntity.ok(watchlistService.getMyWatchlist());
    }

    @PostMapping("/{movieId}")
    public ResponseEntity<WatchlistDto> addToWatchlist(@PathVariable Long movieId) {
        return ResponseEntity.ok(watchlistService.addToWatchlist(movieId));
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<Void> removeFromWatchlist(@PathVariable Long movieId) {
        watchlistService.removeFromWatchlist(movieId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{movieId}/watched")
    public ResponseEntity<WatchlistDto> markAsWatched(@PathVariable Long movieId, @RequestParam Boolean watched) {
        return ResponseEntity.ok(watchlistService.markAsWatched(movieId, watched));
    }
}
