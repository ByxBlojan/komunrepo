import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Check, ChevronDown, Printer } from "lucide-react";
import { Inmatning, Knapp, Kort, Textyta } from "@/components/ui/primitiver";
import { HuvudkategoriBild, KategoriBild } from "@/data/bilder";
import {
  HUVUDKATEGORIER,
  hittaUnderkategori,
  underkategoriernaFor,
  type Huvudkategori,
  type Skick,
} from "@/data/typer";
import type { KommunCirkularState } from "@/lib/state";

interface Props {
  state: KommunCirkularState;
  onOppnaObjekt: (id: string) => void;
  onKlar: () => void;
}

const SKICK_VAL: { varde: Skick; etikett: string; text: string }[] = [
  { varde: "Nyskick", etikett: "Som ny", text: "Inga synliga skador" },
  { varde: "Bra", etikett: "Bra", text: "Några märken, fungerar väl" },
  { varde: "Slitet", etikett: "Sliten", text: "Tydligt använd" },
];

const TOMT = {
  namn: "",
  huvudkategori: "Möbler" as Huvudkategori,
  underkategoriId: "skrivbord",
  rum: "",
  skick: "Bra" as Skick,
  antal: "1",
  beskrivning: "",
  matt: "",
  inkopsar: "",
  varde: "",
};

export function RegistreraPage({ state, onOppnaObjekt, onKlar }: Props) {
  const [falt, setFalt] = useState(TOMT);
  const [fel, setFel] = useState<string | null>(null);
  const [visaMer, setVisaMer] = useState(false);
  const [klarId, setKlarId] = useState<string | null>(null);

  const andra = (nyckel: keyof typeof TOMT, varde: string) => {
    setFalt((prev) => ({ ...prev, [nyckel]: varde }));
    setFel(null);
  };

  const valjHuvudkategori = (huvud: Huvudkategori) => {
    setFalt((prev) => ({ ...prev, huvudkategori: huvud, underkategoriId: underkategoriernaFor(huvud)[0].id }));
  };

  const spara = () => {
    if (!falt.namn.trim()) {
      setFel("Skriv vad det är för sak.");
      return;
    }
    if (!falt.rum.trim()) {
      setFel("Skriv var saken står.");
      return;
    }

    const id = state.registreraInventarie({
      namn: falt.namn.trim(),
      underkategoriId: falt.underkategoriId,
      beskrivning: falt.beskrivning.trim() || "Ingen beskrivning angiven.",
      skick: falt.skick,
      matt: falt.matt.trim() || "Mått ej angivna",
      antal: Math.max(1, Number(falt.antal) || 1),
      inkopsar: Number(falt.inkopsar) || new Date().getFullYear(),
      uppskattatVarde: Number(falt.varde) || 0,
      rum: falt.rum.trim(),
    });

    setKlarId(id);
  };

  if (klarId) {
    return <Kvitto id={klarId} onOppna={() => onOppnaObjekt(klarId)} onMerTillLagg={() => { setFalt(TOMT); setKlarId(null); }} onKlar={onKlar} />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={onKlar}
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={15} />
        Tillbaka
      </button>

      <h1 className="text-2xl font-semibold text-slate-900">Lämna vidare något</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
        Fyll i tre saker, så blir den synlig för alla verksamheter i kommunen.
      </p>

      <div className="mt-7 flex flex-col gap-6">
        <Fraga nummer={1} rubrik="Vad är det för sak?">
          <Inmatning
            value={falt.namn}
            onChange={(e) => andra("namn", e.target.value)}
            placeholder="Till exempel: höj- och sänkbart skrivbord"
            className="h-12 text-[15px]"
            autoFocus
          />

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {HUVUDKATEGORIER.map((huvud) => (
              <button
                key={huvud}
                onClick={() => valjHuvudkategori(huvud)}
                className={
                  "flex items-center gap-2.5 overflow-clip rounded-lg border-2 p-2 text-left transition-colors " +
                  (falt.huvudkategori === huvud
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                    : "border-[var(--border)] bg-white hover:border-slate-300")
                }
              >
                <HuvudkategoriBild huvud={huvud} className="h-10 w-12 shrink-0 rounded" />
                <span className="text-[13px] font-medium leading-tight text-slate-800">{huvud}</span>
              </button>
            ))}
          </div>

          {underkategoriernaFor(falt.huvudkategori).length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {underkategoriernaFor(falt.huvudkategori).map((u) => (
                <button
                  key={u.id}
                  onClick={() => andra("underkategoriId", u.id)}
                  className={
                    "rounded-full border px-3.5 py-1.5 text-[13px] transition-colors " +
                    (falt.underkategoriId === u.id
                      ? "border-[var(--primary)] bg-[var(--primary-soft)] font-medium text-[var(--primary-hover)]"
                      : "border-[var(--border)] bg-white text-slate-600 hover:border-slate-300")
                  }
                >
                  {u.namn}
                </button>
              ))}
            </div>
          )}
        </Fraga>

        <Fraga nummer={2} rubrik="Var står den?">
          <Inmatning
            value={falt.rum}
            onChange={(e) => andra("rum", e.target.value)}
            placeholder="Till exempel: rum 214, plan 3"
            className="h-12 text-[15px]"
          />
          <p className="mt-2 text-[13px] text-slate-500">
            Verksamhet och adress fylls i automatiskt: {state.aktivAvdelning.namn}
          </p>
        </Fraga>

        <Fraga nummer={3} rubrik="Hur är skicket?">
          <div className="grid gap-2 sm:grid-cols-3">
            {SKICK_VAL.map((val) => (
              <button
                key={val.varde}
                onClick={() => andra("skick", val.varde)}
                className={
                  "rounded-lg border-2 px-4 py-3 text-left transition-colors " +
                  (falt.skick === val.varde
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                    : "border-[var(--border)] bg-white hover:border-slate-300")
                }
              >
                <span className="block text-[15px] font-semibold text-slate-900">{val.etikett}</span>
                <span className="mt-0.5 block text-xs text-slate-600">{val.text}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label htmlFor="antal" className="text-[14px] text-slate-700">
              Hur många?
            </label>
            <Inmatning
              id="antal"
              type="number"
              min={1}
              value={falt.antal}
              onChange={(e) => andra("antal", e.target.value)}
              className="h-11 w-24 text-center text-[15px]"
            />
          </div>
        </Fraga>
      </div>

      <div className="mt-6">
        <button
          onClick={() => setVisaMer((v) => !v)}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900"
        >
          <ChevronDown size={15} className={visaMer ? "rotate-180 transition-transform" : "transition-transform"} />
          Fler uppgifter, om du vill
        </button>

        {visaMer && (
          <Kort className="mt-3">
            <div className="flex flex-col gap-4 px-5 py-5">
              <div>
                <label htmlFor="besk" className="mb-1.5 block text-[13px] font-medium text-slate-700">
                  Beskrivning
                </label>
                <Textyta
                  id="besk"
                  rows={3}
                  value={falt.beskrivning}
                  onChange={(e) => andra("beskrivning", e.target.value)}
                  placeholder="Nämn gärna skador eller om något saknas."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="matt" className="mb-1.5 block text-[13px] font-medium text-slate-700">
                    Mått
                  </label>
                  <Inmatning id="matt" value={falt.matt} onChange={(e) => andra("matt", e.target.value)} placeholder="160 × 80 cm" />
                </div>
                <div>
                  <label htmlFor="ar" className="mb-1.5 block text-[13px] font-medium text-slate-700">
                    Inköpsår
                  </label>
                  <Inmatning id="ar" type="number" value={falt.inkopsar} onChange={(e) => andra("inkopsar", e.target.value)} placeholder="2019" />
                </div>
                <div>
                  <label htmlFor="varde" className="mb-1.5 block text-[13px] font-medium text-slate-700">
                    Värde per styck
                  </label>
                  <Inmatning id="varde" type="number" value={falt.varde} onChange={(e) => andra("varde", e.target.value)} placeholder="3200" />
                </div>
              </div>
            </div>
          </Kort>
        )}
      </div>

      {fel && (
        <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-[14px] text-amber-800">
          {fel}
        </p>
      )}

      <div className="mt-7 flex items-center gap-4 border-t border-[var(--border)] pt-6">
        <Knapp className="h-12 px-8 text-[15px]" onClick={spara}>
          Lägg upp
        </Knapp>
        <div className="flex items-center gap-2 text-[13px] text-slate-500">
          <KategoriBild underkategoriId={falt.underkategoriId} className="h-9 w-11 rounded" />
          {hittaUnderkategori(falt.underkategoriId)?.namn}
        </div>
      </div>
    </div>
  );
}

function Fraga({ nummer, rubrik, children }: { nummer: number; rubrik: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-[13px] font-semibold text-white">
          {nummer}
        </span>
        <h2 className="text-[17px] font-semibold text-slate-900">{rubrik}</h2>
      </div>
      <div className="pl-[38px]">{children}</div>
    </section>
  );
}

interface KvittoProps {
  id: string;
  onOppna: () => void;
  onMerTillLagg: () => void;
  onKlar: () => void;
}

function Kvitto({ id, onOppna, onMerTillLagg, onKlar }: KvittoProps) {
  const adress = `${window.location.origin}${window.location.pathname}#/objekt/${id}`;

  return (
    <div className="mx-auto max-w-lg py-4 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-soft)]">
        <Check size={32} className="text-[var(--primary)]" />
      </span>

      <h1 className="mt-5 text-2xl font-semibold text-slate-900">Klart!</h1>
      <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-slate-600">
        Saken syns nu för alla verksamheter i kommunen. Skriv ut lappen och tejpa den på saken.
      </p>

      <Kort className="mt-6">
        <div className="flex flex-col items-center gap-3 px-6 py-7">
          <div className="rounded-lg border border-[var(--border)] bg-white p-4">
            <QRCodeSVG value={adress} size={180} level="M" />
          </div>
          <p className="font-mono text-[15px] font-semibold text-slate-800">{id}</p>
          <p className="max-w-xs text-[13px] leading-relaxed text-slate-500">
            Den som skannar koden ser vad saken är, var den står och vem som ansvarar för den.
          </p>
        </div>
      </Kort>

      <div className="mt-6 flex flex-col gap-2">
        <Knapp className="h-12 text-[15px]" onClick={() => window.print()}>
          <Printer size={17} />
          Skriv ut lappen
        </Knapp>
        <Knapp variant="kontur" className="h-11" onClick={onOppna}>
          Titta på annonsen
        </Knapp>
        <div className="mt-2 flex justify-center gap-4">
          <button onClick={onMerTillLagg} className="text-[13px] font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900">
            Lägg upp något mer
          </button>
          <button onClick={onKlar} className="text-[13px] font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900">
            Till startsidan
          </button>
        </div>
      </div>
    </div>
  );
}
