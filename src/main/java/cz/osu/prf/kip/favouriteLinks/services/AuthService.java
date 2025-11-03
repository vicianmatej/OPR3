package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.dtos.LoginResponseDto;
import cz.osu.prf.kip.favouriteLinks.model.entities.AppUser;
import cz.osu.prf.kip.favouriteLinks.repositories.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponseDto login(String email, String password) {
        Optional<AppUser> appUser = appUserRepository.findByEmail(email);
        if (appUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        AppUser user = appUser.get();
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }
        
        String token = jwtService.generateToken(user.getEmail());
        return new LoginResponseDto(user.getEmail(), token, LocalDateTime.now());
    }
}