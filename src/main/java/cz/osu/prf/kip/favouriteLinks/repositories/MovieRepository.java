package cz.osu.prf.kip.favouriteLinks.repositories;

import cz.osu.prf.kip.favouriteLinks.model.entities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByTitleContainingIgnoreCase(String title);
    List<Movie> findByGenreIgnoreCase(String genre);
    List<Movie> findByReleaseYear(Integer releaseYear);
    
    @Query("SELECT m FROM Movie m WHERE " +
           "(:title IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:genre IS NULL OR LOWER(m.genre) = LOWER(:genre)) AND " +
           "(:year IS NULL OR m.releaseYear = :year)")
    List<Movie> findMoviesWithFilters(@Param("title") String title, 
                                     @Param("genre") String genre, 
                                     @Param("year") Integer year);
}