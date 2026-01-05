package cz.osu.prf.kip.favouriteLinks.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RatingCreateDto {
    @NotNull(message = "Hodnocení je povinné")
    @Min(value = 1, message = "Hodnocení musí být minimálně 1")
    @Max(value = 5, message = "Hodnocení může být maximálně 5")
    private Integer score;

    @NotNull(message = "ID uživatele je povinné")
    private Long userId;

    @NotNull(message = "ID filmu je povinné")
    private Long movieId;
}