package cz.osu.prf.kip.favouriteLinks.controllers;

import cz.osu.prf.kip.favouriteLinks.dtos.FavouriteLinkCreateDto;
import cz.osu.prf.kip.favouriteLinks.dtos.FavouriteLinkDto;
import cz.osu.prf.kip.favouriteLinks.mappers.FavouriteLinkMapper;
import cz.osu.prf.kip.favouriteLinks.model.entities.FavouriteLink;
import cz.osu.prf.kip.favouriteLinks.services.FavouriteLinkService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/favourite-link")
public class FavouriteLinkController {

    private final FavouriteLinkService favouriteLinkService;
    private final FavouriteLinkMapper favouriteLinkMapper;

    public FavouriteLinkController(
            FavouriteLinkService favouriteLinkService,
            FavouriteLinkMapper favouriteLinkMapper) {
        this.favouriteLinkService = favouriteLinkService;
        this.favouriteLinkMapper = favouriteLinkMapper;
    }

    @PostMapping
    public void createLink(@RequestBody FavouriteLinkCreateDto data) {
        favouriteLinkService.create(data.urlAddress());
    }

    @GetMapping
    public List<FavouriteLinkDto> getAllLinks() {
        List<FavouriteLink> links = favouriteLinkService.getAll();
        List<FavouriteLinkDto> ret = links.stream()
                .map(favouriteLinkMapper::toDto)
                .toList();

        return ret;
    }

}
