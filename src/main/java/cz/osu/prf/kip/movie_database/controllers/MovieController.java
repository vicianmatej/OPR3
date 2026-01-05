package cz.osu.prf.kip.favouriteLinks.controllers;

import cz.osu.prf.kip.favouriteLinks.dtos.MovieCreateDto;
import cz.osu.prf.kip.favouriteLinks.dtos.MovieDto;
import cz.osu.prf.kip.favouriteLinks.services.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@Slf4j
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<List<MovieDto>> getAllMovies() {
        log.info("GET /api/movies - Načítání všech filmů");
        List<MovieDto> movies = movieService.getAllMovies();
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDto> getMovieById(@PathVariable Long id) {
        log.info("GET /api/movies/{} - Načítání filmu podle ID", id);
        MovieDto movie = movieService.getMovieById(id);
        return ResponseEntity.ok(movie);
    }

    @PostMapping
    public ResponseEntity<MovieDto> createMovie(@Valid @RequestBody MovieCreateDto createDto) {
        log.info("POST /api/movies - Vytváření nového filmu: {}", createDto.getTitle());
        MovieDto createdMovie = movieService.createMovie(createDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMovie);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovieDto> updateMovie(@PathVariable Long id, 
                                               @Valid @RequestBody MovieCreateDto updateDto) {
        log.info("PUT /api/movies/{} - Aktualizace filmu", id);
        MovieDto updatedMovie = movieService.updateMovie(id, updateDto);
        return ResponseEntity.ok(updatedMovie);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        log.info("DELETE /api/movies/{} - Mazání filmu", id);
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<MovieDto>> searchMovies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) Integer year) {
        log.info("GET /api/movies/search - Vyhledávání filmů s filtry");
        List<MovieDto> movies = movieService.searchMovies(title, genre, year);
        return ResponseEntity.ok(movies);
    }
}