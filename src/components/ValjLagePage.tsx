import { useEffect, useState } from "react";
import { ArrowRight, Gavel, PackageCheck, Truck, Wrench } from "lucide-react";
import type { Page } from "@/components/AppSidebar";
import type { Anvandartyp } from "@/data/anvandare";

interface Huvudval {
  id: Page;
  rubrik: string;
  text: string;
  bild: React.ReactNode;
  typer: Anvandartyp[];
}

const HUVUDVAL: Huvudval[] = [
  {
    id: "registrera",
    rubrik: "Jag har något att lämna vidare",
    text: "En möbel eller pryl som din verksamhet inte behöver längre. Du fyller i tre saker, sedan är den synlig för hela kommunen.",
    bild: <LamnaVidareBild />,
    typer: ["kommun"],
  },
  {
    id: "handelsplats",
    rubrik: "Jag behöver något",
    text: "Se vad andra verksamheter erbjuder just nu. Hittar du något skickar du en förfrågan — det kostar ingenting.",
    bild: <HittaBild />,
    typer: ["kommun", "privatperson"],
  },
];

interface Genvag {
  id: Page;
  etikett: string;
  ikon: React.ElementType;
  typer: Anvandartyp[];
}

const GENVAGAR: Genvag[] = [
  { id: "leverans", etikett: "Leverans", ikon: PackageCheck, typer: ["kommun", "privatperson"] },
  { id: "renovera", etikett: "Renovera", ikon: Wrench, typer: ["kommun", "leverantor"] },
  { id: "upphandla", etikett: "Upphandla", ikon: Gavel, typer: ["kommun", "leverantor"] },
  { id: "transportuppdrag", etikett: "Transportuppdrag", ikon: Truck, typer: ["leveransbolag"] },
];

interface Props {
  anvandartyp: Anvandartyp;
  namn: string;
  statistik: { sparat: number; paMarknaden: number; pagaende: number };
  onValj: (sida: Page) => void;
  onSaFungerarDet: () => void;
}

export function ValjLagePage({ anvandartyp, namn, statistik, onValj, onSaFungerarDet }: Props) {
  const huvudval = HUVUDVAL.filter((v) => v.typer.includes(anvandartyp));
  const genvagar = GENVAGAR.filter((g) => g.typer.includes(anvandartyp));
  const fornamn = namn.split(" ")[0];

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="text-center">
        <h1 className="text-[26px] font-semibold text-slate-900">Hej {fornamn}!</h1>
        <p className="mt-2 text-[16px] text-slate-600">Vad vill du göra?</p>
      </div>

      <Ticker statistik={statistik} />

      <div className="mt-8 flex flex-col gap-4">
        {huvudval.map((val) => (
          <button
            key={val.id}
            onClick={() => onValj(val.id)}
            className="group flex items-center gap-5 rounded-xl border-2 border-[var(--card-border)] bg-white p-6 text-left transition-all hover:border-[var(--primary)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.09)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
          >
            <span className="hidden shrink-0 sm:block">{val.bild}</span>

            <span className="min-w-0 flex-1">
              <span className="block text-[19px] font-semibold leading-snug text-slate-900">
                {val.rubrik}
              </span>
              <span className="mt-1.5 block text-[14px] leading-relaxed text-slate-600">{val.text}</span>
            </span>

            <ArrowRight
              size={26}
              className="shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-[var(--primary)]"
            />
          </button>
        ))}
      </div>

      {genvagar.length > 0 && (
        <div className="mt-10 border-t border-[var(--border)] pt-5">
          <p className="mb-3 text-center text-[13px] text-slate-500">Andra saker du kan göra</p>
          <div className="flex flex-wrap justify-center gap-2">
            {genvagar.map((g) => {
              const Ikon = g.ikon;
              return (
                <button
                  key={g.id}
                  onClick={() => onValj(g.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
                >
                  <Ikon size={15} />
                  {g.etikett}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={onSaFungerarDet}
          className="text-[13px] font-medium text-slate-500 underline underline-offset-2 hover:text-slate-800"
        >
          Så fungerar KommunCirkulär
        </button>
      </div>
    </div>
  );
}

function Ticker({ statistik }: { statistik: { sparat: number; paMarknaden: number; pagaende: number } }) {
  const sparat = useRaknasUpp(statistik.sparat);
  const objekt = useRaknasUpp(statistik.paMarknaden);

  return (
    <div className="mt-7 grid gap-px overflow-clip rounded-xl border border-[var(--card-border)] bg-[var(--border)] sm:grid-cols-3">
      <TickerRuta
        varde={`${sparat.toLocaleString("sv-SE")} kr`}
        etikett="Sparade skattepengar"
        stark
      />
      <TickerRuta varde={objekt.toLocaleString("sv-SE")} etikett="Objekt på marknaden" />
      <TickerRuta varde={String(statistik.pagaende)} etikett="Leveranser pågår" />
    </div>
  );
}

function TickerRuta({ varde, etikett, stark }: { varde: string; etikett: string; stark?: boolean }) {
  return (
    <div className="bg-white px-5 py-4 text-center">
      <p
        className={
          "text-[22px] font-semibold tabular-nums " +
          (stark ? "text-[var(--primary-hover)]" : "text-slate-900")
        }
      >
        {varde}
      </p>
      <p className="mt-0.5 text-[12px] text-slate-500">{etikett}</p>
    </div>
  );
}

function useRaknasUpp(mal: number): number {
  const [varde, setVarde] = useState(0);

  useEffect(() => {
    if (mal === 0) {
      setVarde(0);
      return;
    }

    const steg = 28;
    const tid = 900 / steg;
    let n = 0;

    const timer = setInterval(() => {
      n += 1;
      const andel = n / steg;
      const mjuk = 1 - Math.pow(1 - andel, 3);
      setVarde(Math.round(mal * mjuk));
      if (n >= steg) clearInterval(timer);
    }, tid);

    return () => clearInterval(timer);
  }, [mal]);

  return varde;
}

function LamnaVidareBild() {
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20" role="presentation">
      <rect width="96" height="96" rx="14" fill="var(--primary-soft)" />
      <rect x="20" y="42" width="56" height="6" rx="2" fill="#15803d" />
      <path d="M28 48v22M68 48v22" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
      <path d="M48 36V18M40 26l8-8 8 8" stroke="#15803d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function HittaBild() {
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20" role="presentation">
      <rect width="96" height="96" rx="14" fill="var(--primary-soft)" />
      <circle cx="44" cy="43" r="19" stroke="#15803d" strokeWidth="6" fill="none" />
      <path d="M58 57l14 14" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
      <path d="M36 43h16M44 35v16" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
