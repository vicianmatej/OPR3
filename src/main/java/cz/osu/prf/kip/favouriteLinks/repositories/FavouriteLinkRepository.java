package cz.osu.prf.kip.favouriteLinks.repositories;

import cz.osu.prf.kip.favouriteLinks.model.entities.FavouriteLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavouriteLinkRepository extends JpaRepository<FavouriteLink, Integer> {
}
