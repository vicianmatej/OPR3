package cz.osu.prf.kip.favouriteLinks.controllers;

import cz.osu.prf.kip.favouriteLinks.dtos.RegisterDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.AppUser;
import cz.osu.prf.kip.favouriteLinks.services.AppUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/user")
public class AppUserController {

    private final AppUserService appUserService;
    private final PasswordEncoder passwordEncoder;

    public AppUserController(AppUserService appUserService, PasswordEncoder passwordEncoder) {
        this.appUserService = appUserService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping()
    public ResponseEntity<Void> create(@Valid @RequestBody RegisterDto request){
        AppUser newUser = new AppUser();
        newUser.setEmail(request.email());
        newUser.setPasswordHash(passwordEncoder.encode(request.password()));

        this.appUserService.save(newUser);
        
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
