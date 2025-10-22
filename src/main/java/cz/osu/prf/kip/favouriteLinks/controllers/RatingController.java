package cz.osu.prf.kip.favouriteLinks.controllers;

import cz.osu.prf.kip.favouriteLinks.dtos.RatingCreateDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.Rating;
import cz.osu.prf.kip.favouriteLinks.services.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
@Slf4j
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<Rating> createOrUpdateRating(@Valid @RequestBody RatingCreateDto createDto) {
        log.info("POST /api/ratings - Vytváření/aktualizace hodnocení");
        Rating rating = ratingService.createOrUpdateRating(createDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(rating);
    }

    @GetMapping("/movie/{movieId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long movieId) {
        log.info("GET /api/ratings/movie/{}/average - Načítání průměrného hodnocení", movieId);
        Double average = ratingService.getAverageRating(movieId);
        return ResponseEntity.ok(average);
    }

    @DeleteMapping("/user/{userId}/movie/{movieId}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long userId, @PathVariable Long movieId) {
        log.info("DELETE /api/ratings/user/{}/movie/{} - Mazání hodnocení", userId, movieId);
        ratingService.deleteRating(userId, movieId);
        return ResponseEntity.noContent().build();
    }
}