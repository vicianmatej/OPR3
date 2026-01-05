package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.dtos.WatchlistDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.AppUser;
import cz.osu.prf.kip.favouriteLinks.model.entities.Movie;
import cz.osu.prf.kip.favouriteLinks.model.entities.Watchlist;
import cz.osu.prf.kip.favouriteLinks.repositories.AppUserRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.MovieRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.WatchlistRepository;
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
class WatchlistServiceTest {

    @Mock
    private WatchlistRepository watchlistRepository;

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private WatchlistService watchlistService;

    private AppUser user;
    private Movie movie;
    private Watchlist watchlist;

    @BeforeEach
    void setUp() {
        user = new AppUser();
        user.setId(1L);
        user.setEmail("test@test.com");

        movie = new Movie();
        movie.setId(1L);
        movie.setTitle("Test Movie");

        watchlist = new Watchlist();
        watchlist.setId(1L);
        watchlist.setUser(user);
        watchlist.setMovie(movie);
        watchlist.setWatched(false);

        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("test@test.com");
    }

    @Test
    void getMyWatchlist_ShouldReturnWatchlist() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(watchlistRepository.findByUserId(1L)).thenReturn(List.of(watchlist));

        List<WatchlistDto> result = watchlistService.getMyWatchlist();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Movie", result.get(0).getMovieTitle());
        verify(watchlistRepository).findByUserId(1L);
    }

    @Test
    void addToWatchlist_ShouldAddMovie() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(watchlistRepository.existsByUserIdAndMovieId(1L, 1L)).thenReturn(false);
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(watchlistRepository.save(any(Watchlist.class))).thenReturn(watchlist);

        WatchlistDto result = watchlistService.addToWatchlist(1L);

        assertNotNull(result);
        assertEquals("Test Movie", result.getMovieTitle());
        verify(watchlistRepository).save(any(Watchlist.class));
    }

    @Test
    void addToWatchlist_ShouldThrowException_WhenAlreadyExists() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(watchlistRepository.existsByUserIdAndMovieId(1L, 1L)).thenReturn(true);

        assertThrows(RuntimeException.class, () -> watchlistService.addToWatchlist(1L));
        verify(watchlistRepository, never()).save(any());
    }

    @Test
    void addToWatchlist_ShouldThrowException_WhenMovieNotFound() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(watchlistRepository.existsByUserIdAndMovieId(1L, 1L)).thenReturn(false);
        when(movieRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> watchlistService.addToWatchlist(1L));
    }

    @Test
    void removeFromWatchlist_ShouldRemoveMovie() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(watchlistRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.of(watchlist));

        watchlistService.removeFromWatchlist(1L);

        verify(watchlistRepository).delete(watchlist);
    }

    @Test
    void removeFromWatchlist_ShouldThrowException_WhenNotFound() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(watchlistRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> watchlistService.removeFromWatchlist(1L));
    }

    @Test
    void markAsWatched_ShouldUpdateStatus() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(watchlistRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.of(watchlist));
        when(watchlistRepository.save(any(Watchlist.class))).thenReturn(watchlist);

        WatchlistDto result = watchlistService.markAsWatched(1L, true);

        assertNotNull(result);
        verify(watchlistRepository).save(watchlist);
    }

    @Test
    void markAsWatched_ShouldThrowException_WhenNotFound() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(watchlistRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> watchlistService.markAsWatched(1L, true));
    }
}
