package cz.osu.prf.kip.favouriteLinks.dtos;

import lombok.Data;

@Data
public class ReviewCreateDto {
    private String reviewText;
    private Long movieId;
}
