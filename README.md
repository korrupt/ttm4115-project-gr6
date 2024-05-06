[![CircleCI](https://dl.circleci.com/status-badge/img/gh/korrupt/ttm4115-project-gr6/tree/main.svg?style=svg&circle-token=CCIPRJ_4GMYfxJ1yTH3K5DEDkEo9r_0df7367443bb7c970e22781849dc998358337230)](https://dl.circleci.com/status-badge/redirect/gh/korrupt/ttm4115-project-gr6/tree/main)

# Prosjekt
Dette repo er samleplassen for begynnelsen på en tenkt løsning på problematikk i sammenheng med elbilladestasjoner  

# Kjøre igang prosjektet:
1. Kopier .env.example-fila og gi den navnet ".env". Fyll inn korrekte verdier
    - MAPS_KEY og MAPS_ID må hentes fra [Google Cloud Platform](https://www.docker.com/get-started/)
2. Last ned [Docker](https://www.docker.com/get-started/) og Docker Compose
3. Last ned [NodeJS](https://nodejs.org/en/download/current)
4. Installer [yarn](https://yarnpkg.com/getting-started/install)
5. Kjør `docker compose up -d postgres mosquitto`
6. Kjør `nx run api:serve` for å starte backend
7. Kjør `nx run web:serve` for å starte frontend

**Alternativt:**
Kjør `docker compose up --build` for å hellere starte produksjonsbilder 
