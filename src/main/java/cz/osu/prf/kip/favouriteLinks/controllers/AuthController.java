package cz.osu.prf.kip.favouriteLinks.controllers;

import cz.osu.prf.kip.favouriteLinks.dtos.LoginDto;
import cz.osu.prf.kip.favouriteLinks.dtos.LoginResponseDto;
import cz.osu.prf.kip.favouriteLinks.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponseDto login(@Valid @RequestBody LoginDto loginDto) {
        return authService.login(loginDto.email(), loginDto.password());
    }
}