# Comfort Cast

Comfort Cast is a full-stack weather ranking application that evaluates how comfortable a city feels based on live weather conditions. The backend retrieves current weather from OpenWeatherMap, calculates a server-side Comfort Index, ranks the cities, and exposes the data through a secured API for a React dashboard.

## Overview

- Backend: Java 21, Spring Boot, Spring Security, Caffeine cache
- Frontend: React, Vite, Redux Toolkit, Tailwind CSS, shadcn/ui
- Authentication: Auth0 with JWT validation
- Data source: OpenWeatherMap Current Weather API

The project’s core idea is simple: rather than exposing raw weather values to the client, the server computes a consistent comfort score for every city. This ensures all users see the same ranking, with the calculation kept in one authoritative place.

## Features

- Public city listing and discovery view
- Auth0-protected dashboard and cache debug endpoints
- Deterministic server-side Comfort Index scoring
- Ranked city comparison with temperature, humidity, wind, and pressure data
- Two-level in-memory caching for weather and summary responses
- Lightweight cache monitoring for HIT/MISS diagnostics
- Clean dashboard UI with search and ranking visualization

## Project Structure

```text
comfort-cast/
├── comfort-cast-backend/
│   ├── src/main/java/
│   │   └── org/manojtharindu11/comfortcastbackend/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── dto/
│   │       ├── model/
│   │       ├── service/
│   │       └── constant/
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── cities.json
│   └── pom.xml
├── comfort-cast-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

Before running the app, make sure you have:

- Java 21
- Node.js 18+ and npm
- An OpenWeatherMap API key
- An Auth0 tenant with a configured SPA application and API audience

### 1. Backend

From the project root:

```bash
cd comfort-cast-backend
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd comfort-cast-backend
./mvnw.cmd spring-boot:run
```

The backend is configured to run on port 8080 by default.

You must also set the OpenWeatherMap API key in the application configuration. In the project, this is read from the configuration property used by the backend service. Update the relevant value in the application properties or environment configuration before starting the app.

### 2. Frontend

```bash
cd comfort-cast-frontend
npm install
npm run dev
```

The frontend runs on port 5173 by default and proxies API calls to the backend at http://localhost:8080.

### 3. Auth0 Configuration

Create a SPA app and an API in Auth0, then configure the frontend environment variables for the app:

```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_spa_client_id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
```

Set the allowed callback/logout/origin URLs to:

- http://localhost:5173

The backend validates the JWT issued by Auth0 and rejects requests without a valid token.

## Comfort Index Formula

The Comfort Index is calculated entirely on the backend in `ComfortIndexService`. This ensures all clients receive the same ranking and prevents frontend-specific inconsistencies.

The formula combines four normalized sub-scores:

```java
double total = TEMP_WEIGHT * temperatureScore
        + HUMIDITY_WEIGHT * humidityScore
        + WIND_WEIGHT * windScore
        + PRESSURE_WEIGHT * pressureScore;

return (int) Math.floor(total + 0.5);
```

The current weights are:

- Temperature: 0.40
- Humidity: 0.25
- Wind: 0.20
- Pressure: 0.15

Each factor is scored from 0 to 100 using linear penalties outside the preferred range. The app treats values inside the ideal band as a perfect score of 100 and applies a progressive penalty as the value drifts away from that range.

### Factor Logic

| Factor      | Ideal Band           | Score Rule                                                         |
| ----------- | -------------------- | ------------------------------------------------------------------ |
| Temperature | 20°C to 25°C         | 100 inside range, decreases linearly below/above the band          |
| Humidity    | 30% to 60%           | 100 inside range, decreases linearly outside the band              |
| Wind speed  | 1 m/s to 3 m/s       | 100 inside range, drops sharply when wind is too low or too strong |
| Pressure    | 1005 hPa to 1020 hPa | 100 inside range, lightly penalized outside the band               |

The score for each factor is clamped to the range 0 to 100, and the final total is rounded with standard half-up rounding.

## Why These Weights?

The weighting reflects the relative influence each variable has on perceived comfort in everyday conditions.

### Temperature - 0.40

Temperature is the strongest determinant of comfort because it directly affects how warm or cool a person feels. It can dominate a day’s perceived comfort, so it receives the largest weight.

### Humidity - 0.25

Humidity matters because it changes how the body experiences heat. High humidity makes warm conditions feel more oppressive, while low humidity can also feel uncomfortable in some environments. This gives humidity a meaningful but secondary role.

### Wind - 0.20

Wind has a noticeable effect on thermal sensation, especially in hot weather. It can cool the body but can also feel unpleasant when excessive. It is important, but less dominant than temperature in general human comfort perception.

### Pressure - 0.15

Pressure is included as a secondary environmental factor. It contributes to the total, but it is not as directly felt by people as temperature or humidity. It is useful as a supporting signal rather than a primary comfort driver.

## Trade-offs Considered

The formula is intentionally simple, explainable, and deterministic. This makes it easy to debug, validate, and maintain.

| Decision                                                | Reasoning and trade-off                                                                                                                |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Linear scoring instead of more complex nonlinear models | Easier to explain, test, and reason about; less realistic than a more advanced human-perception model                                  |
| Fixed weights for all users                             | Keeps rankings consistent across clients; sacrifices personalization                                                                   |
| Clamping at 0 and 100                                   | Prevents a single extreme value from dominating the ranking; may flatten extreme conditions                                            |
| Asymmetric temperature penalties                        | Heat is treated as more uncomfortable than mild cold in the current model; reflects practical comfort concerns but is a simplification |
| Inclusion of pressure as an additional signal           | Provides broader environmental context; still less important than the more direct comfort factors                                      |
| Current weather only                                    | Keeps the app focused and fast; less responsive to forecasts or longer-term trends                                                     |

## Cache Design

The backend uses Spring Cache with Caffeine to reduce repeated calls to OpenWeatherMap and avoid recomputing rankings unnecessarily.

### Cache Structure

Two caches are configured:

1. `rawWeather`
   - Key: city code
   - Value: raw weather response for a city
   - Purpose: avoid repeated external API calls for the same city

2. `weatherSummary`
   - Key: fixed summary key
   - Value: ranked list of all cities
   - Purpose: avoid re-running the full ranking process for each request

### Why This Design?

The app uses a layered caching strategy because weather data is read-heavy and rate-limited by the OpenWeatherMap free tier.

- Raw weather entries are cached per city to reduce duplicate calls.
- The summary cache is cached separately so the expensive ranking task is not repeated unnecessarily.
- Both caches expire after a fixed time window, which keeps the app fast while limiting staleness.
- When the summary cache expires, the raw weather cache often still contains recent values, which reduces the number of external requests needed to rebuild the ranking.

### Request Flow

```text
GET /api/weather/summary
  -> summary cache lookup
      -> HIT: return cached ranked list
      -> MISS: fetch city weather data
          -> rawWeather cache lookup
              -> HIT: use cached city weather
              -> MISS: call OpenWeatherMap and store result
          -> compute Comfort Index
          -> rank cities
          -> store summary result
```

## Known Limitations

- Cache entries are in-memory only and are lost when the backend restarts.
- The system is limited to the static city list in the application configuration and does not yet support dynamic city discovery.
- The app uses a fixed 5-minute cache window, so weather data may be slightly stale between refreshes.
- Authentication is currently suited to local development and a specific Auth0 setup; production hardening would require more explicit validation and environment controls.
- The Comfort Index is a practical heuristic, not a scientific thermal comfort model.
- No automated unit tests currently cover the scoring logic or API behavior.
- OpenWeatherMap free-tier rate limits still apply on cache misses or after cache expiry.

## API Endpoints

| Method | Endpoint                                | Auth         | Purpose                             |
| ------ | --------------------------------------- | ------------ | ----------------------------------- |
| GET    | /api/cities                             | Public       | List tracked cities                 |
| GET    | /api/weather/summary                    | JWT required | Get ranked weather summary          |
| GET    | /api/weather/{cityCode}                 | JWT required | Get a single city’s weather result  |
| GET    | /api/weather/debug/cache/raw/{cityCode} | JWT required | Check raw cache HIT/MISS status     |
| GET    | /api/weather/debug/cache/summary        | JWT required | Check summary cache HIT/MISS status |

## Conclusion

Comfort Cast is designed to deliver a fast, deterministic, and easy-to-explain weather ranking experience. It balances simplicity and usefulness: the scoring model is transparent, the server owns the logic, and the caching layer keeps the app responsive without overloading the external weather API.

## Acknowledgements

- OpenWeatherMap for weather data
- Auth0 for identity and JWT-based access control
- Spring Boot, Caffeine, React, Vite, Tailwind CSS, and shadcn/ui for the application stack
