package cz.osu.prf.kip.favouriteLinks.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class MovieCreateDto {
    @NotBlank(message = "Název filmu je povinný")
    @Size(max = 200, message = "Název filmu může mít maximálně 200 znaků")
    private String title;

    @Size(max = 1000, message = "Popis může mít maximálně 1000 znaků")
    private String description;

    @Min(value = 1900, message = "Rok vydání musí být minimálně 1900")
    @Max(value = 2030, message = "Rok vydání může být maximálně 2030")
    private Integer releaseYear;

    @Size(max = 50, message = "Žánr může mít maximálně 50 znaků")
    private String genre;

    @Size(max = 100, message = "Režisér může mít maximálně 100 znaků")
    private String director;

    @Size(max = 500, message = "URL posteru může mít maximálně 500 znaků")
    private String posterUrl;
}