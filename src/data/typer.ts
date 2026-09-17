export type Skick = "Nyskick" | "Mycket bra" | "Bra" | "Slitet";

export type InventarieStatus = "tillganglig" | "reserverad" | "flyttad" | "avvecklad";

export type Kategori =
  | "Skrivbord"
  | "Kontorsstol"
  | "Förvaring"
  | "Bord"
  | "Sittmöbel"
  | "Belysning"
  | "Skärm";

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
  kategori: Kategori;
  beskrivning: string;
  skick: Skick;
  matt: string;
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

export const KATEGORIER: Kategori[] = [
  "Skrivbord",
  "Kontorsstol",
  "Förvaring",
  "Bord",
  "Sittmöbel",
  "Belysning",
  "Skärm",
];

export const SKICK_VARDEN: Skick[] = ["Nyskick", "Mycket bra", "Bra", "Slitet"];
