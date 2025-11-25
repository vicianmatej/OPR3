package cz.osu.prf.kip.favouriteLinks.mappers;

import cz.osu.prf.kip.favouriteLinks.dtos.MovieCreateDto;
import cz.osu.prf.kip.favouriteLinks.dtos.MovieDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    
    MovieDto toDto(Movie movie);
    
    Movie toEntity(MovieCreateDto createDto);
    
    void updateEntityFromDto(MovieCreateDto updateDto, @MappingTarget Movie movie);
}
