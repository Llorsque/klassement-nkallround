# NK Allround 2026 — Live Klassement

Live klassementtool voor het NK Allround schaatsen 2026 in Thialf, Heerenveen (1-2 maart 2026).

## Data ophalen

Live resultaten worden opgehaald via **Jina Reader** (`r.jina.ai`) van `liveresults.schaatsen.nl`. Geen eigen backend nodig — werkt volledig als statische GitHub Pages site.

```
Bron:   liveresults.schaatsen.nl/events/2026_NED_0004/competition/{1-8}/results
Proxy:  r.jina.ai (primair) → allorigins.win (fallback)
```

## Comp IDs

| ID | Afstand |
|----|---------|
| C1 | 500m ♀ |
| C2 | 500m ♂ |
| C3 | 3000m ♀ |
| C4 | 5000m ♂ |
| C5 | 1500m ♀ |
| C6 | 1500m ♂ |
| C7 | 5000m ♀ |
| C8 | 10.000m ♂ |

## Modules

- **Afstandsklassement** — ranglijst per afstand op tijd
- **Algemeen klassement** — punten = tijd ÷ divisor, laagste wint
- **Head-to-Head** — vergelijk rijders met leider, target, en onderling
- **Deelnemers** — overzicht met actief/inactief toggle
- **Kwalificatie** — top 8 voor slotafstand (5000m ♀ / 10.000m ♂)

## Gebruik

Open `index.html` in een browser, of deploy via GitHub Pages.
