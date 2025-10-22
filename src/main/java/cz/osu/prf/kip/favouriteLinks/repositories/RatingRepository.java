package cz.osu.prf.kip.favouriteLinks.repositories;

import cz.osu.prf.kip.favouriteLinks.model.entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserIdAndMovieId(Long userId, Long movieId);
    List<Rating> findByMovieId(Long movieId);
    List<Rating> findByUserId(Long userId);
    
    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.movie.id = :movieId")
    Double getAverageRatingForMovie(@Param("movieId") Long movieId);
}