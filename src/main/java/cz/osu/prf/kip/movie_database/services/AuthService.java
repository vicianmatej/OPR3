package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.dtos.LoginRequest;
import cz.osu.prf.kip.favouriteLinks.dtos.LoginResponse;
import cz.osu.prf.kip.favouriteLinks.dtos.RegisterRequest;
import cz.osu.prf.kip.favouriteLinks.exceptions.EntityAlreadyExistsException;
import cz.osu.prf.kip.favouriteLinks.exceptions.UnauthorizedException;
import cz.osu.prf.kip.favouriteLinks.model.entities.AppUser;
import cz.osu.prf.kip.favouriteLinks.repositories.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Pro šifrování hesel
    private final JwtService jwtService; // Pro generování JWT tokenů

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email " + request.getEmail() + " je již registrován");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Uživatelské jméno " + request.getUsername() + " je již obsazeno");
        }

        AppUser user = new AppUser();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword())); // Šifruje heslo pomocí BCrypt
        user.setRole("USER"); // Noví uživatelé mají vždy roli USER
        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new LoginResponse(token, user.getEmail(), user.getId(), user.getRole());
    }

    public LoginResponse login(LoginRequest request) {
        AppUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Neplatné přihlašovací údaje"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Neplatné přihlašovací údaje");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new LoginResponse(token, user.getEmail(), user.getId(), user.getRole());
    }
}
