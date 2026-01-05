package cz.osu.prf.kip.favouriteLinks.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Vypne CSRF ochranu (používáme JWT)
            .cors(cors -> {}) // Povolí CORS (pro komunikaci s frontendem)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Povolí OPTIONS požadavky (CORS preflight)
                .requestMatchers("/api/auth/**").permitAll() // Registrace a přihlášení jsou veřejné
                .requestMatchers(HttpMethod.GET, "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll() // Swagger dokumentace
                .requestMatchers(HttpMethod.GET, "/api/movies/**").permitAll() // Čtení filmů je veřejné
                .requestMatchers(HttpMethod.POST, "/api/movies/**").authenticated() // Vytváření vyžaduje přihlášení
                .requestMatchers(HttpMethod.PUT, "/api/movies/**").authenticated() // Aktualizace vyžaduje přihlášení
                .requestMatchers(HttpMethod.DELETE, "/api/movies/**").authenticated() // Mazání vyžaduje přihlášení
                .anyRequest().authenticated() // Všechny ostatní požadavky vyžadují přihlášení
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Přidá JWT filtr
        
        return http.build();
    }

}