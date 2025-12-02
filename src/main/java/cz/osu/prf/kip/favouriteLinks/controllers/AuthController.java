package cz.osu.prf.kip.favouriteLinks.controllers;

import cz.osu.prf.kip.favouriteLinks.dtos.LoginRequest;
import cz.osu.prf.kip.favouriteLinks.dtos.LoginResponse;
import cz.osu.prf.kip.favouriteLinks.dtos.RegisterRequest;
import cz.osu.prf.kip.favouriteLinks.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
