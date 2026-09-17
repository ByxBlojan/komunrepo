import { useCallback, useMemo, useState } from "react";
import { AVDELNINGAR, FORFRAGNINGAR, INVENTARIER } from "@/data/mockdata";
import { ANVANDARE, type Anvandare } from "@/data/anvandare";
import { TRANSPORTUPPDRAG, type Transportuppdrag } from "@/data/uppdrag";
import type { Forfragan, Inventarie, Skick } from "@/data/typer";
import { idagIso } from "@/lib/utils";

const UNDERKATEGORI_PREFIX: Record<string, string> = {
  skrivbord: "SKR",
  kontorsstolar: "STL",
  bord: "BRD",
  forvaring: "FRV",
  sittmobler: "SIT",
  bollar: "BOL",
  traningsredskap: "TRR",
  idrottsmaterial: "IDM",
  skarmar: "SKM",
  datorer: "DAT",
  projektorer: "PRJ",
  vitvaror: "VIT",
  servering: "SRV",
  leksaker: "LEK",
  forskolemobler: "FSM",
  golvlampor: "BEL",
  arbetsbelysning: "BEL",
};

export interface NyttInventarie {
  namn: string;
  underkategoriId: string;
  beskrivning: string;
  skick: Skick;
  matt: string;
  antal: number;
  inkopsar: number;
  uppskattatVarde: number;
  rum: string;
}

function nastaId(underkategoriId: string, befintliga: Inventarie[]): string {
  const prefix = UNDERKATEGORI_PREFIX[underkategoriId] ?? "OVR";
  const nummer = befintliga
    .filter((i) => i.id.startsWith(`KOM-${prefix}-`))
    .map((i) => Number(i.id.split("-")[2]))
    .filter((n) => !Number.isNaN(n));
  const hogsta = nummer.length > 0 ? Math.max(...nummer) : 0;
  return `KOM-${prefix}-${String(hogsta + 1).padStart(4, "0")}`;
}

export function useKommunCirkular() {
  const [inventarier, setInventarier] = useState<Inventarie[]>(INVENTARIER);
  const [forfragningar, setForfragningar] = useState<Forfragan[]>(FORFRAGNINGAR);
  const [uppdrag, setUppdrag] = useState<Transportuppdrag[]>(TRANSPORTUPPDRAG);
  const [aktivAnvandareId, setAktivAnvandareId] = useState<string | null>(null);

  const aktivAnvandare = useMemo(
    () => ANVANDARE.find((a) => a.id === aktivAnvandareId) ?? null,
    [aktivAnvandareId],
  );

  const aktivAvdelningId = aktivAnvandare?.avdelningId ?? AVDELNINGAR[0].id;

  const aktivAvdelning = useMemo(
    () => AVDELNINGAR.find((a) => a.id === aktivAvdelningId)!,
    [aktivAvdelningId],
  );

  const loggaIn = useCallback((anvandare: Anvandare) => {
    setAktivAnvandareId(anvandare.id);
  }, []);

  const loggaUt = useCallback(() => {
    setAktivAnvandareId(null);
  }, []);

  const hamtaAvdelning = useCallback(
    (id: string) => AVDELNINGAR.find((a) => a.id === id) ?? AVDELNINGAR[0],
    [],
  );

  const hamtaInventarie = useCallback(
    (id: string) => inventarier.find((i) => i.id === id),
    [inventarier],
  );

  const registreraInventarie = useCallback(
    (data: NyttInventarie): string => {
      const id = nastaId(data.underkategoriId, inventarier);
      const avdelning = AVDELNINGAR.find((a) => a.id === aktivAvdelningId)!;
      const datum = idagIso();

      const nytt: Inventarie = {
        id,
        namn: data.namn,
        underkategoriId: data.underkategoriId,
        beskrivning: data.beskrivning,
        skick: data.skick,
        matt: data.matt,
        antal: data.antal,
        inkopsar: data.inkopsar,
        uppskattatVarde: data.uppskattatVarde,
        placering: { avdelningId: avdelning.id, adress: avdelning.adress, rum: data.rum },
        status: "tillganglig",
        agandeAvdelningId: avdelning.id,
        historik: [
          { datum, typ: "registrerad", avdelningId: avdelning.id, kommentar: "Registrerad och märkt med QR-kod." },
          { datum, typ: "publicerad", avdelningId: avdelning.id, kommentar: "Publicerad för internt övertagande." },
        ],
      };

      setInventarier((prev) => [nytt, ...prev]);
      return id;
    },
    [aktivAvdelningId, inventarier],
  );

  const skapaForfragan = useCallback(
    (inventarieId: string, meddelande: string): string | null => {
      const objekt = inventarier.find((i) => i.id === inventarieId);
      if (!objekt || objekt.status !== "tillganglig") return null;

      const id = `FRF-${Date.now().toString().slice(-6)}`;
      const datum = idagIso();

      setForfragningar((prev) => [
        {
          id,
          inventarieIds: [inventarieId],
          franAvdelningId: aktivAvdelningId,
          tillAvdelningId: objekt.agandeAvdelningId,
          skapad: datum,
          status: "vantar",
          meddelande,
        },
        ...prev,
      ]);

      setInventarier((prev) =>
        prev.map((i) =>
          i.id === inventarieId
            ? {
                ...i,
                status: "reserverad",
                historik: [
                  ...i.historik,
                  {
                    datum,
                    typ: "forfragan",
                    avdelningId: aktivAvdelningId,
                    kommentar: "Förfrågan om övertagande skickad.",
                  },
                ],
              }
            : i,
        ),
      );

      return id;
    },
    [aktivAvdelningId, inventarier],
  );

  const godkannForfragan = useCallback(
    (forfraganId: string) => {
      const forfragan = forfragningar.find((f) => f.id === forfraganId);
      if (!forfragan || forfragan.status !== "vantar") return;

      const mottagare = AVDELNINGAR.find((a) => a.id === forfragan.franAvdelningId)!;
      const datum = idagIso();

      setForfragningar((prev) =>
        prev.map((f) => (f.id === forfraganId ? { ...f, status: "godkand" } : f)),
      );

      setInventarier((prev) =>
        prev.map((i) =>
          forfragan.inventarieIds.includes(i.id)
            ? {
                ...i,
                status: "flyttad",
                agandeAvdelningId: mottagare.id,
                placering: { avdelningId: mottagare.id, adress: mottagare.adress, rum: "Ny placering" },
                historik: [
                  ...i.historik,
                  {
                    datum,
                    typ: "godkand",
                    avdelningId: forfragan.tillAvdelningId,
                    kommentar: `Övergång till ${mottagare.namn} godkänd.`,
                  },
                  {
                    datum,
                    typ: "flyttad",
                    avdelningId: mottagare.id,
                    kommentar: `Ny placering: ${mottagare.adress}. Ansvaret överfört.`,
                  },
                ],
              }
            : i,
        ),
      );
    },
    [forfragningar],
  );

  const avslaForfragan = useCallback(
    (forfraganId: string) => {
      const forfragan = forfragningar.find((f) => f.id === forfraganId);
      if (!forfragan || forfragan.status !== "vantar") return;

      const datum = idagIso();

      setForfragningar((prev) =>
        prev.map((f) => (f.id === forfraganId ? { ...f, status: "avslagen" } : f)),
      );

      setInventarier((prev) =>
        prev.map((i) =>
          forfragan.inventarieIds.includes(i.id)
            ? {
                ...i,
                status: "tillganglig",
                historik: [
                  ...i.historik,
                  {
                    datum,
                    typ: "avslagen",
                    avdelningId: forfragan.tillAvdelningId,
                    kommentar: "Förfrågan avslagen. Objektet är tillgängligt igen.",
                  },
                ],
              }
            : i,
        ),
      );
    },
    [forfragningar],
  );

  const inkommandeForfragningar = useMemo(
    () => forfragningar.filter((f) => f.tillAvdelningId === aktivAvdelningId),
    [forfragningar, aktivAvdelningId],
  );

  const egnaForfragningar = useMemo(
    () => forfragningar.filter((f) => f.franAvdelningId === aktivAvdelningId),
    [forfragningar, aktivAvdelningId],
  );

  const antalAttGodkanna = useMemo(
    () => inkommandeForfragningar.filter((f) => f.status === "vantar").length,
    [inkommandeForfragningar],
  );

  const minaInventarier = useMemo(
    () => inventarier.filter((i) => i.agandeAvdelningId === aktivAvdelningId),
    [inventarier, aktivAvdelningId],
  );

  const taUppdrag = useCallback(
    (uppdragId: string) => {
      if (!aktivAnvandareId) return;
      setUppdrag((prev) =>
        prev.map((u) =>
          u.id === uppdragId && u.status === "ledigt"
            ? { ...u, status: "taget", utforareId: aktivAnvandareId }
            : u,
        ),
      );
    },
    [aktivAnvandareId],
  );

  const markeraLevererat = useCallback((uppdragId: string) => {
    setUppdrag((prev) =>
      prev.map((u) => (u.id === uppdragId && u.status === "taget" ? { ...u, status: "levererat" } : u)),
    );
  }, []);

  const ledigaUppdrag = useMemo(() => uppdrag.filter((u) => u.status === "ledigt"), [uppdrag]);

  const minaUppdrag = useMemo(
    () => uppdrag.filter((u) => u.utforareId === aktivAnvandareId && u.status !== "ledigt"),
    [uppdrag, aktivAnvandareId],
  );

  const statistik = useMemo(() => {
    const flyttade = inventarier.filter((i) => i.status === "flyttad");
    const sparat = flyttade.reduce((summa, i) => summa + i.uppskattatVarde * i.antal, 0);
    const paMarknaden = inventarier
      .filter((i) => i.status === "tillganglig")
      .reduce((summa, i) => summa + i.antal, 0);
    const pagaende = uppdrag.filter((u) => u.status === "taget").length;

    return { sparat, paMarknaden, pagaende, antalFlyttade: flyttade.length };
  }, [inventarier, uppdrag]);

  return {
    avdelningar: AVDELNINGAR,
    anvandare: ANVANDARE,
    aktivAnvandare,
    arInloggad: aktivAnvandare !== null,
    loggaIn,
    loggaUt,
    aktivAvdelning,
    inventarier,
    minaInventarier,
    hamtaInventarie,
    hamtaAvdelning,
    registreraInventarie,
    skapaForfragan,
    godkannForfragan,
    avslaForfragan,
    inkommandeForfragningar,
    egnaForfragningar,
    antalAttGodkanna,
    ledigaUppdrag,
    minaUppdrag,
    taUppdrag,
    markeraLevererat,
    statistik,
  };
}

export type KommunCirkularState = ReturnType<typeof useKommunCirkular>;
