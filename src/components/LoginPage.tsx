import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Loader2,
  Recycle,
  Smartphone,
  Store,
  Truck,
  User,
  ShieldCheck,
} from "lucide-react";
import { Falt, Inmatning, Knapp, Kort } from "@/components/ui/primitiver";
import { AVDELNINGAR } from "@/data/mockdata";
import {
  anvandarePerTyp,
  hittaAnvandarePaPersonnummer,
  type Anvandare,
  type Anvandartyp,
} from "@/data/anvandare";

type Steg = "valjTyp" | "personnummer" | "vantar" | "klar";

interface Props {
  onInloggad: (anvandare: Anvandare) => void;
}

interface TypVal {
  typ: Anvandartyp;
  rubrik: string;
  text: string;
  ikon: React.ElementType;
}

const TYPER: TypVal[] = [
  {
    typ: "kommun",
    rubrik: "Kommun",
    text: "Du arbetar i en kommunal verksamhet och vill hitta, erbjuda eller ta över inventarier internt.",
    ikon: Building2,
  },
  {
    typ: "privatperson",
    rubrik: "Privatperson",
    text: "Du är invånare och vill se vad kommunen erbjuder externt.",
    ikon: User,
  },
  {
    typ: "leveransbolag",
    rubrik: "Leveransbolag",
    text: "Du kör hämtningar och leveranser åt kommunen — som transportbolag eller ansluten förare.",
    ikon: Truck,
  },
  {
    typ: "leverantor",
    rubrik: "Leverantör",
    text: "Du säljer till kommunen eller utför renoveringar av befintliga inventarier.",
    ikon: Store,
  },
];

export function LoginPage({ onInloggad }: Props) {
  const [steg, setSteg] = useState<Steg>("valjTyp");
  const [typ, setTyp] = useState<Anvandartyp | null>(null);
  const [personnummer, setPersonnummer] = useState("");
  const [fel, setFel] = useState<string | null>(null);
  const [vald, setVald] = useState<Anvandare | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const valjTyp = (nyTyp: Anvandartyp) => {
    setTyp(nyTyp);
    setPersonnummer("");
    setFel(null);
    setSteg("personnummer");
  };

  const startaLegitimering = (anvandare: Anvandare) => {
    setVald(anvandare);
    setFel(null);
    setSteg("vantar");

    timers.current.push(
      setTimeout(() => setSteg("klar"), 1900),
      setTimeout(() => onInloggad(anvandare), 2700),
    );
  };

  const skickaPersonnummer = () => {
    if (!typ) return;
    const traff = hittaAnvandarePaPersonnummer(personnummer, typ);
    if (!traff) {
      setFel("Personnumret finns inte bland demoanvändarna. Välj en identitet i listan nedan.");
      return;
    }
    startaLegitimering(traff);
  };

  const valdTyp = TYPER.find((t) => t.typ === typ);

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--primary)]">
              <Recycle size={19} className="text-white" />
            </span>
            <span className="text-lg font-semibold text-slate-900">KommunCirkulär</span>
          </div>

          <h1 className="mt-6 text-2xl font-semibold leading-tight text-slate-900">
            Använd det kommunen redan äger
          </h1>

          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-slate-600">
            Möbler och utrustning som en verksamhet inte längre behöver syns direkt för alla andra. Varje objekt
            får en QR-kod, och övertagandet godkänns av den avdelning som äger det.
          </p>

          <ul className="mt-6 flex flex-col gap-2.5">
            {[
              "Gemensam överblick över tillgängliga inventarier",
              "Rollstyrt godkännande innan något flyttas",
              "Spårbar placering, ansvar och historik",
            ].map((rad) => (
              <li key={rad} className="flex items-start gap-2.5 text-[13px] text-slate-700">
                <Check size={15} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                {rad}
              </li>
            ))}
          </ul>
        </div>

        <Kort>
          <div className="px-6 py-6">
            {steg === "valjTyp" && (
              <>
                <h2 className="text-base font-semibold text-slate-900">Vem loggar in?</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                  Välj hur du använder plattformen, så visar vi rätt saker för dig.
                </p>

                <div className="mt-5 flex flex-col gap-2">
                  {TYPER.map((val) => {
                    const Ikon = val.ikon;
                    return (
                      <button
                        key={val.typ}
                        onClick={() => valjTyp(val.typ)}
                        className="group flex items-start gap-3 rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-left transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--primary-soft)] text-[var(--primary-hover)]">
                          <Ikon size={18} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-slate-900">{val.rubrik}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">{val.text}</span>
                        </span>
                        <ArrowRight
                          size={16}
                          className="mt-2 shrink-0 text-slate-300 transition-colors group-hover:text-[var(--primary)]"
                        />
                      </button>
                    );
                  })}
                </div>

                <DemoNotis />
              </>
            )}

            {steg === "personnummer" && valdTyp && (
              <>
                <button
                  onClick={() => {
                    setSteg("valjTyp");
                    setFel(null);
                  }}
                  className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft size={15} />
                  Byt användartyp
                </button>

                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-2.5 py-1">
                  <valdTyp.ikon size={13} className="text-[var(--primary-hover)]" />
                  <span className="text-[11px] font-semibold text-[var(--primary-hover)]">{valdTyp.rubrik}</span>
                </div>

                <h2 className="text-base font-semibold text-slate-900">Logga in med BankID</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                  Ange personnummer så startas legitimeringen.
                </p>

                <div className="mt-4">
                  <Falt etikett="Personnummer" htmlFor="pnr" hjalptext="Tolv siffror, till exempel 198503124567">
                    <Inmatning
                      id="pnr"
                      value={personnummer}
                      onChange={(e) => setPersonnummer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") skickaPersonnummer();
                      }}
                      placeholder="ÅÅÅÅMMDD-XXXX"
                      className="font-mono"
                      inputMode="numeric"
                    />
                  </Falt>
                </div>

                {fel && (
                  <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
                    {fel}
                  </p>
                )}

                <Knapp className="mt-4 h-11 w-full" onClick={skickaPersonnummer}>
                  <ShieldCheck size={17} />
                  Starta BankID
                </Knapp>

                <div className="mt-6 border-t border-[var(--border)] pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-400">
                    Demoidentiteter
                  </p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {anvandarePerTyp(valdTyp.typ).map((a) => {
                      const avdelning = AVDELNINGAR.find((av) => av.id === a.avdelningId);
                      const under =
                        a.typ === "kommun"
                          ? `${avdelning?.namn} · ${a.roll}`
                          : a.organisation
                            ? `${a.organisation} · ${a.roll}`
                            : a.roll;
                      return (
                        <li key={a.id}>
                          <button
                            onClick={() => startaLegitimering(a)}
                            className="w-full rounded-md px-2.5 py-2 text-left hover:bg-slate-50"
                          >
                            <span className="block text-[13px] font-medium text-slate-800">{a.namn}</span>
                            <span className="block text-[11px] text-slate-500">{under}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}

            {steg === "vantar" && (
              <div className="flex flex-col items-center py-6 text-center">
                <Loader2 size={30} className="animate-spin text-[var(--primary)]" />
                <p className="mt-4 text-sm font-medium text-slate-900">Starta BankID-appen</p>
                <p className="mt-1 max-w-[260px] text-[13px] leading-relaxed text-slate-600">
                  Legitimering pågår för {vald?.namn}. Håll appen öppen tills det är klart.
                </p>
                <Smartphone size={16} className="mt-4 text-slate-300" />
                <DemoNotis />
              </div>
            )}

            {steg === "klar" && (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-soft)]">
                  <Check size={24} className="text-[var(--primary)]" />
                </span>
                <p className="mt-4 text-sm font-medium text-slate-900">Legitimeringen lyckades</p>
                <p className="mt-1 text-[13px] text-slate-600">Välkommen, {vald?.namn}.</p>
              </div>
            )}
          </div>
        </Kort>
      </div>
    </div>
  );
}

function DemoNotis() {
  return (
    <p className="mt-5 rounded-md border border-[var(--border)] bg-slate-50 px-3 py-2.5 text-[11px] leading-relaxed text-slate-500">
      Demoläge. Ingen legitimering sker på riktigt och inga uppgifter lämnar den här datorn.
    </p>
  );
}
