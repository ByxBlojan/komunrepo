import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Falt, Inmatning, Knapp, Kort, KortHuvud, Textyta, Vallista } from "@/components/ui/primitiver";
import { Sidrubrik, SuccessBanner, useSuccessBanner } from "@/components/Delat";
import { KategoriBild } from "@/data/bilder";
import { KATEGORIER, SKICK_VARDEN, type Kategori, type Skick } from "@/data/typer";
import type { KommunCirkularState } from "@/lib/state";

interface Props {
  state: KommunCirkularState;
  onOppnaObjekt: (id: string) => void;
}

const TOMT = {
  namn: "",
  kategori: "Skrivbord" as Kategori,
  beskrivning: "",
  skick: "Bra" as Skick,
  matt: "",
  inkopsar: "",
  varde: "",
  rum: "",
};

export function RegistreraPage({ state, onOppnaObjekt }: Props) {
  const [falt, setFalt] = useState(TOMT);
  const [fel, setFel] = useState<string | null>(null);
  const [senasteId, setSenasteId] = useState<string | null>(null);
  const banner = useSuccessBanner();

  const andra = (nyckel: keyof typeof TOMT, varde: string) => {
    setFalt((prev) => ({ ...prev, [nyckel]: varde }));
  };

  const spara = () => {
    if (!falt.namn.trim()) {
      setFel("Ange vad inventariet heter.");
      return;
    }
    if (!falt.rum.trim()) {
      setFel("Ange var objektet står i dag.");
      return;
    }

    setFel(null);
    const id = state.registreraInventarie({
      namn: falt.namn.trim(),
      kategori: falt.kategori,
      beskrivning: falt.beskrivning.trim() || "Ingen beskrivning angiven.",
      skick: falt.skick,
      matt: falt.matt.trim() || "Mått ej angivna",
      inkopsar: Number(falt.inkopsar) || new Date().getFullYear(),
      uppskattatVarde: Number(falt.varde) || 0,
      rum: falt.rum.trim(),
    });

    setSenasteId(id);
    setFalt(TOMT);
    banner.visa(`Inventariet registrerades som ${id} och publicerades för internt övertagande.`);
  };

  return (
    <div>
      <Sidrubrik
        titel="Registrera inventarie"
        beskrivning="Objektet publiceras direkt på handelsplatsen och får ett id som kan märkas upp med QR-kod."
      />

      <SuccessBanner meddelande={banner.meddelande} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Kort>
          <KortHuvud>Uppgifter om objektet</KortHuvud>
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Falt etikett="Vad är det för inventarie?" htmlFor="namn">
                <Inmatning
                  id="namn"
                  value={falt.namn}
                  onChange={(e) => andra("namn", e.target.value)}
                  placeholder="Höj- och sänkbart skrivbord"
                />
              </Falt>
            </div>

            <Falt etikett="Kategori" htmlFor="kategori">
              <Vallista
                id="kategori"
                value={falt.kategori}
                onChange={(e) => andra("kategori", e.target.value)}
              >
                {KATEGORIER.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </Vallista>
            </Falt>

            <Falt etikett="Skick" htmlFor="skick">
              <Vallista id="skick" value={falt.skick} onChange={(e) => andra("skick", e.target.value)}>
                {SKICK_VARDEN.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Vallista>
            </Falt>

            <div className="sm:col-span-2">
              <Falt
                etikett="Beskrivning"
                htmlFor="beskrivning"
                hjalptext="Nämn skador och slitage — det minskar antalet avbokade hämtningar."
              >
                <Textyta
                  id="beskrivning"
                  rows={4}
                  value={falt.beskrivning}
                  onChange={(e) => andra("beskrivning", e.target.value)}
                  placeholder="Elektriskt höj- och sänkbart skrivbord med minnesfunktion. Skiva i björklaminat."
                />
              </Falt>
            </div>

            <Falt etikett="Mått" htmlFor="matt">
              <Inmatning
                id="matt"
                value={falt.matt}
                onChange={(e) => andra("matt", e.target.value)}
                placeholder="160 × 80 cm"
              />
            </Falt>

            <Falt etikett="Var står det i dag?" htmlFor="rum">
              <Inmatning
                id="rum"
                value={falt.rum}
                onChange={(e) => andra("rum", e.target.value)}
                placeholder="Kontorslandskap öst"
              />
            </Falt>

            <Falt etikett="Inköpsår" htmlFor="inkopsar">
              <Inmatning
                id="inkopsar"
                type="number"
                value={falt.inkopsar}
                onChange={(e) => andra("inkopsar", e.target.value)}
                placeholder="2019"
              />
            </Falt>

            <Falt etikett="Uppskattat värde (kr)" htmlFor="varde">
              <Inmatning
                id="varde"
                type="number"
                value={falt.varde}
                onChange={(e) => andra("varde", e.target.value)}
                placeholder="3200"
              />
            </Falt>

            {fel && (
              <div className="sm:col-span-2">
                <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
                  {fel}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 sm:col-span-2">
              <Knapp onClick={spara}>Registrera och publicera</Knapp>
              <span className="text-xs text-slate-500">
                Registreras av {state.aktivAvdelning.namn}
              </span>
            </div>
          </div>
        </Kort>

        <div className="flex flex-col gap-5">
          <Kort>
            <KortHuvud>Förhandsvisning</KortHuvud>
            <KategoriBild kategori={falt.kategori} className="h-40 w-full" />
            <div className="px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">
                {falt.namn.trim() || "Namnlöst inventarie"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {falt.kategori} · {falt.skick}
              </p>
            </div>
          </Kort>

          {senasteId && (
            <Kort>
              <KortHuvud>Märk upp objektet</KortHuvud>
              <div className="flex flex-col items-center gap-3 px-5 py-5">
                <div className="rounded-md border border-[var(--border)] p-3">
                  <QRCodeSVG
                    value={`${window.location.origin}${window.location.pathname}#/objekt/${senasteId}`}
                    size={140}
                    level="M"
                  />
                </div>
                <p className="font-mono text-[11px] text-slate-500">{senasteId}</p>
                <Knapp variant="kontur" storlek="sm" onClick={() => onOppnaObjekt(senasteId)}>
                  Öppna objektsidan
                </Knapp>
              </div>
            </Kort>
          )}
        </div>
      </div>
    </div>
  );
}
