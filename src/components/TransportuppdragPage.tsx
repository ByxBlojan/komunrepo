import { useState } from "react";
import { ArrowRight, Calendar, Check, MapPin, Package, Users } from "lucide-react";
import { Knapp, Kort, Marke, TomtLage } from "@/components/ui/primitiver";
import { Sidrubrik, SuccessBanner, useSuccessBanner } from "@/components/Delat";
import type { Transportuppdrag } from "@/data/uppdrag";
import type { KommunCirkularState } from "@/lib/state";
import { formatKronor } from "@/lib/utils";

interface Props {
  state: KommunCirkularState;
}

export function TransportuppdragPage({ state }: Props) {
  const [flik, setFlik] = useState<"lediga" | "mina">("lediga");
  const banner = useSuccessBanner();

  const ta = (uppdrag: Transportuppdrag) => {
    state.taUppdrag(uppdrag.id);
    banner.visa(`Du har tagit uppdraget ${uppdrag.id}. Det ligger nu under Mina uppdrag.`);
    setFlik("mina");
  };

  const levererat = (uppdrag: Transportuppdrag) => {
    state.markeraLevererat(uppdrag.id);
    banner.visa("Uppdraget är markerat som levererat. Ersättningen betalas ut enligt avtal.");
  };

  const lista = flik === "lediga" ? state.ledigaUppdrag : state.minaUppdrag;

  const summaLediga = state.ledigaUppdrag.reduce((s, u) => s + u.ersattning, 0);
  const summaMina = state.minaUppdrag
    .filter((u) => u.status === "taget")
    .reduce((s, u) => s + u.ersattning, 0);

  return (
    <div className="mx-auto max-w-4xl">
      <Sidrubrik
        titel="Transportuppdrag"
        beskrivning="Hämtningar och leveranser som kommunens verksamheter lagt ut. Ta de uppdrag som passar din rutt."
      />

      <SuccessBanner meddelande={banner.meddelande} />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Nyckeltal etikett="Lediga uppdrag" varde={String(state.ledigaUppdrag.length)} />
        <Nyckeltal etikett="Att tjäna just nu" varde={formatKronor(summaLediga)} />
        <Nyckeltal etikett="Dina pågående" varde={formatKronor(summaMina)} />
      </div>

      <div className="mb-4 flex gap-1 border-b border-[var(--border)]">
        <FlikKnapp aktiv={flik === "lediga"} onClick={() => setFlik("lediga")} antal={state.ledigaUppdrag.length}>
          Lediga uppdrag
        </FlikKnapp>
        <FlikKnapp aktiv={flik === "mina"} onClick={() => setFlik("mina")} antal={state.minaUppdrag.length}>
          Mina uppdrag
        </FlikKnapp>
      </div>

      {lista.length === 0 ? (
        <TomtLage
          rubrik={flik === "lediga" ? "Inga lediga uppdrag just nu" : "Du har inga uppdrag än"}
          text={
            flik === "lediga"
              ? "Nya uppdrag dyker upp när verksamheter godkänt ett övertagande som behöver transport."
              : "Ta ett uppdrag från listan över lediga så hamnar det här."
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((uppdrag) => (
            <UppdragKort
              key={uppdrag.id}
              uppdrag={uppdrag}
              franNamn={state.hamtaAvdelning(uppdrag.franAvdelningId).namn}
              franAdress={state.hamtaAvdelning(uppdrag.franAvdelningId).adress}
              tillNamn={state.hamtaAvdelning(uppdrag.tillAvdelningId).namn}
              tillAdress={state.hamtaAvdelning(uppdrag.tillAvdelningId).adress}
              onTa={() => ta(uppdrag)}
              onLevererat={() => levererat(uppdrag)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Nyckeltal({ etikett, varde }: { etikett: string; varde: string }) {
  return (
    <Kort>
      <div className="px-5 py-4">
        <p className="text-[11px] uppercase tracking-[0.04em] text-slate-400">{etikett}</p>
        <p className="mt-1 text-xl font-semibold text-slate-900">{varde}</p>
      </div>
    </Kort>
  );
}

function FlikKnapp({
  aktiv,
  antal,
  onClick,
  children,
}: {
  aktiv: boolean;
  antal: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex items-center gap-2 border-b-2 px-4 py-2.5 text-[13px] font-medium transition-colors " +
        (aktiv ? "border-[var(--primary)] text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800")
      }
    >
      {children}
      {antal > 0 && <span className="text-[11px] text-slate-400">{antal}</span>}
    </button>
  );
}

interface KortProps {
  uppdrag: Transportuppdrag;
  franNamn: string;
  franAdress: string;
  tillNamn: string;
  tillAdress: string;
  onTa: () => void;
  onLevererat: () => void;
}

function UppdragKort({ uppdrag, franNamn, franAdress, tillNamn, tillAdress, onTa, onLevererat }: KortProps) {
  return (
    <Kort>
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[15px] font-semibold text-slate-900">{uppdrag.rubrik}</h2>
            {uppdrag.status === "taget" && (
              <Marke bakgrund="var(--status-reserverad-bg)" text="var(--status-reserverad-text)">
                Pågår
              </Marke>
            )}
            {uppdrag.status === "levererat" && (
              <Marke bakgrund="var(--status-tillganglig-bg)" text="var(--status-tillganglig-text)">
                Levererat
              </Marke>
            )}
            <span className="font-mono text-[11px] text-slate-400">{uppdrag.id}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1.5">
              <MapPin size={13} className="text-slate-400" />
              <span className="font-medium text-slate-800">{franNamn}</span>
              <span className="text-slate-500">{franAdress}</span>
            </span>
            <ArrowRight size={15} className="text-slate-300" />
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1.5">
              <MapPin size={13} className="text-slate-400" />
              <span className="font-medium text-slate-800">{tillNamn}</span>
              <span className="text-slate-500">{tillAdress}</span>
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Package size={13} className="text-slate-400" />
              {uppdrag.antal} {uppdrag.antal === 1 ? "objekt" : "objekt"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} className="text-slate-400" />
              Senast {uppdrag.senastDatum}
            </span>
            <span>{uppdrag.avstandKm} km</span>
            {uppdrag.barhjalp && (
              <span className="inline-flex items-center gap-1.5 font-medium text-amber-700">
                <Users size={13} />
                Två personer krävs
              </span>
            )}
          </div>

          <p className="mt-2.5 text-[13px] leading-relaxed text-slate-600">{uppdrag.anteckning}</p>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-[var(--border)] pt-3 sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <div className="text-right">
            <p className="text-xl font-semibold text-slate-900">{formatKronor(uppdrag.ersattning)}</p>
            <p className="text-[11px] text-slate-400">ersättning</p>
          </div>

          {uppdrag.status === "ledigt" && (
            <Knapp onClick={onTa}>Ta uppdraget</Knapp>
          )}
          {uppdrag.status === "taget" && (
            <Knapp variant="kontur" onClick={onLevererat}>
              <Check size={15} />
              Markera levererat
            </Knapp>
          )}
          {uppdrag.status === "levererat" && (
            <span className="text-[12px] font-medium text-[var(--primary-hover)]">Utbetalning pågår</span>
          )}
        </div>
      </div>
    </Kort>
  );
}
