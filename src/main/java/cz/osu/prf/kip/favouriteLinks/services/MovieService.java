package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.dtos.MovieCreateDto;
import cz.osu.prf.kip.favouriteLinks.dtos.MovieDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.Movie;
import cz.osu.prf.kip.favouriteLinks.repositories.MovieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MovieService {
    
    private final MovieRepository movieRepository;

    public List<MovieDto> getAllMovies() {
        log.info("Načítání všech filmů");
        return movieRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public MovieDto getMovieById(Long id) {
        log.info("Načítání filmu s ID: {}", id);
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Film s ID {} nebyl nalezen", id);
                    return new RuntimeException("Film s ID " + id + " nebyl nalezen");
                });
        return convertToDto(movie);
    }

    public MovieDto createMovie(MovieCreateDto createDto) {
        log.info("Vytváření nového filmu: {}", createDto.getTitle());
        
        Movie movie = new Movie();
        movie.setTitle(createDto.getTitle());
        movie.setDescription(createDto.getDescription());
        movie.setReleaseYear(createDto.getReleaseYear());
        movie.setGenre(createDto.getGenre());
        movie.setDirector(createDto.getDirector());
        movie.setPosterUrl(createDto.getPosterUrl());

        Movie savedMovie = movieRepository.save(movie);
        log.info("Film byl úspěšně vytvořen s ID: {}", savedMovie.getId());
        
        return convertToDto(savedMovie);
    }

    public MovieDto updateMovie(Long id, MovieCreateDto updateDto) {
        log.info("Aktualizace filmu s ID: {}", id);
        
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Film s ID {} nebyl nalezen pro aktualizaci", id);
                    return new RuntimeException("Film s ID " + id + " nebyl nalezen");
                });

        movie.setTitle(updateDto.getTitle());
        movie.setDescription(updateDto.getDescription());
        movie.setReleaseYear(updateDto.getReleaseYear());
        movie.setGenre(updateDto.getGenre());
        movie.setDirector(updateDto.getDirector());
        movie.setPosterUrl(updateDto.getPosterUrl());

        Movie updatedMovie = movieRepository.save(movie);
        log.info("Film s ID {} byl úspěšně aktualizován", id);
        
        return convertToDto(updatedMovie);
    }

    public void deleteMovie(Long id) {
        log.info("Mazání filmu s ID: {}", id);
        
        if (!movieRepository.existsById(id)) {
            log.error("Film s ID {} nebyl nalezen pro smazání", id);
            throw new RuntimeException("Film s ID " + id + " nebyl nalezen");
        }
        
        movieRepository.deleteById(id);
        log.info("Film s ID {} byl úspěšně smazán", id);
    }

    public List<MovieDto> searchMovies(String title, String genre, Integer year) {
        log.info("Vyhledávání filmů s filtry - název: {}, žánr: {}, rok: {}", title, genre, year);
        
        return movieRepository.findMoviesWithFilters(title, genre, year).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private MovieDto convertToDto(Movie movie) {
        MovieDto dto = new MovieDto();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setDescription(movie.getDescription());
        dto.setReleaseYear(movie.getReleaseYear());
        dto.setGenre(movie.getGenre());
        dto.setDirector(movie.getDirector());
        dto.setPosterUrl(movie.getPosterUrl());
        dto.setCreatedAt(movie.getCreatedAt());
        return dto;
    }
}