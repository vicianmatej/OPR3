package cz.osu.prf.kip.favouriteLinks.dtos;

public record LoginResponseDto(String email, String token, java.time.LocalDateTime loginDateTime) {
}
