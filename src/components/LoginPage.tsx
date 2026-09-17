import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2, Recycle, Smartphone, ShieldCheck } from "lucide-react";
import { Falt, Inmatning, Knapp, Kort } from "@/components/ui/primitiver";
import { AVDELNINGAR } from "@/data/mockdata";
import { ANVANDARE, hittaAnvandarePaPersonnummer, type Anvandare } from "@/data/anvandare";

type Steg = "start" | "personnummer" | "vantar" | "klar";

interface Props {
  onInloggad: (anvandare: Anvandare) => void;
}

export function LoginPage({ onInloggad }: Props) {
  const [steg, setSteg] = useState<Steg>("start");
  const [personnummer, setPersonnummer] = useState("");
  const [fel, setFel] = useState<string | null>(null);
  const [vald, setVald] = useState<Anvandare | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

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
    const traff = hittaAnvandarePaPersonnummer(personnummer);
    if (!traff) {
      setFel("Personnumret finns inte bland demoanvändarna. Välj en identitet i listan nedan.");
      return;
    }
    startaLegitimering(traff);
  };

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center">
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
            {steg === "start" && (
              <>
                <h2 className="text-base font-semibold text-slate-900">Logga in</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                  Legitimera dig för att se din verksamhets inventarier.
                </p>

                <Knapp className="mt-5 h-11 w-full" onClick={() => setSteg("personnummer")}>
                  <ShieldCheck size={17} />
                  Logga in med BankID
                </Knapp>

                <DemoNotis />
              </>
            )}

            {steg === "personnummer" && (
              <>
                <button
                  onClick={() => {
                    setSteg("start");
                    setFel(null);
                  }}
                  className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft size={15} />
                  Tillbaka
                </button>

                <h2 className="text-base font-semibold text-slate-900">Mobilt BankID</h2>
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
                  <Smartphone size={17} />
                  Starta BankID
                </Knapp>

                <div className="mt-6 border-t border-[var(--border)] pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-400">
                    Demoidentiteter
                  </p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {ANVANDARE.map((a) => {
                      const avdelning = AVDELNINGAR.find((av) => av.id === a.avdelningId);
                      return (
                        <li key={a.id}>
                          <button
                            onClick={() => startaLegitimering(a)}
                            className="w-full rounded-md px-2.5 py-2 text-left hover:bg-slate-50"
                          >
                            <span className="block text-[13px] font-medium text-slate-800">{a.namn}</span>
                            <span className="block text-[11px] text-slate-500">
                              {avdelning?.namn} · {a.roll}
                            </span>
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
