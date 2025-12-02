package cz.osu.prf.kip.favouriteLinks.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email je povinný")
    @Email(message = "Neplatný email")
    private String email;

    @NotBlank(message = "Heslo je povinné")
    private String password;
}
