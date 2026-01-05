package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.model.entities.AppUser;
import cz.osu.prf.kip.favouriteLinks.repositories.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserContextServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserContextService userContextService;

    private AppUser user;
    private AppUser adminUser;

    @BeforeEach
    void setUp() {
        user = new AppUser();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setRole("USER");

        adminUser = new AppUser();
        adminUser.setId(2L);
        adminUser.setEmail("admin@test.com");
        adminUser.setRole("ADMIN");

        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void getCurrentUser_ShouldReturnUser() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("test@test.com");
        when(appUserRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        AppUser result = userContextService.getCurrentUser();

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
        verify(appUserRepository).findByEmail("test@test.com");
    }

    @Test
    void getCurrentUser_ShouldThrowException_WhenNotAuthenticated() {
        when(securityContext.getAuthentication()).thenReturn(null);

        assertThrows(RuntimeException.class, () -> userContextService.getCurrentUser());
    }

    @Test
    void getCurrentUser_ShouldThrowException_WhenUserNotFound() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("test@test.com");
        when(appUserRepository.findByEmail("test@test.com")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userContextService.getCurrentUser());
    }

    @Test
    void isAdmin_ShouldReturnTrue_WhenUserIsAdmin() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("admin@test.com");
        when(appUserRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(adminUser));

        boolean result = userContextService.isAdmin();

        assertTrue(result);
    }

    @Test
    void isAdmin_ShouldReturnFalse_WhenUserIsNotAdmin() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("test@test.com");
        when(appUserRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        boolean result = userContextService.isAdmin();

        assertFalse(result);
    }

    @Test
    void isAdmin_ShouldReturnFalse_WhenExceptionOccurs() {
        when(securityContext.getAuthentication()).thenReturn(null);

        boolean result = userContextService.isAdmin();

        assertFalse(result);
    }

    @Test
    void getCurrentUserEmail_ShouldReturnEmail() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("test@test.com");

        String result = userContextService.getCurrentUserEmail();

        assertEquals("test@test.com", result);
    }

    @Test
    void getCurrentUserEmail_ShouldThrowException_WhenNotAuthenticated() {
        when(securityContext.getAuthentication()).thenReturn(null);

        assertThrows(RuntimeException.class, () -> userContextService.getCurrentUserEmail());
    }
}
