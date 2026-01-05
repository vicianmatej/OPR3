# 🎬 CineHub - Movie Database Application

Webová aplikace pro správu filmové databáze s možností hodnocení, recenzí a osobního watchlistu.

## 📋 Obsah
- [Popis projektu](#popis-projektu)
- [Technologie](#technologie)
- [Funkce aplikace](#funkce-aplikace)
- [Instalace a spuštění](#instalace-a-spuštění)
- [Struktura projektu](#struktura-projektu)
- [API Endpointy](#api-endpointy)
- [Databázový model](#databázový-model)
- [Autor](#autor)

## 🎯 Popis projektu

CineHub je full-stack webová aplikace pro správu filmové databáze. Uživatelé mohou procházet filmy, hodnotit je, psát recenze a spravovat svůj osobní watchlist. Aplikace podporuje dva typy uživatelů - běžné uživatele (USER) a administrátory (ADMIN), kteří mohou přidávat, upravovat a mazat filmy.

## 🛠 Technologie

### Backend
- **Java 21**
- **Spring Boot 3.5.6**
  - Spring Web
  - Spring Data JPA
  - Spring Security
- **MariaDB** - databáze
- **Flyway** - migrace databáze
- **JWT** - autentizace
- **BCrypt** - šifrování hesel
- **Lombok** - redukce boilerplate kódu
- **Logback** - logování

### Frontend
- **React 18**
- **TypeScript**
- **Vite** - build tool
- **Axios** - HTTP klient

### DevOps
- **Docker** - kontejnerizace databáze
- **Maven** - build management

## ✨ Funkce aplikace

### Pro všechny uživatele
- 📝 Registrace a přihlášení
- 🔍 Procházení filmů
- 🎭 Filtrování podle žánru
- 🔎 Vyhledávání filmů (název, žánr, rok)
- ⭐ Hodnocení filmů (1-5 hvězdiček)
- 💬 Psaní recenzí
- 📋 Osobní watchlist
- ✅ Označování filmů jako shlédnutých

### Pro administrátory
- ➕ Přidávání nových filmů
- 🗑️ Mazání filmů

## 🚀 Instalace a spuštění

### Prerekvizity
- Java 21
- Node.js 18+
- Docker Desktop
- Maven

### 1. Klonování repozitáře
```bash
git clone https://github.com/vicianmatej/OPR3.git
cd OPR3/MovieDatabase
```

### 2. Spuštění databáze
```bash
docker-compose up -d
```

### 3. Konfigurace prostředí
Vytvořte soubor `.env` v kořenovém adresáři:
```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_USER=user
MYSQL_PASSWORD=secretPassword
```

### 4. Spuštění backendu
```bash
chmod +x mvnw
./mvnw spring-boot:run
```
Backend běží na: `http://localhost:8081`

### 5. Spuštění frontendu
```bash
cd frontend
npm install
npm run dev
```
Frontend běží na: `http://localhost:3001`


## 📁 Struktura projektu

```
MovieDatabase/
├── src/main/java/cz/osu/prf/kip/favouriteLinks/
│   ├── config/              # Konfigurace (Security, CORS, JWT)
│   ├── controllers/         # REST API controllery
│   ├── services/            # Business logika
│   ├── repositories/        # JPA repositories
│   ├── model/entities/      # JPA entity
│   ├── dtos/                # Data Transfer Objects
│   ├── exceptions/          # Custom exceptions
│   └── aop/                 # Aspect-Oriented Programming (logování)
├── src/main/resources/
│   ├── application.properties
│   └── logback.xml
├── migrations/              # Flyway SQL migrace
├── frontend/
│   └── src/
│       ├── components/      # React komponenty
│       ├── services/        # API služby
│       └── types/           # TypeScript typy
└── docker-compose.yml
```

## 🔌 API Endpointy

### Autentizace
```
POST   /api/auth/register    - Registrace nového uživatele
POST   /api/auth/login       - Přihlášení uživatele
```

### Filmy
```
GET    /api/movies           - Získání všech filmů
GET    /api/movies/{id}      - Získání filmu podle ID
GET    /api/movies/search    - Vyhledávání filmů
POST   /api/movies           - Vytvoření filmu (ADMIN)
PUT    /api/movies/{id}      - Aktualizace filmu (ADMIN)
DELETE /api/movies/{id}      - Smazání filmu (ADMIN)
```

### Hodnocení
```
POST   /api/ratings                           - Vytvoření/aktualizace hodnocení
GET    /api/ratings/movie/{movieId}/average   - Průměrné hodnocení filmu
GET    /api/ratings/user/{userId}/movie/{movieId} - Hodnocení uživatele
DELETE /api/ratings/user/{userId}/movie/{movieId} - Smazání hodnocení
GET    /api/ratings/my                        - Moje hodnocení
```

### Recenze
```
GET    /api/reviews/movie/{movieId}  - Recenze filmu
GET    /api/reviews/my               - Moje recenze
POST   /api/reviews                  - Vytvoření recenze
DELETE /api/reviews/{id}             - Smazání recenze
```

### Watchlist
```
GET    /api/watchlist              - Můj watchlist
POST   /api/watchlist/{movieId}    - Přidání do watchlistu
DELETE /api/watchlist/{movieId}    - Odebrání z watchlistu
PATCH  /api/watchlist/{movieId}/watched - Označení jako shlédnutý
```

## 🗄️ Databázový model

### Hlavní entity

#### AppUser
- `id` (PK)
- `email` (unique)
- `username` (unique)
- `password_hash`
- `role` (USER/ADMIN)

#### Movie
- `id` (PK)
- `title`
- `description`
- `release_year`
- `genre`
- `director`
- `poster_url`
- `user_id` (FK → AppUser)
- `created_at`

#### Rating
- `id` (PK)
- `score` (1-5)
- `user_id` (FK → AppUser)
- `movie_id` (FK → Movie)
- `created_at`
- **Unique constraint**: (user_id, movie_id)

#### Review
- `id` (PK)
- `review_text`
- `user_id` (FK → AppUser)
- `movie_id` (FK → Movie)
- `created_at`
- `updated_at`

#### Watchlist
- `id` (PK)
- `user_id` (FK → AppUser)
- `movie_id` (FK → Movie)
- `watched` (boolean)
- `added_at`
- **Unique constraint**: (user_id, movie_id)

### Vztahy mezi entitami
```
AppUser 1---N Movie
AppUser 1---N Rating
AppUser 1---N Review
AppUser 1---N Watchlist
Movie 1---N Rating
Movie 1---N Review
Movie 1---N Watchlist
```

## 🔐 Zabezpečení

- **JWT tokeny** pro autentizaci
- **BCrypt** pro hashování hesel
- **Role-based access control** (USER/ADMIN)
- **CORS** konfigurace pro frontend
- **Spring Security** pro ochranu endpointů

## 📝 Logování

Aplikace používá Logback pro logování:
- **Konzole** - výstup do terminálu
- **Soubory** - `logs/app.log` a `logs/app.json`
- **AOP** - automatické logování všech Controller a Service metod
- **Rotace** - denní rotace logů s 30denní historií

## 🎨 UI/UX

- **Netflix-inspired design** - moderní tmavé téma
- **Responzivní layout** - přizpůsobení různým velikostem obrazovek
- **Hover efekty** - interaktivní animace
- **Toast notifikace** - zpětná vazba pro uživatele
- **Filtrování podle žánrů** - rychlá navigace

## 🧪 Testování

Projekt obsahuje unit a integration testy:
```bash
./mvnw test
```

## 🐛 Známé problémy a řešení

### Problém s Flyway migrací
Pokud migrace selže, použijte:
```bash
./mvnw flyway:repair
```

### Port již používán
Změňte port v `application.properties`:
```properties
server.port=8082
```

## 📚 Další zdroje

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [JWT.io](https://jwt.io/)
- [Flyway Documentation](https://flywaydb.org/documentation/)

## 👨‍💻 Autor

**Matej Vician**
- GitHub: [@vicianmatej](https://github.com/vicianmatej)
- Email: admin@vician.cz

## 📄 Licence

Tento projekt je vytvořen pro akademické účely v rámci předmětu OPR3 na Ostravské univerzitě.

