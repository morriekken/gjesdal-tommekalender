# gjesdal-tommekalender
Her finner du oversikt over de ulike tømmerutene, og hvordan du kan motta varsling om tømmedag i Gjesdal kommune.

En enkel, avhengighetsfri HTML/CSS/JS-app for å slå opp tømmerute og hentedager.

## Kjøre lokalt

Ingen byggesteg nødvendig. Server rotmappen med en enkel HTTP-server, f.eks.:

```
python3 -m http.server 8000
```

Åpne deretter <http://localhost:8000> i nettleseren.

## Struktur

- `index.html` – appens markup
- `css/styles.css` – styling
- `js/app.js` – gate-/rutesøk, "neste henting"-visning og rendering av kommende hentinger
- `data/tommekalender.json` – ruter (gatenavn), avfallstyper og hentedatoer

## Data

`data/tommekalender.json` inneholder for øyeblikket **eksempeldatoer**, ikke
offisielle hentedatoer. Rutene (Rute 1–3) og gatenavnene er hentet fra
kommunens nettsider, men selve hentedatoene må oppdateres manuelt fra de
offisielle PDF-kalenderne før appen kan brukes i praksis:

<https://www.gjesdal.kommune.no/tjenester/bolig-eiendom-kart-og-plan/renovasjon-avfall/tommekalender/>

For varsling om tømmedag anbefaler kommunen appen **Gjesdaltråden** (SMS-varsling er avviklet).

