package cz.osu.prf.kip.favouriteLinks.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDto {
    private Long id;
    private String reviewText;
    private Long movieId;
    private String movieTitle;
    private LocalDateTime createdAt;
}
