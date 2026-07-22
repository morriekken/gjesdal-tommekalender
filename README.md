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

`data/tommekalender.json` inneholder reelle hentedatoer for 2026 for Rute 1–4,
hentet fra kommunens offisielle PDF-kalendere. Når 2027-kalenderne publiseres,
oppdater `hentinger`-listene (og `meta.gjelderAar`) manuelt fra de nye PDF-ene:

<https://www.gjesdal.kommune.no/tjenester/bolig-eiendom-kart-og-plan/renovasjon-avfall/tommekalender/>

Datoer som følge av helligdager (påske, pinse, jul) er forskjøvet til nærmeste
virkedag slik det står i kilde-PDF-ene. Noen uker har ingen henting for en gitt
rute – det stemmer med kalenderen, ikke en feil i dataene.

For varsling om tømmedag anbefaler kommunen appen **Gjesdaltråden** (SMS-varsling er avviklet).

