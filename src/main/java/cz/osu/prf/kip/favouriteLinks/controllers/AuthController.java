package cz.osu.prf.kip.favouriteLinks.controllers;

import cz.osu.prf.kip.favouriteLinks.dtos.LoginDto;
import cz.osu.prf.kip.favouriteLinks.dtos.LoginResponseDto;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public LoginResponseDto login(@RequestBody LoginDto loginDto)
    {
        LoginResponseDto ret =new LoginResponseDto(
                loginDto.email(), "dummy-token", java.time.LocalDateTime.now());
        return ret;
    }

}


