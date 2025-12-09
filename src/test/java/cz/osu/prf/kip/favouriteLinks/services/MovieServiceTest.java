package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.dtos.MovieCreateDto;
import cz.osu.prf.kip.favouriteLinks.dtos.MovieDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.AppUser;
import cz.osu.prf.kip.favouriteLinks.model.entities.Movie;
import cz.osu.prf.kip.favouriteLinks.repositories.AppUserRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.MovieRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.RatingRepository;
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
class MovieServiceTest {

    @Mock(lenient = true)
    private SecurityContext securityContext;

    @Mock(lenient = true)
    private Authentication authentication;

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private RatingRepository ratingRepository;

    @InjectMocks
    private MovieService movieService;

    private AppUser adminUser;
    private Movie movie;

    @BeforeEach
    void setUp() {
        adminUser = new AppUser();
        adminUser.setId(1L);
        adminUser.setEmail("admin@test.com");
        adminUser.setRole("ADMIN");

        movie = new Movie();
        movie.setId(1L);
        movie.setTitle("Test Movie");
        movie.setDescription("Test Description");
        movie.setReleaseYear(2024);
        movie.setGenre("Action");
        movie.setDirector("Test Director");
        movie.setUser(adminUser);

        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("admin@test.com");
    }

    @Test
    void getAllMovies_ShouldReturnAllMovies() {
        when(movieRepository.findAll()).thenReturn(List.of(movie));
        when(ratingRepository.getAverageRatingForMovie(1L)).thenReturn(4.5);
        when(ratingRepository.getRatingCountForMovie(1L)).thenReturn(10);

        List<MovieDto> result = movieService.getAllMovies();

        assertEquals(1, result.size());
        assertEquals("Test Movie", result.get(0).getTitle());
        verify(movieRepository).findAll();
    }

    @Test
    void getMovieById_ShouldReturnMovie() {
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(ratingRepository.getAverageRatingForMovie(1L)).thenReturn(4.5);
        when(ratingRepository.getRatingCountForMovie(1L)).thenReturn(10);

        MovieDto result = movieService.getMovieById(1L);

        assertNotNull(result);
        assertEquals("Test Movie", result.getTitle());
        verify(movieRepository).findById(1L);
    }

    @Test
    void getMovieById_ShouldThrowException_WhenNotFound() {
        when(movieRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> movieService.getMovieById(999L));
    }

    @Test
    void createMovie_ShouldCreateMovie_WhenUserIsAdmin() {
        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(adminUser));
        
        MovieCreateDto createDto = new MovieCreateDto();
        createDto.setTitle("New Movie");
        createDto.setDescription("New Description");
        createDto.setReleaseYear(2024);
        createDto.setGenre("Drama");
        createDto.setDirector("New Director");

        when(movieRepository.save(any(Movie.class))).thenReturn(movie);
        when(ratingRepository.getAverageRatingForMovie(any())).thenReturn(0.0);
        when(ratingRepository.getRatingCountForMovie(any())).thenReturn(0);

        MovieDto result = movieService.createMovie(createDto);

        assertNotNull(result);
        verify(movieRepository).save(any(Movie.class));
    }

    @Test
    void deleteMovie_ShouldDeleteMovie_WhenExists() {
        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(adminUser));
        when(movieRepository.existsById(1L)).thenReturn(true);

        movieService.deleteMovie(1L);

        verify(movieRepository).deleteById(1L);
    }

    @Test
    void searchMovies_ShouldFilterByTitle() {
        when(movieRepository.findAll()).thenReturn(List.of(movie));
        when(ratingRepository.getAverageRatingForMovie(1L)).thenReturn(4.5);
        when(ratingRepository.getRatingCountForMovie(1L)).thenReturn(10);

        List<MovieDto> result = movieService.searchMovies("Test", null, null);

        assertEquals(1, result.size());
        assertEquals("Test Movie", result.get(0).getTitle());
    }
}
