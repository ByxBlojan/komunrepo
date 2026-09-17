export type Skick = "Nyskick" | "Mycket bra" | "Bra" | "Slitet";

export type InventarieStatus = "tillganglig" | "reserverad" | "flyttad" | "avvecklad";

export type Huvudkategori =
  | "Möbler"
  | "Idrott"
  | "IT och teknik"
  | "Kök och servering"
  | "Lek och förskola"
  | "Belysning";

export interface Underkategori {
  id: string;
  namn: string;
  huvudkategori: Huvudkategori;
}

export const UNDERKATEGORIER: Underkategori[] = [
  { id: "skrivbord", namn: "Skrivbord och höj- och sänkbara bord", huvudkategori: "Möbler" },
  { id: "kontorsstolar", namn: "Kontorsstolar", huvudkategori: "Möbler" },
  { id: "bord", namn: "Bord", huvudkategori: "Möbler" },
  { id: "forvaring", namn: "Förvaring", huvudkategori: "Möbler" },
  { id: "sittmobler", namn: "Soffor och fåtöljer", huvudkategori: "Möbler" },

  { id: "bollar", namn: "Bollar", huvudkategori: "Idrott" },
  { id: "traningsredskap", namn: "Träningsredskap", huvudkategori: "Idrott" },
  { id: "idrottsmaterial", namn: "Idrottsmaterial", huvudkategori: "Idrott" },

  { id: "skarmar", namn: "Bildskärmar", huvudkategori: "IT och teknik" },
  { id: "datorer", namn: "Datorer och surfplattor", huvudkategori: "IT och teknik" },
  { id: "projektorer", namn: "Projektorer och ljud", huvudkategori: "IT och teknik" },

  { id: "vitvaror", namn: "Vitvaror", huvudkategori: "Kök och servering" },
  { id: "servering", namn: "Serveringsutrustning", huvudkategori: "Kök och servering" },

  { id: "leksaker", namn: "Leksaker och pedagogiskt material", huvudkategori: "Lek och förskola" },
  { id: "forskolemobler", namn: "Möbler för förskola", huvudkategori: "Lek och förskola" },

  { id: "golvlampor", namn: "Golv- och bordslampor", huvudkategori: "Belysning" },
  { id: "arbetsbelysning", namn: "Arbetsbelysning", huvudkategori: "Belysning" },
];

export const HUVUDKATEGORIER: Huvudkategori[] = [
  "Möbler",
  "Idrott",
  "IT och teknik",
  "Kök och servering",
  "Lek och förskola",
  "Belysning",
];

export function underkategoriernaFor(huvud: Huvudkategori): Underkategori[] {
  return UNDERKATEGORIER.filter((u) => u.huvudkategori === huvud);
}

export function hittaUnderkategori(id: string): Underkategori | undefined {
  return UNDERKATEGORIER.find((u) => u.id === id);
}

export type ForfraganStatus = "vantar" | "godkand" | "avslagen";

export type HandelseTyp =
  | "registrerad"
  | "publicerad"
  | "forfragan"
  | "godkand"
  | "avslagen"
  | "flyttad";

export interface Avdelning {
  id: string;
  namn: string;
  typ: string;
  adress: string;
}

export interface Handelse {
  datum: string;
  typ: HandelseTyp;
  avdelningId: string;
  kommentar: string;
}

export interface Placering {
  avdelningId: string;
  adress: string;
  rum: string;
}

export interface Inventarie {
  id: string;
  namn: string;
  underkategoriId: string;
  beskrivning: string;
  skick: Skick;
  matt: string;
  antal: number;
  inkopsar: number;
  uppskattatVarde: number;
  placering: Placering;
  status: InventarieStatus;
  agandeAvdelningId: string;
  historik: Handelse[];
}

export interface Forfragan {
  id: string;
  inventarieIds: string[];
  franAvdelningId: string;
  tillAvdelningId: string;
  skapad: string;
  status: ForfraganStatus;
  meddelande: string;
}

export const STATUS_ETIKETT: Record<InventarieStatus, string> = {
  tillganglig: "Tillgänglig",
  reserverad: "Reserverad",
  flyttad: "Flyttad",
  avvecklad: "Avvecklad",
};

export const FORFRAGAN_ETIKETT: Record<ForfraganStatus, string> = {
  vantar: "Väntar på godkännande",
  godkand: "Godkänd",
  avslagen: "Avslagen",
};

export const HANDELSE_ETIKETT: Record<HandelseTyp, string> = {
  registrerad: "Registrerad i KommunCirkulär",
  publicerad: "Publicerad för internt övertagande",
  forfragan: "Förfrågan om övertagande",
  godkand: "Övergång godkänd",
  avslagen: "Förfrågan avslagen",
  flyttad: "Flyttad till ny placering",
};

export const SKICK_VARDEN: Skick[] = ["Nyskick", "Mycket bra", "Bra", "Slitet"];
