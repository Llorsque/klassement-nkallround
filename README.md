# NK Allround 2026 — Live Klassement

Live klassementtool voor het NK Allround schaatsen 2026 in Thialf, Heerenveen (1-2 maart 2026).

## Features

- **Live data** via `live-api.schaatsen.nl` (CORS proxy fallback, elke 15s bijgewerkt)
- **Klassement** — meeste afstanden eerst, dan laagste punten
- **Afstandsviews** — met live sidebar-klassement en startlijst-ritnummers
- **Head-to-Head** — mirror-vergelijking tussen twee rijders
- **Kwalificatie slotafstand** — berekent top 8 voor 5000m (♀) / 10.000m (♂)
- **Handmatige invoer** — per rijder of plak-modus
- **Athlete popup** — klik op naam voor persoonlijke stats
- **CSV export**
- **URL hash** — behoudt pagina bij refresh

## Afstanden

| Vrouwen | Mannen |
|---------|--------|
| 500m | 500m |
| 3000m | 5000m |
| 1500m | 1500m |
| 5000m | 10.000m |

## Tijdnotatie

- Onder 1 minuut: `38.955` (punt)
- Boven 1 minuut: `4:19,650` (komma, Nederlands)

## Deelnemers

40 schaatsers (20 vrouwen + 20 mannen) uit officiële KNSB deelnemerslijsten. Startlijsten (zaterdag) uit Sportity/KNSB PDFs.

## Gebruik

Open `index.html` in een browser, of deploy naar GitHub Pages.

## Databron

```
https://live-api.schaatsen.nl/events/2026_NED_0004/competitions/{compId}/results/?inSeconds=1
```

CORS proxies: corsproxy.io → allorigins.win → codetabs.com (fallback chain).
