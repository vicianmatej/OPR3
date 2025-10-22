package cz.osu.prf.kip.favouriteLinks.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MovieDto {
    private Long id;
    private String title;
    private String description;
    private Integer releaseYear;
    private String genre;
    private String director;
    private String posterUrl;
    private LocalDateTime createdAt;
}