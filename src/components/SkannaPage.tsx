import { useState } from "react";
import { QrCode } from "lucide-react";
import { Falt, Inmatning, Knapp, Kort, KortHuvud } from "@/components/ui/primitiver";
import { Sidrubrik } from "@/components/Delat";
import type { KommunCirkularState } from "@/lib/state";

interface Props {
  state: KommunCirkularState;
  onOppnaObjekt: (id: string) => void;
}

export function SkannaPage({ state, onOppnaObjekt }: Props) {
  const [id, setId] = useState("");
  const [fel, setFel] = useState<string | null>(null);

  const slaUpp = () => {
    const rensat = id.trim().toUpperCase();
    if (!rensat) {
      setFel("Skriv in ett inventarie-id.");
      return;
    }
    if (!state.hamtaInventarie(rensat)) {
      setFel(`Hittade inget objekt med id ${rensat}.`);
      return;
    }
    setFel(null);
    onOppnaObjekt(rensat);
  };

  const senaste = state.inventarier.slice(0, 5);

  return (
    <div className="mx-auto max-w-2xl">
      <Sidrubrik
        titel="Skanna QR-kod"
        beskrivning="Varje inventarie är märkt med en QR-kod som leder till objektets sida. Skanna med telefonen, eller slå upp id:t här."
      />

      <Kort className="mb-5">
        <KortHuvud>Slå upp ett inventarie-id</KortHuvud>
        <div className="px-5 py-5">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Falt etikett="Inventarie-id" htmlFor="objektid">
                <Inmatning
                  id="objektid"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") slaUpp();
                  }}
                  placeholder="KOM-SKR-0001"
                  className="font-mono"
                />
              </Falt>
            </div>
            <Knapp onClick={slaUpp}>Öppna</Knapp>
          </div>

          {fel && (
            <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
              {fel}
            </p>
          )}

          <div className="mt-5 flex gap-3 rounded-md border border-[var(--border)] bg-slate-50 px-4 py-3">
            <QrCode size={18} className="mt-0.5 shrink-0 text-slate-500" />
            <p className="text-[13px] leading-relaxed text-slate-600">
              Vid en riktig hämtning skannar transportören koden på objektet. Här går det lika bra att skriva
              id:t för hand — sidan blir densamma.
            </p>
          </div>
        </div>
      </Kort>

      <Kort>
        <KortHuvud>Senast registrerade</KortHuvud>
        <ul className="divide-y divide-[var(--border)]">
          {senaste.map((objekt) => (
            <li key={objekt.id}>
              <button
                onClick={() => onOppnaObjekt(objekt.id)}
                className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left hover:bg-slate-50"
              >
                <span className="text-[13px] font-medium text-slate-800">{objekt.namn}</span>
                <span className="font-mono text-[11px] text-slate-500">{objekt.id}</span>
              </button>
            </li>
          ))}
        </ul>
      </Kort>
    </div>
  );
}
