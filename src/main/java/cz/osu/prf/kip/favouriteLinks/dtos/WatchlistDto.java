package cz.osu.prf.kip.favouriteLinks.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class WatchlistDto {
    private Long id;
    private Long movieId;
    private String movieTitle;
    private String posterUrl;
    private Boolean watched;
    private LocalDateTime addedAt;
}
