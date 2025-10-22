package cz.osu.prf.kip.favouriteLinks.mappers;

import cz.osu.prf.kip.favouriteLinks.dtos.FavouriteLinkDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.FavouriteLink;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FavouriteLinkMapper {
    FavouriteLinkDto toDto(FavouriteLink favouriteLink);
}
