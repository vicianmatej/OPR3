package cz.osu.prf.kip.favouriteLinks.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Email je povinný")
    @Email(message = "Neplatný email")
    private String email;

    @NotBlank(message = "Uživatelské jméno je povinné")
    @Size(min = 3, max = 50, message = "Uživatelské jméno musí mít 3-50 znaků")
    private String username;

    @NotBlank(message = "Heslo je povinné")
    @Size(min = 6, message = "Heslo musí mít alespoň 6 znaků")
    private String password;
}
