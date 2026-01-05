package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.model.entities.AppUser;
import cz.osu.prf.kip.favouriteLinks.repositories.AppUserRepository;
import org.springframework.stereotype.Service;

@Service
public class AppUserService {
    
    private final AppUserRepository appUserRepository;
    
    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }
    
    public void save(AppUser newUser) {
        if (newUser == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        
        if (appUserRepository.findByEmail(newUser.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }
        
        appUserRepository.save(newUser);
    }
}