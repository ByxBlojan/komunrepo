import type { Avdelning, Forfragan, Inventarie, Kategori, Skick } from "./typer";

export const AVDELNINGAR: Avdelning[] = [
  { id: "avd-a", namn: "Kommunhuset, Avdelning A", typ: "Kontor", adress: "Storgatan 12, Plan 3" },
  { id: "avd-b", namn: "Björkskolan", typ: "Skola", adress: "Skolvägen 4" },
  { id: "avd-c", namn: "Kulturförvaltningen", typ: "Kontor", adress: "Biblioteksgatan 8" },
  { id: "avd-d", namn: "Centrallagret", typ: "Lager", adress: "Industrivägen 22" },
];

function skrivbord(nummer: number): Inventarie {
  const id = `KOM-SKR-${String(nummer).padStart(4, "0")}`;
  return {
    id,
    namn: "Höj- och sänkbart skrivbord",
    kategori: "Skrivbord",
    beskrivning:
      "Elektriskt höj- och sänkbart skrivbord med minnesfunktion. Skiva i björklaminat, grått stativ. Kabelränna under skivan.",
    skick: nummer <= 9 ? "Mycket bra" : "Bra",
    matt: "160 × 80 cm",
    inkopsar: 2019,
    uppskattatVarde: 3200,
    placering: { avdelningId: "avd-a", adress: "Storgatan 12, Plan 3", rum: "Kontorslandskap öst" },
    status: "tillganglig",
    agandeAvdelningId: "avd-a",
    historik: [
      {
        datum: "2026-09-02",
        typ: "registrerad",
        avdelningId: "avd-a",
        kommentar: "Registrerad vid inventering inför omflyttning.",
      },
      {
        datum: "2026-09-03",
        typ: "publicerad",
        avdelningId: "avd-a",
        kommentar: "Publicerad för internt övertagande.",
      },
    ],
  };
}

interface OvrigtObjekt {
  id: string;
  namn: string;
  kategori: Kategori;
  beskrivning: string;
  skick: Skick;
  matt: string;
  inkopsar: number;
  varde: number;
  avdelningId: string;
  rum: string;
  status: Inventarie["status"];
}

const OVRIGA: OvrigtObjekt[] = [
  {
    id: "KOM-STL-0101",
    namn: "Kontorsstol med armstöd",
    kategori: "Kontorsstol",
    beskrivning: "Ergonomisk kontorsstol med justerbart ryggstöd och armstöd. Svart tyg, mindre nopprighet på sitsen.",
    skick: "Bra",
    matt: "Sitthöjd 45–58 cm",
    inkopsar: 2018,
    varde: 1400,
    avdelningId: "avd-a",
    rum: "Kontorslandskap öst",
    status: "tillganglig",
  },
  {
    id: "KOM-STL-0102",
    namn: "Kontorsstol med armstöd",
    kategori: "Kontorsstol",
    beskrivning: "Ergonomisk kontorsstol med justerbart ryggstöd och armstöd. Svart tyg.",
    skick: "Mycket bra",
    matt: "Sitthöjd 45–58 cm",
    inkopsar: 2021,
    varde: 1800,
    avdelningId: "avd-a",
    rum: "Kontorslandskap öst",
    status: "tillganglig",
  },
  {
    id: "KOM-STL-0103",
    namn: "Besöksstol stapelbar",
    kategori: "Kontorsstol",
    beskrivning: "Stapelbar besöksstol i bok och stål. Fem stycken finns, säljs som en post.",
    skick: "Bra",
    matt: "45 × 52 cm",
    inkopsar: 2016,
    varde: 600,
    avdelningId: "avd-c",
    rum: "Möteslokal Ek",
    status: "tillganglig",
  },
  {
    id: "KOM-FRV-0201",
    namn: "Arkivskåp med nyckel",
    kategori: "Förvaring",
    beskrivning: "Plåtskåp med två hyllplan och låsbar dörr. Nyckel finns. Repor på ena sidan.",
    skick: "Bra",
    matt: "80 × 40 × 180 cm",
    inkopsar: 2014,
    varde: 900,
    avdelningId: "avd-d",
    rum: "Lagerhall B",
    status: "tillganglig",
  },
  {
    id: "KOM-FRV-0202",
    namn: "Hurts på hjul",
    kategori: "Förvaring",
    beskrivning: "Trelådig hurts i vitt med central låsning. Rullar lätt.",
    skick: "Mycket bra",
    matt: "42 × 60 × 55 cm",
    inkopsar: 2020,
    varde: 750,
    avdelningId: "avd-a",
    rum: "Kontorslandskap väst",
    status: "tillganglig",
  },
  {
    id: "KOM-FRV-0203",
    namn: "Bokhylla i björk",
    kategori: "Förvaring",
    beskrivning: "Öppen bokhylla med fem hyllplan. Ett hyllplan har en fläck efter vattenskada.",
    skick: "Slitet",
    matt: "80 × 28 × 200 cm",
    inkopsar: 2011,
    varde: 400,
    avdelningId: "avd-c",
    rum: "Personalrum",
    status: "tillganglig",
  },
  {
    id: "KOM-BRD-0301",
    namn: "Konferensbord",
    kategori: "Bord",
    beskrivning: "Ovalt konferensbord för tio personer. Skiva i ek, uttag för ström i mitten.",
    skick: "Mycket bra",
    matt: "280 × 120 cm",
    inkopsar: 2019,
    varde: 6500,
    avdelningId: "avd-c",
    rum: "Möteslokal Ek",
    status: "tillganglig",
  },
  {
    id: "KOM-BRD-0302",
    namn: "Ståbord för pausrum",
    kategori: "Bord",
    beskrivning: "Runt ståbord i vitlaminat med kromat stativ.",
    skick: "Bra",
    matt: "Ø 80 cm, höjd 110 cm",
    inkopsar: 2017,
    varde: 1100,
    avdelningId: "avd-b",
    rum: "Personalrum",
    status: "tillganglig",
  },
  {
    id: "KOM-BRD-0303",
    namn: "Elevbord",
    kategori: "Bord",
    beskrivning: "Elevbord med justerbar höjd. Tolv stycken finns, säljs som en post.",
    skick: "Bra",
    matt: "70 × 50 cm",
    inkopsar: 2015,
    varde: 2400,
    avdelningId: "avd-b",
    rum: "Sal 14",
    status: "reserverad",
  },
  {
    id: "KOM-SIT-0401",
    namn: "Soffa tvåsits",
    kategori: "Sittmöbel",
    beskrivning: "Tvåsitssoffa i mörkgrått ylletyg. Ett mindre märke på höger armstöd.",
    skick: "Bra",
    matt: "160 × 85 cm",
    inkopsar: 2018,
    varde: 3400,
    avdelningId: "avd-c",
    rum: "Entré",
    status: "tillganglig",
  },
  {
    id: "KOM-SIT-0402",
    namn: "Fåtölj",
    kategori: "Sittmöbel",
    beskrivning: "Fåtölj med trästativ och blå klädsel. Nyklädd förra året.",
    skick: "Nyskick",
    matt: "72 × 78 cm",
    inkopsar: 2013,
    varde: 2200,
    avdelningId: "avd-d",
    rum: "Lagerhall A",
    status: "tillganglig",
  },
  {
    id: "KOM-BEL-0501",
    namn: "Golvlampa",
    kategori: "Belysning",
    beskrivning: "Golvlampa med dimmer och LED-ljuskälla. Fungerar.",
    skick: "Mycket bra",
    matt: "Höjd 180 cm",
    inkopsar: 2021,
    varde: 800,
    avdelningId: "avd-a",
    rum: "Kontorslandskap väst",
    status: "tillganglig",
  },
  {
    id: "KOM-BEL-0502",
    namn: "Skrivbordslampa",
    kategori: "Belysning",
    beskrivning: "Arkitektlampa med klämfäste. Åtta stycken finns, säljs som en post.",
    skick: "Bra",
    matt: "Armlängd 90 cm",
    inkopsar: 2017,
    varde: 1200,
    avdelningId: "avd-d",
    rum: "Lagerhall B",
    status: "tillganglig",
  },
  {
    id: "KOM-SKM-0601",
    namn: "Bildskärm 27 tum",
    kategori: "Skärm",
    beskrivning: "IPS-skärm med höj- och sänkbart stativ. HDMI och DisplayPort. Inga döda pixlar.",
    skick: "Mycket bra",
    matt: "27 tum",
    inkopsar: 2022,
    varde: 2100,
    avdelningId: "avd-a",
    rum: "Kontorslandskap öst",
    status: "tillganglig",
  },
  {
    id: "KOM-SKM-0602",
    namn: "Bildskärm 24 tum",
    kategori: "Skärm",
    beskrivning: "Äldre skärm med VGA och DVI. Fungerar men saknar HDMI.",
    skick: "Slitet",
    matt: "24 tum",
    inkopsar: 2014,
    varde: 300,
    avdelningId: "avd-b",
    rum: "Datasal",
    status: "avvecklad",
  },
  {
    id: "KOM-SKR-0201",
    namn: "Skrivbord fast höjd",
    kategori: "Skrivbord",
    beskrivning: "Skrivbord med fast höjd, skiva i vitlaminat.",
    skick: "Bra",
    matt: "140 × 70 cm",
    inkopsar: 2015,
    varde: 900,
    avdelningId: "avd-b",
    rum: "Arbetsrum 2",
    status: "tillganglig",
  },
  {
    id: "KOM-SKR-0202",
    namn: "Hörnskrivbord",
    kategori: "Skrivbord",
    beskrivning: "Hörnskrivbord i bok. Passar i hörn till vänster.",
    skick: "Bra",
    matt: "180 × 120 cm",
    inkopsar: 2012,
    varde: 700,
    avdelningId: "avd-d",
    rum: "Lagerhall A",
    status: "tillganglig",
  },
  {
    id: "KOM-FRV-0204",
    namn: "Skohylla",
    kategori: "Förvaring",
    beskrivning: "Skohylla i metall för entré. Tre plan.",
    skick: "Bra",
    matt: "90 × 30 × 60 cm",
    inkopsar: 2018,
    varde: 350,
    avdelningId: "avd-b",
    rum: "Entré",
    status: "flyttad",
  },
];

function tillInventarie(o: OvrigtObjekt): Inventarie {
  const avdelning = AVDELNINGAR.find((a) => a.id === o.avdelningId)!;
  return {
    id: o.id,
    namn: o.namn,
    kategori: o.kategori,
    beskrivning: o.beskrivning,
    skick: o.skick,
    matt: o.matt,
    inkopsar: o.inkopsar,
    uppskattatVarde: o.varde,
    placering: { avdelningId: o.avdelningId, adress: avdelning.adress, rum: o.rum },
    status: o.status,
    agandeAvdelningId: o.avdelningId,
    historik: [
      {
        datum: "2026-08-20",
        typ: "registrerad",
        avdelningId: o.avdelningId,
        kommentar: "Registrerad vid inventering.",
      },
      ...(o.status === "tillganglig"
        ? [
            {
              datum: "2026-08-21",
              typ: "publicerad" as const,
              avdelningId: o.avdelningId,
              kommentar: "Publicerad för internt övertagande.",
            },
          ]
        : []),
    ],
  };
}

export const INVENTARIER: Inventarie[] = [
  ...Array.from({ length: 15 }, (_, i) => skrivbord(i + 1)),
  ...OVRIGA.map(tillInventarie),
];

export const FORFRAGNINGAR: Forfragan[] = [
  {
    id: "FRF-1001",
    inventarieIds: ["KOM-BRD-0303"],
    franAvdelningId: "avd-c",
    tillAvdelningId: "avd-b",
    skapad: "2026-09-15",
    status: "vantar",
    meddelande: "Vi behöver tolv elevbord till studiehallen inför terminsstarten.",
  },
  {
    id: "FRF-1002",
    inventarieIds: ["KOM-FRV-0204"],
    franAvdelningId: "avd-b",
    tillAvdelningId: "avd-d",
    skapad: "2026-09-08",
    status: "godkand",
    meddelande: "Skohylla till entrén vid idrottshallen.",
  },
];

export const STARTAVDELNING = "avd-b";
