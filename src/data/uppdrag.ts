export type UppdragStatus = "ledigt" | "taget" | "levererat";

export interface Transportuppdrag {
  id: string;
  rubrik: string;
  inventarieId: string;
  antal: number;
  franAvdelningId: string;
  tillAvdelningId: string;
  senastDatum: string;
  ersattning: number;
  avstandKm: number;
  barhjalp: boolean;
  anteckning: string;
  status: UppdragStatus;
  utforareId: string | null;
}

export const TRANSPORTUPPDRAG: Transportuppdrag[] = [
  {
    id: "TRP-2041",
    rubrik: "12 elevbord",
    inventarieId: "KOM-BRD-0302",
    antal: 12,
    franAvdelningId: "avd-b",
    tillAvdelningId: "avd-c",
    senastDatum: "2026-09-24",
    ersattning: 1450,
    avstandKm: 4.2,
    barhjalp: true,
    anteckning: "Hämtas i sal 14 på bottenplan. Lastkaj finns på baksidan.",
    status: "ledigt",
    utforareId: null,
  },
  {
    id: "TRP-2042",
    rubrik: "2 höj- och sänkbara skrivbord",
    inventarieId: "KOM-SKR-0102",
    antal: 2,
    franAvdelningId: "avd-c",
    tillAvdelningId: "avd-f",
    senastDatum: "2026-09-21",
    ersattning: 620,
    avstandKm: 2.8,
    barhjalp: false,
    anteckning: "Skivorna är redan demonterade. Ryms i skåpbil.",
    status: "ledigt",
    utforareId: null,
  },
  {
    id: "TRP-2043",
    rubrik: "40 kontorsstolar",
    inventarieId: "KOM-STL-0201",
    antal: 40,
    franAvdelningId: "avd-a",
    tillAvdelningId: "avd-d",
    senastDatum: "2026-09-30",
    ersattning: 3800,
    avstandKm: 7.5,
    barhjalp: true,
    anteckning: "Kräver större bil eller två vändor. Hiss finns.",
    status: "ledigt",
    utforareId: null,
  },
  {
    id: "TRP-2044",
    rubrik: "Kartonger med bollar och koner",
    inventarieId: "KOM-BOL-0602",
    antal: 18,
    franAvdelningId: "avd-e",
    tillAvdelningId: "avd-b",
    senastDatum: "2026-09-20",
    ersattning: 480,
    avstandKm: 3.1,
    barhjalp: false,
    anteckning: "Arton kartonger, lätta men skrymmande.",
    status: "ledigt",
    utforareId: null,
  },
  {
    id: "TRP-2045",
    rubrik: "Konferensbord",
    inventarieId: "KOM-BRD-0301",
    antal: 1,
    franAvdelningId: "avd-c",
    tillAvdelningId: "avd-a",
    senastDatum: "2026-09-26",
    ersattning: 1100,
    avstandKm: 1.4,
    barhjalp: true,
    anteckning: "Tungt. Två personer krävs. Bordet går inte att dela.",
    status: "ledigt",
    utforareId: null,
  },
  {
    id: "TRP-2046",
    rubrik: "6 barnbord till förskola",
    inventarieId: "KOM-FSM-1501",
    antal: 6,
    franAvdelningId: "avd-f",
    tillAvdelningId: "avd-b",
    senastDatum: "2026-09-19",
    ersattning: 750,
    avstandKm: 5.6,
    barhjalp: false,
    anteckning: "Hämtning efter klockan 16 när verksamheten stängt.",
    status: "taget",
    utforareId: "anv-6",
  },
  {
    id: "TRP-2039",
    rubrik: "5 bordslampor",
    inventarieId: "KOM-BEL-1603",
    antal: 5,
    franAvdelningId: "avd-c",
    tillAvdelningId: "avd-b",
    senastDatum: "2026-09-12",
    ersattning: 320,
    avstandKm: 3.9,
    barhjalp: false,
    anteckning: "Levererad och kvitterad av mottagaren.",
    status: "levererat",
    utforareId: "anv-6",
  },
];
