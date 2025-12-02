package cz.osu.prf.kip.favouriteLinks.controllers;

import cz.osu.prf.kip.favouriteLinks.dtos.ReviewCreateDto;
import cz.osu.prf.kip.favouriteLinks.dtos.ReviewDto;
import cz.osu.prf.kip.favouriteLinks.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ReviewDto>> getReviewsByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(reviewService.getReviewsByMovie(movieId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReviewDto>> getMyReviews() {
        return ResponseEntity.ok(reviewService.getMyReviews());
    }

    @PostMapping
    public ResponseEntity<ReviewDto> createReview(@RequestBody ReviewCreateDto createDto) {
        return ResponseEntity.ok(reviewService.createReview(createDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }
}
