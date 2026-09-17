# KommunCirkulär

Klickbar prototyp av en plattform för internt återbruk av inventarier i kommuner. Möbler och utrustning som en
verksamhet inte längre behöver märks med QR-kod, publiceras på en intern handelsplats och kan tas över av en annan
verksamhet efter godkännande.

Prototypen kör helt i webbläsaren med exempeldata. Ingen backend, ingen databas, inga riktiga personuppgifter.

## Kör lokalt

```bash
npm install
npm run dev
```

Öppna http://localhost:3010. För att kunna skanna QR-koderna från en telefon i samma nät:

```bash
npm run dev:host
```

## Demoflödet

1. Logga in med BankID — inloggningen är simulerad, välj en av demoidentiteterna
2. Som **Anna Svensson** (Björkskolan): hitta ett skrivbord på handelsplatsen och begär övertagande
3. Byt identitet till **Erik Lund** (Kommunhuset, Avdelning A) och godkänn förfrågan
4. Objektet byter status, ansvar och placering — hela kedjan syns i objektets historik
5. Skanna QR-koden på objektsidan med telefonen och se att den leder till samma objekt

## Vad som ingår

- Handelsplats med sök, kategorier, filter, sortering och två vyer
- Objektsida med QR-kod och spårbar historik
- Registrering av inventarier med id-generering
- Förfrågningar med godkännande och avslag
- Översikt över den egna verksamhetens inventarier

Transport, återbrukspoäng, statistik och den fullständiga rollmodellen ligger utanför den här versionen.

## Teknik

React 19, TypeScript, Vite och Tailwind CSS v4. Inga backend-anrop.

All data ligger i `src/data/` och återställs vid omladdning.
