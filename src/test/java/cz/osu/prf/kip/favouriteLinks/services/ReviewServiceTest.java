package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.dtos.ReviewCreateDto;
import cz.osu.prf.kip.favouriteLinks.dtos.ReviewDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.AppUser;
import cz.osu.prf.kip.favouriteLinks.model.entities.Movie;
import cz.osu.prf.kip.favouriteLinks.model.entities.Review;
import cz.osu.prf.kip.favouriteLinks.repositories.AppUserRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.MovieRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.RatingRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock(lenient = true)
    private SecurityContext securityContext;

    @Mock(lenient = true)
    private Authentication authentication;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private RatingRepository ratingRepository;

    @InjectMocks
    private ReviewService reviewService;

    private AppUser user;
    private Movie movie;
    private Review review;

    @BeforeEach
    void setUp() {
        user = new AppUser();
        user.setId(1L);
        user.setEmail("user@test.com");

        movie = new Movie();
        movie.setId(1L);
        movie.setTitle("Test Movie");

        review = new Review();
        review.setId(1L);
        review.setReviewText("Great movie!");
        review.setMovie(movie);
        review.setUser(user);

        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("user@test.com");
    }

    @Test
    void getReviewsByMovie_ShouldReturnReviews() {
        when(reviewRepository.findByMovieId(1L)).thenReturn(List.of(review));

        List<ReviewDto> result = reviewService.getReviewsByMovie(1L);

        assertEquals(1, result.size());
        assertEquals("Great movie!", result.get(0).getReviewText());
        verify(reviewRepository).findByMovieId(1L);
    }

    @Test
    void createReview_ShouldCreateReview() {
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        
        ReviewCreateDto createDto = new ReviewCreateDto();
        createDto.setMovieId(1L);
        createDto.setReviewText("Excellent!");

        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        ReviewDto result = reviewService.createReview(createDto);

        assertNotNull(result);
        verify(reviewRepository).save(any(Review.class));
    }

    @Test
    void deleteReview_ShouldDeleteReview() {
        reviewService.deleteReview(1L);

        verify(reviewRepository).deleteById(1L);
    }
}
