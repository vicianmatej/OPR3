package cz.osu.prf.kip.favouriteLinks.services;

import cz.osu.prf.kip.favouriteLinks.model.entities.AppUser;
import cz.osu.prf.kip.favouriteLinks.repositories.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppUserServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @InjectMocks
    private AppUserService appUserService;

    private AppUser user;

    @BeforeEach
    void setUp() {
        user = new AppUser();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setUsername("testuser");
        user.setPasswordHash("hashedPassword");
    }

    @Test
    void save_ShouldSaveUser() {
        when(appUserRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());
        when(appUserRepository.save(any(AppUser.class))).thenReturn(user);

        appUserService.save(user);

        verify(appUserRepository).save(user);
    }

    @Test
    void save_ShouldThrowException_WhenUserIsNull() {
        assertThrows(IllegalArgumentException.class, () -> appUserService.save(null));
        verify(appUserRepository, never()).save(any());
    }

    @Test
    void save_ShouldThrowException_WhenEmailExists() {
        when(appUserRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () -> appUserService.save(user));
        verify(appUserRepository, never()).save(any());
    }
}
