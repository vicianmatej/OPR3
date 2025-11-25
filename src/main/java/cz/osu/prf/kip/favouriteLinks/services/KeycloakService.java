package cz.osu.prf.kip.favouriteLinks.services;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.osu.prf.kip.favouriteLinks.exceptions.AppException;
import cz.osu.prf.kip.favouriteLinks.exceptions.ServiceException;
import cz.osu.prf.kip.favouriteLinks.exceptions.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class KeycloakService {

    public enum Role {
        ADMIN, USER
    }

    public static class Roles {
        public final static String KC_ROLE_NAME_PREFIX = "KC_ROLE_";
        public final static String ADMIN = KC_ROLE_NAME_PREFIX + "ADMIN";
        public final static String USER = KC_ROLE_NAME_PREFIX + "USER";

        public static String fromRole(Role role) {
            return switch (role) {
                case ADMIN -> ADMIN;
                case USER -> USER;
            };
        }
    }

    private static final String CLIENT_CREDENTIALS = "client_credentials";
    private static final String PASSWORD = "password";
    private final String realm;
    private final String serverUrl;
    private final String adminClientId;
    private final String adminClientIdSecret;
    private final String userClientId;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public KeycloakService(@Value("${keycloak.server-url}") String serverUrl,
                           @Value("${keycloak.realm}") String realm,
                           @Value("${keycloak.admin-client-id}") String adminClientId,
                           @Value("${keycloak.admin-client-id-secret}") String adminClientIdSecret,
                           @Value("${keycloak.user-client-id}") String userClientId) {
        this.serverUrl = serverUrl;
        this.realm = realm;
        this.adminClientId = adminClientId;
        this.adminClientIdSecret = adminClientIdSecret;
        this.userClientId = userClientId;
    }

    private static Map<String, String> parseJson(String json) {
        Map<String, String> map = new HashMap<>();
        String content = json.trim();
        if (content.startsWith("{")) content = content.substring(1);
        if (content.endsWith("}")) content = content.substring(0, content.length() - 1);
        String[] pairs = content.split(",");
        for (String pair : pairs) {
            String[] kv = pair.split(":", 2);
            if (kv.length != 2) continue;
            String key = kv[0].trim().replaceAll("\"", "");
            String value = kv[1].trim().replaceAll("\"", "");
            map.put(key, value);
        }
        return map;
    }

    private static HttpResponse<String> getHttpResponse(HttpRequest request, Function<Exception, AppException> exceptionHandler) {
        HttpResponse<String> response;
        try (var httpClient = HttpClient.newHttpClient()) {
            response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            if (e instanceof IOException || e instanceof InterruptedException) {
                throw exceptionHandler.apply(e);
            } else throw new AppException("Failed to invoke http request.", e);
        }
        return response;
    }

    private static String convertParamsToFormBody(Map<String, String> params) {
        return params.entrySet().stream()
                .map(e -> String.format("%s=%s", e.getKey(), URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8)))
                .reduce((a, b) -> a + "&" + b)
                .orElse("");
    }

    private URI createUri(String url) {
        try {
            return new URI(url);
        } catch (URISyntaxException e) {
            throw new AppException("Failed to create URI.", e);
        }
    }

    private String getAdminAccessToken() {
        Map<String, String> params = new HashMap<>();
        params.put("grant_type", CLIENT_CREDENTIALS);
        params.put("client_id", adminClientId);
        params.put("client_secret", adminClientIdSecret);

        String form = convertParamsToFormBody(params);
        URI url = createUri(String.format("%s/realms/%s/protocol/openid-connect/token", serverUrl, realm));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(url)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form))
                .build();

        HttpResponse<String> response = getHttpResponse(request, e -> new AppException("Failed to get admin access token.", e));

        if (response.statusCode() != 200) {
            throw new AppException("Failed to get admin access token: " + response.body());
        }

        Map<String, String> tokenData = parseJson(response.body());
        return tokenData.get("access_token");
    }

    public String createUser(String email, String password, boolean isAdmin) {
        String adminToken = getAdminAccessToken();
        String userJson = String.format("""
                {
                    "username": "%s",
                    "email": "%s",
                    "enabled": true,
                    "emailVerified": true,
                    "credentials": [{
                        "type": "password",
                        "value": "%s",
                        "temporary": false
                    }]
                }
                """, email, email, password);

        URI url = createUri(String.format("%s/admin/realms/%s/users", serverUrl, realm));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(url)
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + adminToken)
                .POST(HttpRequest.BodyPublishers.ofString(userJson))
                .build();

        HttpResponse<String> response = getHttpResponse(request, e -> new ServiceException(this, "Failed to create user: " + email, e));

        if (response.statusCode() == 201) {
            String location = response.headers().firstValue("Location").orElse("");
            return location.replaceAll(".*/([^/]+)$", "$1");
        } else if (response.statusCode() == 409) {
            throw new AppException("User already exists: " + email);
        } else {
            throw new ServiceException(this, "Creating user failed with status " + response.statusCode());
        }
    }

    public void deleteUser(String userId) {
        String adminToken = getAdminAccessToken();
        URI url = createUri(String.format("%s/admin/realms/%s/users/%s", serverUrl, realm, userId));
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(url)
                .header("Authorization", "Bearer " + adminToken)
                .DELETE()
                .build();

        HttpResponse<String> response = getHttpResponse(request, e -> new ServiceException(this, "Failed to delete user: " + userId, e));

        if (response.statusCode() != 204 && response.statusCode() != 404) {
            throw new ServiceException(this, "Deleting user failed with status " + response.statusCode());
        }
    }

    public LoginResult login(String email, String password) {
        Map<String, String> params = new HashMap<>();
        params.put("grant_type", PASSWORD);
        params.put("client_id", userClientId);
        params.put("username", email);
        params.put("password", password);

        String form = convertParamsToFormBody(params);
        URI uri = createUri(String.format("%s/realms/%s/protocol/openid-connect/token", serverUrl, realm));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(uri)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form))
                .build();

        HttpResponse<String> response = getHttpResponse(request, e -> new ServiceException(this, "Failed to login: " + email, e));

        if (response.statusCode() == 401) {
            throw new UnauthorizedException();
        } else if (response.statusCode() != 200) {
            throw new ServiceException(this, "Login failed with status " + response.statusCode());
        }

        Map<String, String> tokenData = parseJson(response.body());
        return new LoginResult(tokenData.get("access_token"), tokenData.get("refresh_token"));
    }

    public LoginResult refreshToken(String refreshToken) {
        Map<String, String> params = new HashMap<>();
        params.put("refresh_token", refreshToken);
        params.put("grant_type", "refresh_token");
        params.put("client_id", this.userClientId);

        String form = convertParamsToFormBody(params);
        URI uri = createUri(String.format("%s/realms/%s/protocol/openid-connect/token", this.serverUrl, this.realm));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(uri)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form))
                .build();

        HttpResponse<String> response = getHttpResponse(request, e -> new AppException("Failed to refresh token.", e));
        
        if (response.statusCode() != 200) {
            throw new AppException("Failed to refresh token: " + response.body());
        }

        Map<String, String> map = parseJson(response.body());
        return new LoginResult(map.get("access_token"), map.get("refresh_token"));
    }

    public record LoginResult(String accessToken, String refreshToken) {
    }

    public record KeycloakUser(String id, String email, Role role) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class KeycloakUserInternal {
        public String id;
        public String email;
    }
}
