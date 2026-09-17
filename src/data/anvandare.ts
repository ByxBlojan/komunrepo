export type Anvandartyp = "kommun" | "privatperson" | "leverantor" | "leveransbolag";

export interface Anvandare {
  id: string;
  typ: Anvandartyp;
  namn: string;
  personnummer: string;
  avdelningId: string;
  roll: string;
  organisation?: string;
}

export const ANVANDARE: Anvandare[] = [
  {
    id: "anv-1",
    typ: "kommun",
    namn: "Anna Svensson",
    personnummer: "19850312-4567",
    avdelningId: "avd-b",
    roll: "Bokande användare",
  },
  {
    id: "anv-2",
    typ: "kommun",
    namn: "Erik Lund",
    personnummer: "19790821-3312",
    avdelningId: "avd-a",
    roll: "Avdelningsansvarig",
  },
  {
    id: "anv-3",
    typ: "kommun",
    namn: "Sara Nyberg",
    personnummer: "19910605-8821",
    avdelningId: "avd-c",
    roll: "Avdelningsansvarig",
  },
  {
    id: "anv-4",
    typ: "kommun",
    namn: "Jonas Ek",
    personnummer: "19831118-2290",
    avdelningId: "avd-d",
    roll: "Lageransvarig",
  },
  {
    id: "anv-5",
    typ: "privatperson",
    namn: "Karin Holm",
    personnummer: "19760914-1102",
    avdelningId: "avd-a",
    roll: "Invånare",
  },
  {
    id: "anv-6",
    typ: "leveransbolag",
    namn: "Peter Ahl",
    personnummer: "19880227-4471",
    avdelningId: "avd-d",
    roll: "Transportansvarig",
    organisation: "Nordisk Transport AB",
  },
  {
    id: "anv-7",
    typ: "leveransbolag",
    namn: "Milo Fransson",
    personnummer: "19950703-6654",
    avdelningId: "avd-d",
    roll: "Egen förare med skåpbil",
    organisation: "Ansluten via TiptApp",
  },
  {
    id: "anv-8",
    typ: "leverantor",
    namn: "Helena Bark",
    personnummer: "19820419-7735",
    avdelningId: "avd-d",
    roll: "Säljansvarig",
    organisation: "Kontorsmiljö Syd AB",
  },
  {
    id: "anv-9",
    typ: "leverantor",
    namn: "Tomas Ruud",
    personnummer: "19770128-5519",
    avdelningId: "avd-d",
    roll: "Verkstadsansvarig",
    organisation: "Möbeltapetsering Väst",
  },
];

export function anvandarePerTyp(typ: Anvandartyp): Anvandare[] {
  return ANVANDARE.filter((a) => a.typ === typ);
}

export function hittaAnvandarePaPersonnummer(
  inmatat: string,
  typ: Anvandartyp,
): Anvandare | undefined {
  const rensat = inmatat.replace(/\D/g, "");
  if (rensat.length < 10) return undefined;
  return anvandarePerTyp(typ).find((a) =>
    a.personnummer.replace(/\D/g, "").endsWith(rensat.slice(-10)),
  );
}
