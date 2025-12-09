-- Kontrola a přidání username do app_user
SET @username_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'app_user' AND COLUMN_NAME = 'username');

SET @sql_username = IF(@username_exists = 0, 
    'ALTER TABLE app_user ADD COLUMN username VARCHAR(50) NULL AFTER email',
    'SELECT "Column username already exists"');
PREPARE stmt1 FROM @sql_username;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

-- Kontrola a přidání role do app_user
SET @role_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'app_user' AND COLUMN_NAME = 'role');

SET @sql_role = IF(@role_exists = 0, 
    'ALTER TABLE app_user ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT "USER" AFTER username',
    'SELECT "Column role already exists"');
PREPARE stmt2 FROM @sql_role;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- Aktualizace existujících uživatelů - nastavení username z emailu (část před @)
UPDATE app_user SET username = SUBSTRING_INDEX(email, '@', 1) WHERE username IS NULL OR username = '';

-- Změna username na NOT NULL (pouze pokud byl přidán)
SET @sql_username_nn = IF(@username_exists = 0, 
    'ALTER TABLE app_user MODIFY COLUMN username VARCHAR(50) NOT NULL',
    'SELECT "Username already configured"');
PREPARE stmt3 FROM @sql_username_nn;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

-- Přidání unique constraint na username (pokud neexistuje)
SET @constraint_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'app_user' AND INDEX_NAME = 'unique_username');

SET @sql_constraint = IF(@constraint_exists = 0, 
    'ALTER TABLE app_user ADD UNIQUE KEY unique_username (username)',
    'SELECT "Constraint unique_username already exists"');
PREPARE stmt4 FROM @sql_constraint;
EXECUTE stmt4;
DEALLOCATE PREPARE stmt4;

-- Kontrola a přidání user_id do movies tabulky (pouze pokud neexistuje)
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'movies' AND COLUMN_NAME = 'user_id');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE movies ADD COLUMN user_id BIGINT NULL AFTER created_at, ADD CONSTRAINT fk_movies_user FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE',
    'SELECT "Column user_id already exists" AS message');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Nastavení user_id pro existující filmy (první uživatel)
UPDATE movies SET user_id = (SELECT MIN(id) FROM app_user) WHERE user_id IS NULL;

-- Změna user_id na NOT NULL (pouze pokud je NULL)
SET @sql2 = IF(@col_exists = 0, 
    'ALTER TABLE movies MODIFY COLUMN user_id BIGINT NOT NULL',
    'SELECT "Column user_id already configured" AS message');

PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;
