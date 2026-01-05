package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.dtos.ReviewCreateDto;
import cz.osu.prf.kip.favouriteLinks.dtos.ReviewDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.AppUser;
import cz.osu.prf.kip.favouriteLinks.model.entities.Movie;
import cz.osu.prf.kip.favouriteLinks.model.entities.Review;
import cz.osu.prf.kip.favouriteLinks.repositories.AppUserRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.MovieRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.ReviewRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.RatingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final AppUserRepository userRepository;
    private final RatingRepository ratingRepository;

    private AppUser getCurrentUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Uživatel nebyl nalezen"));
    }

    public List<ReviewDto> getReviewsByMovie(Long movieId) {
        return reviewRepository.findByMovieId(movieId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ReviewDto> getMyReviews() {
        AppUser user = getCurrentUser();
        
        List<ReviewDto> result = new java.util.ArrayList<>();
        
        result.addAll(reviewRepository.findByUserId(user.getId()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList()));
        
        java.util.Set<Long> reviewedMovieIds = reviewRepository.findByUserId(user.getId()).stream()
                .map(r -> r.getMovie().getId())
                .collect(Collectors.toSet());
        
        ratingRepository.findByUserId(user.getId()).stream()
                .filter(rating -> !reviewedMovieIds.contains(rating.getMovie().getId()))
                .forEach(rating -> {
                    ReviewDto dto = new ReviewDto();
                    dto.setId(rating.getId());
                    dto.setReviewText("");
                    dto.setMovieId(rating.getMovie().getId());
                    dto.setMovieTitle(rating.getMovie().getTitle());
                    dto.setCreatedAt(rating.getCreatedAt());
                    dto.setUserRating(rating.getScore());
                    result.add(dto);
                });
        
        return result;
    }

    public ReviewDto createReview(ReviewCreateDto createDto) {
        AppUser user = getCurrentUser();
        Movie movie = movieRepository.findById(createDto.getMovieId())
                .orElseThrow(() -> new RuntimeException("Film nebyl nalezen"));

        Review review = new Review();
        review.setReviewText(createDto.getReviewText());
        review.setMovie(movie);
        review.setUser(user);

        Review saved = reviewRepository.save(review);
        return convertToDto(saved);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    private ReviewDto convertToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setReviewText(review.getReviewText());
        dto.setMovieId(review.getMovie().getId());
        dto.setMovieTitle(review.getMovie().getTitle());
        dto.setCreatedAt(review.getCreatedAt());
        
        ratingRepository.findByUserIdAndMovieId(review.getUser().getId(), review.getMovie().getId())
                .ifPresent(rating -> dto.setUserRating(rating.getScore()));
        
        return dto;
    }
}
