package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.dtos.WatchlistDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.AppUser;
import cz.osu.prf.kip.favouriteLinks.model.entities.Movie;
import cz.osu.prf.kip.favouriteLinks.model.entities.Watchlist;
import cz.osu.prf.kip.favouriteLinks.repositories.AppUserRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.MovieRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.WatchlistRepository;
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
public class WatchlistService {
    
    private final WatchlistRepository watchlistRepository;
    private final MovieRepository movieRepository;
    private final AppUserRepository userRepository;

    private AppUser getCurrentUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Uživatel nebyl nalezen"));
    }

    public List<WatchlistDto> getMyWatchlist() {
        AppUser user = getCurrentUser();
        return watchlistRepository.findByUserId(user.getId()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public WatchlistDto addToWatchlist(Long movieId) {
        AppUser user = getCurrentUser();
        
        if (watchlistRepository.existsByUserIdAndMovieId(user.getId(), movieId)) {
            throw new RuntimeException("Film už je ve watchlistu");
        }

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Film nebyl nalezen"));

        Watchlist watchlist = new Watchlist();
        watchlist.setUser(user);
        watchlist.setMovie(movie);
        watchlist.setWatched(false);

        Watchlist saved = watchlistRepository.save(watchlist);
        return convertToDto(saved);
    }

    public void removeFromWatchlist(Long movieId) {
        AppUser user = getCurrentUser();
        Watchlist watchlist = watchlistRepository.findByUserIdAndMovieId(user.getId(), movieId)
                .orElseThrow(() -> new RuntimeException("Film není ve watchlistu"));
        watchlistRepository.delete(watchlist);
    }

    public WatchlistDto markAsWatched(Long movieId, Boolean watched) {
        AppUser user = getCurrentUser();
        Watchlist watchlist = watchlistRepository.findByUserIdAndMovieId(user.getId(), movieId)
                .orElseThrow(() -> new RuntimeException("Film není ve watchlistu"));
        watchlist.setWatched(watched);
        Watchlist saved = watchlistRepository.save(watchlist);
        return convertToDto(saved);
    }

    private WatchlistDto convertToDto(Watchlist watchlist) {
        WatchlistDto dto = new WatchlistDto();
        dto.setId(watchlist.getId());
        dto.setMovieId(watchlist.getMovie().getId());
        dto.setMovieTitle(watchlist.getMovie().getTitle());
        dto.setPosterUrl(watchlist.getMovie().getPosterUrl());
        dto.setWatched(watchlist.getWatched());
        dto.setAddedAt(watchlist.getAddedAt());
        return dto;
    }
}
