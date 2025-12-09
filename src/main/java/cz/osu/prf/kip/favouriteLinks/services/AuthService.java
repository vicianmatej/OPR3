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
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EntityAlreadyExistsException(AppUser.class, request.getEmail());
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new EntityAlreadyExistsException(AppUser.class, request.getUsername());
        }

        AppUser user = new AppUser();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
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
