package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.dtos.RatingCreateDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.AppUser;
import cz.osu.prf.kip.favouriteLinks.model.entities.Movie;
import cz.osu.prf.kip.favouriteLinks.model.entities.Rating;
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
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock(lenient = true)
    private SecurityContext securityContext;

    @Mock(lenient = true)
    private Authentication authentication;

    @InjectMocks
    private RatingService ratingService;

    private AppUser user;
    private Movie movie;
    private Rating rating;
    private RatingCreateDto createDto;

    @BeforeEach
    void setUp() {
        user = new AppUser();
        user.setId(1L);
        user.setEmail("test@test.com");

        movie = new Movie();
        movie.setId(1L);
        movie.setTitle("Test Movie");

        rating = new Rating();
        rating.setId(1L);
        rating.setScore(5);
        rating.setUser(user);
        rating.setMovie(movie);

        createDto = new RatingCreateDto();
        createDto.setUserId(1L);
        createDto.setMovieId(1L);
        createDto.setScore(5);
    }

    @Test
    void createOrUpdateRating_ShouldCreateNewRating() {
        when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(ratingRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.empty());
        when(ratingRepository.save(any(Rating.class))).thenReturn(rating);

        Rating result = ratingService.createOrUpdateRating(createDto);

        assertNotNull(result);
        assertEquals(5, result.getScore());
        verify(ratingRepository).save(any(Rating.class));
    }

    @Test
    void createOrUpdateRating_ShouldUpdateExistingRating() {
        when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(ratingRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.of(rating));
        when(ratingRepository.save(any(Rating.class))).thenReturn(rating);

        createDto.setScore(4);
        Rating result = ratingService.createOrUpdateRating(createDto);

        assertNotNull(result);
        verify(ratingRepository).save(any(Rating.class));
    }

    @Test
    void createOrUpdateRating_ShouldThrowException_WhenUserNotFound() {
        when(appUserRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> ratingService.createOrUpdateRating(createDto));
    }

    @Test
    void createOrUpdateRating_ShouldThrowException_WhenMovieNotFound() {
        when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));
        when(movieRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> ratingService.createOrUpdateRating(createDto));
    }

    @Test
    void getAverageRating_ShouldReturnAverage() {
        when(movieRepository.existsById(1L)).thenReturn(true);
        when(ratingRepository.getAverageRatingForMovie(1L)).thenReturn(4.5);

        Double result = ratingService.getAverageRating(1L);

        assertEquals(4.5, result);
        verify(ratingRepository).getAverageRatingForMovie(1L);
    }

    @Test
    void getAverageRating_ShouldReturnZero_WhenNoRatings() {
        when(movieRepository.existsById(1L)).thenReturn(true);
        when(ratingRepository.getAverageRatingForMovie(1L)).thenReturn(null);

        Double result = ratingService.getAverageRating(1L);

        assertEquals(0.0, result);
    }

    @Test
    void getAverageRating_ShouldThrowException_WhenMovieNotFound() {
        when(movieRepository.existsById(1L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> ratingService.getAverageRating(1L));
    }

    @Test
    void deleteRating_ShouldDeleteRating() {
        when(ratingRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.of(rating));

        ratingService.deleteRating(1L, 1L);

        verify(ratingRepository).delete(rating);
    }

    @Test
    void deleteRating_ShouldThrowException_WhenNotFound() {
        when(ratingRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> ratingService.deleteRating(1L, 1L));
    }

    @Test
    void getUserRating_ShouldReturnScore() {
        when(ratingRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.of(rating));

        Integer result = ratingService.getUserRating(1L, 1L);

        assertEquals(5, result);
    }

    @Test
    void getUserRating_ShouldReturnNull_WhenNotFound() {
        when(ratingRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.empty());

        Integer result = ratingService.getUserRating(1L, 1L);

        assertNull(result);
    }

    @Test
    void getMyRatings_ShouldReturnRatings() {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("test@test.com");
        when(appUserRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(ratingRepository.findByUserId(1L)).thenReturn(List.of(rating));
        when(reviewRepository.findByUserId(1L)).thenReturn(List.of());

        var result = ratingService.getMyRatings();

        assertNotNull(result);
        assertEquals(1, result.size());
    }
}
