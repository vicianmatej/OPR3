package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.dtos.RatingCreateDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.Movie;
import cz.osu.prf.kip.favouriteLinks.model.entities.Rating;
import cz.osu.prf.kip.favouriteLinks.model.entities.User;
import cz.osu.prf.kip.favouriteLinks.repositories.MovieRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.RatingRepository;
import cz.osu.prf.kip.favouriteLinks.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RatingService {
    
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    public Rating createOrUpdateRating(RatingCreateDto createDto) {
        log.info("Vytváření/aktualizace hodnocení pro film ID: {} od uživatele ID: {}", 
                createDto.getMovieId(), createDto.getUserId());

        // Validace existence uživatele
        User user = userRepository.findById(createDto.getUserId())
                .orElseThrow(() -> {
                    log.error("Uživatel s ID {} nebyl nalezen", createDto.getUserId());
                    return new RuntimeException("Uživatel s ID " + createDto.getUserId() + " nebyl nalezen");
                });

        // Validace existence filmu
        Movie movie = movieRepository.findById(createDto.getMovieId())
                .orElseThrow(() -> {
                    log.error("Film s ID {} nebyl nalezen", createDto.getMovieId());
                    return new RuntimeException("Film s ID " + createDto.getMovieId() + " nebyl nalezen");
                });

        // Kontrola, zda už uživatel film hodnotil
        Optional<Rating> existingRating = ratingRepository.findByUserIdAndMovieId(
                createDto.getUserId(), createDto.getMovieId());

        Rating rating;
        if (existingRating.isPresent()) {
            // Aktualizace existujícího hodnocení
            rating = existingRating.get();
            rating.setScore(createDto.getScore());
            log.info("Aktualizace existujícího hodnocení s ID: {}", rating.getId());
        } else {
            // Vytvoření nového hodnocení
            rating = new Rating();
            rating.setScore(createDto.getScore());
            rating.setUser(user);
            rating.setMovie(movie);
            log.info("Vytváření nového hodnocení");
        }

        Rating savedRating = ratingRepository.save(rating);
        log.info("Hodnocení bylo úspěšně uloženo s ID: {}", savedRating.getId());
        
        return savedRating;
    }

    public Double getAverageRating(Long movieId) {
        log.info("Načítání průměrného hodnocení pro film ID: {}", movieId);
        
        if (!movieRepository.existsById(movieId)) {
            log.error("Film s ID {} nebyl nalezen", movieId);
            throw new RuntimeException("Film s ID " + movieId + " nebyl nalezen");
        }
        
        Double average = ratingRepository.getAverageRatingForMovie(movieId);
        log.info("Průměrné hodnocení pro film ID {}: {}", movieId, average);
        
        return average != null ? average : 0.0;
    }

    public void deleteRating(Long userId, Long movieId) {
        log.info("Mazání hodnocení pro film ID: {} od uživatele ID: {}", movieId, userId);
        
        Rating rating = ratingRepository.findByUserIdAndMovieId(userId, movieId)
                .orElseThrow(() -> {
                    log.error("Hodnocení pro film ID {} od uživatele ID {} nebylo nalezeno", movieId, userId);
                    return new RuntimeException("Hodnocení nebylo nalezeno");
                });
        
        ratingRepository.delete(rating);
        log.info("Hodnocení bylo úspěšně smazáno");
    }
}