export interface Anvandare {
  id: string;
  namn: string;
  personnummer: string;
  avdelningId: string;
  roll: string;
}

export const ANVANDARE: Anvandare[] = [
  {
    id: "anv-1",
    namn: "Anna Svensson",
    personnummer: "19850312-4567",
    avdelningId: "avd-b",
    roll: "Bokande användare",
  },
  {
    id: "anv-2",
    namn: "Erik Lund",
    personnummer: "19790821-3312",
    avdelningId: "avd-a",
    roll: "Avdelningsansvarig",
  },
  {
    id: "anv-3",
    namn: "Sara Nyberg",
    personnummer: "19910605-8821",
    avdelningId: "avd-c",
    roll: "Avdelningsansvarig",
  },
  {
    id: "anv-4",
    namn: "Jonas Ek",
    personnummer: "19831118-2290",
    avdelningId: "avd-d",
    roll: "Lageransvarig",
  },
];

export function hittaAnvandarePaPersonnummer(inmatat: string): Anvandare | undefined {
  const rensat = inmatat.replace(/\D/g, "");
  if (rensat.length < 10) return undefined;
  return ANVANDARE.find((a) => a.personnummer.replace(/\D/g, "").endsWith(rensat.slice(-10)));
}
