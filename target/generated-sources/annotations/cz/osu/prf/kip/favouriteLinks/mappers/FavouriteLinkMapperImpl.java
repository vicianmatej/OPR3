package cz.osu.prf.kip.favouriteLinks.mappers;

import cz.osu.prf.kip.favouriteLinks.dtos.FavouriteLinkDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.FavouriteLink;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-22T13:27:50+0200",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class FavouriteLinkMapperImpl implements FavouriteLinkMapper {

    @Override
    public FavouriteLinkDto toDto(FavouriteLink favouriteLink) {
        if ( favouriteLink == null ) {
            return null;
        }

        Integer id = null;
        String urlAddress = null;
        String label = null;

        id = favouriteLink.getId();
        urlAddress = favouriteLink.getUrlAddress();
        label = favouriteLink.getLabel();

        FavouriteLinkDto favouriteLinkDto = new FavouriteLinkDto( id, urlAddress, label );

        return favouriteLinkDto;
    }
}
