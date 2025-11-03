-- Vložení testovacích uživatelů
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nHc3Ov.3.m.', 'ADMIN'),
('testuser', 'test@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nHc3Ov.3.m.', 'USER');

-- Vložení testovacích filmů
INSERT INTO movies (title, description, release_year, genre, director, poster_url) VALUES
('Inception', 'Sci-fi thriller o snech ve snech', 2010, 'Sci-Fi', 'Christopher Nolan', 'https://example.com/inception.jpg'),
('The Matrix', 'Revoluce ve virtuální realitě', 1999, 'Sci-Fi', 'Wachowski Sisters', 'https://example.com/matrix.jpg'),
('Pulp Fiction', 'Kultovní krimi drama', 1994, 'Crime', 'Quentin Tarantino', 'https://example.com/pulpfiction.jpg'),
('The Godfather', 'Klasická mafiánská sága', 1972, 'Crime', 'Francis Ford Coppola', 'https://example.com/godfather.jpg'),
('Forrest Gump', 'Příběh obyčejného muže s neobyčejným životem', 1994, 'Drama', 'Robert Zemeckis', 'https://example.com/forrestgump.jpg');

-- Vložení testovacích hodnocení
INSERT INTO ratings (score, user_id, movie_id) VALUES
(5, 1, 1), -- admin hodnotí Inception 5 hvězdiček
(4, 1, 2), -- admin hodnotí Matrix 4 hvězdičky
(5, 1, 3), -- admin hodnotí Pulp Fiction 5 hvězdiček
(4, 2, 1), -- testuser hodnotí Inception 4 hvězdičky
(5, 2, 4), -- testuser hodnotí Godfather 5 hvězdiček
(3, 2, 5); -- testuser hodnotí Forrest Gump 3 hvězdičky