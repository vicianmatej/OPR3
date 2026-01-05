package cz.osu.prf.kip.favouriteLinks.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
    }

    @Test
    void generateToken_ShouldReturnToken() {
        String token = jwtService.generateToken("test@test.com");

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractEmail_ShouldReturnEmail() {
        String email = "test@test.com";
        String token = jwtService.generateToken(email);

        String extractedEmail = jwtService.extractEmail(token);

        assertEquals(email, extractedEmail);
    }

    @Test
    void isTokenValid_ShouldReturnTrue_WhenTokenValid() {
        String token = jwtService.generateToken("test@test.com");

        boolean isValid = jwtService.isTokenValid(token);

        assertTrue(isValid);
    }

    @Test
    void isTokenValid_ShouldReturnFalse_WhenTokenInvalid() {
        String invalidToken = "invalid.token.here";

        boolean isValid = jwtService.isTokenValid(invalidToken);

        assertFalse(isValid);
    }

    @Test
    void isTokenValid_ShouldReturnFalse_WhenTokenEmpty() {
        boolean isValid = jwtService.isTokenValid("");

        assertFalse(isValid);
    }
}
