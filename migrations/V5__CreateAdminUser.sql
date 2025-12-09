-- Vytvoření admin uživatele pro testování
-- Heslo: admin123 (BCrypt hash)
INSERT INTO app_user (email, username, password_hash, role, created_at, updated_at) 
VALUES (
    'admin@cinehub.cz', 
    'admin', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON DUPLICATE KEY UPDATE email=email;
