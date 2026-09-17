import { ArrowRight, Gavel, PackageCheck, PackagePlus, Search, Truck, Wrench } from "lucide-react";
import type { Page } from "@/components/AppSidebar";
import type { Anvandartyp } from "@/data/anvandare";

interface Lage {
  id: Page;
  rubrik: string;
  text: string;
  ikon: React.ElementType;
  typer: Anvandartyp[];
  klar: boolean;
}

const LAGEN: Lage[] = [
  {
    id: "handelsplats",
    rubrik: "Köpa",
    text: "Hitta möbler och utrustning som andra verksamheter erbjuder. Skicka en förfrågan och ta över utan inköpskostnad.",
    ikon: Search,
    typer: ["kommun", "privatperson"],
    klar: true,
  },
  {
    id: "mina",
    rubrik: "Sälja",
    text: "Lägg upp det ni inte längre behöver. Objektet märks med QR-kod och blir synligt för hela kommunen.",
    ikon: PackagePlus,
    typer: ["kommun"],
    klar: true,
  },
  {
    id: "leverans",
    rubrik: "Leverans",
    text: "Få hem det ni tagit över. Välj mellan gig-tjänster som TiptApp, en privatperson med släp eller ett upphandlat transportbolag.",
    ikon: PackageCheck,
    typer: ["kommun", "privatperson"],
    klar: false,
  },
  {
    id: "renovera",
    rubrik: "Renovera",
    text: "Rusta upp slitna möbler i stället för att kassera dem. Beställ klädsel, lagning och rekonditionering.",
    ikon: Wrench,
    typer: ["kommun"],
    klar: false,
  },
  {
    id: "upphandla",
    rubrik: "Upphandla",
    text: "För behov som inte kan täckas av befintliga inventarier. Underlaget visar vad som redan finns internt.",
    ikon: Gavel,
    typer: ["kommun"],
    klar: false,
  },
  {
    id: "transportuppdrag",
    rubrik: "Transportuppdrag",
    text: "Se tilldelade hämtningar och leveranser. Skanna objektets QR-kod vid hämtning och vid leverans.",
    ikon: Truck,
    typer: ["leverantor"],
    klar: false,
  },
];

interface Props {
  anvandartyp: Anvandartyp;
  namn: string;
  onValj: (sida: Page) => void;
  onSaFungerarDet: () => void;
}

export function ValjLagePage({ anvandartyp, namn, onValj, onSaFungerarDet }: Props) {
  const tillgangliga = LAGEN.filter((l) => l.typer.includes(anvandartyp));
  const ensam = tillgangliga.length === 1;

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Välkommen, {namn.split(" ")[0]}</h1>
        <p className="mt-2 text-[14px] text-slate-600">Vad vill du göra?</p>
      </div>

      <div
        className={
          "mt-8 grid gap-4 " + (ensam ? "mx-auto max-w-md" : "sm:grid-cols-2")
        }
      >
        {tillgangliga.map((lage) => {
          const Ikon = lage.ikon;
          return (
            <button
              key={lage.id}
              onClick={() => onValj(lage.id)}
              className="group flex flex-col items-start gap-3 rounded-lg border border-[var(--card-border)] bg-white p-6 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-[0_8px_22px_rgba(15,23,42,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary-hover)]">
                <Ikon size={24} />
              </span>

              <span className="flex items-center gap-2">
                <span className="text-lg font-semibold text-slate-900">{lage.rubrik}</span>
                {!lage.klar && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-slate-500">
                    Kommande
                  </span>
                )}
              </span>

              <span className="text-[13px] leading-relaxed text-slate-600">{lage.text}</span>

              <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-medium text-[var(--primary-hover)]">
                {lage.klar ? "Öppna" : "Se vad som planeras"}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onSaFungerarDet}
          className="text-[13px] font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
        >
          Så fungerar KommunCirkulär
        </button>
      </div>
    </div>
  );
}
