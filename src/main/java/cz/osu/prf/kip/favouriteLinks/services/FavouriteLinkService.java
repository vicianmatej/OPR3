package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.model.entities.FavouriteLink;
import cz.osu.prf.kip.favouriteLinks.repositories.FavouriteLinkRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavouriteLinkService {

    private final FavouriteLinkRepository favouriteLinkRepository;

    public FavouriteLinkService(FavouriteLinkRepository favouriteLinkRepository) {
        this.favouriteLinkRepository = favouriteLinkRepository;
    }

    public void create(String urlAddress) {

        FavouriteLink entity = new FavouriteLink();
        entity.setUrlAddress(urlAddress);

        favouriteLinkRepository.save(entity);

    }

    public List<FavouriteLink> getAll() {
        return favouriteLinkRepository.findAll();
    }
}
