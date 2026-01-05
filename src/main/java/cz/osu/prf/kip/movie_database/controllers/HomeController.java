package cz.osu.prf.kip.favouriteLinks.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/home")
public class HomeController {

    @GetMapping("/current-time")
    public String getCurrentTime() {
        return "Current server time: " + LocalDateTime.now();
    }

}
