import { useState } from "react";
import { Knapp, Kort, Marke, Modal, TomtLage } from "@/components/ui/primitiver";
import { Sidrubrik, SuccessBanner, useSuccessBanner } from "@/components/Delat";
import { FORFRAGAN_ETIKETT, type Forfragan, type ForfraganStatus } from "@/data/typer";
import type { KommunCirkularState } from "@/lib/state";

interface Props {
  state: KommunCirkularState;
  onOppnaObjekt: (id: string) => void;
}

const STATUS_FARGER: Record<ForfraganStatus, { bg: string; text: string }> = {
  vantar: { bg: "var(--status-reserverad-bg)", text: "var(--status-reserverad-text)" },
  godkand: { bg: "var(--status-tillganglig-bg)", text: "var(--status-tillganglig-text)" },
  avslagen: { bg: "#fee2e2", text: "#b91c1c" },
};

export function ForfragningarPage({ state, onOppnaObjekt }: Props) {
  const [flik, setFlik] = useState<"inkommande" | "egna">("inkommande");
  const [avslaId, setAvslaId] = useState<string | null>(null);
  const banner = useSuccessBanner();

  const godkann = (forfragan: Forfragan) => {
    state.godkannForfragan(forfragan.id);
    banner.visa("Övergången godkändes. Placering och ansvar har flyttats till den mottagande avdelningen.");
  };

  const bekraftaAvslag = () => {
    if (!avslaId) return;
    state.avslaForfragan(avslaId);
    setAvslaId(null);
    banner.visa("Förfrågan avslogs. Objektet är tillgängligt på handelsplatsen igen.");
  };

  const listaAttVisa = flik === "inkommande" ? state.inkommandeForfragningar : state.egnaForfragningar;

  return (
    <div>
      <Sidrubrik
        titel="Förfrågningar"
        beskrivning="Förfrågningar om övertagande, både de som väntar på ditt godkännande och de din avdelning har skickat."
      />

      <SuccessBanner meddelande={banner.meddelande} />

      <div className="mb-4 flex gap-1 border-b border-[var(--border)]">
        <FlikKnapp
          aktiv={flik === "inkommande"}
          onClick={() => setFlik("inkommande")}
          antal={state.antalAttGodkanna}
        >
          Att godkänna
        </FlikKnapp>
        <FlikKnapp aktiv={flik === "egna"} onClick={() => setFlik("egna")}>
          Skickade av oss
        </FlikKnapp>
      </div>

      {listaAttVisa.length === 0 ? (
        <TomtLage
          rubrik={flik === "inkommande" ? "Inga förfrågningar just nu" : "Ni har inte skickat några förfrågningar"}
          text={
            flik === "inkommande"
              ? "När en annan verksamhet vill ta över något ni äger hamnar förfrågan här."
              : "Hittar ni något på handelsplatsen skickar ni en förfrågan från objektsidan."
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {listaAttVisa.map((forfragan) => (
            <ForfraganKort
              key={forfragan.id}
              forfragan={forfragan}
              state={state}
              visaAtgarder={flik === "inkommande" && forfragan.status === "vantar"}
              onGodkann={() => godkann(forfragan)}
              onAvsla={() => setAvslaId(forfragan.id)}
              onOppnaObjekt={onOppnaObjekt}
            />
          ))}
        </div>
      )}

      <Modal oppen={avslaId !== null} rubrik="Avslå förfrågan" onStang={() => setAvslaId(null)}>
        <p className="text-[13px] leading-relaxed text-slate-600">
          Objektet blir tillgängligt för andra verksamheter igen, och den avdelning som frågade ser att förfrågan
          avslogs. Det går inte att ångra.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Knapp variant="kontur" onClick={() => setAvslaId(null)}>
            Avbryt
          </Knapp>
          <Knapp variant="fara" onClick={bekraftaAvslag}>
            Avslå förfrågan
          </Knapp>
        </div>
      </Modal>
    </div>
  );
}

interface FlikProps {
  aktiv: boolean;
  antal?: number;
  onClick: () => void;
  children: React.ReactNode;
}

function FlikKnapp({ aktiv, antal, onClick, children }: FlikProps) {
  return (
    <button
      onClick={onClick}
      className={
        "flex items-center gap-2 border-b-2 px-4 py-2.5 text-[13px] font-medium transition-colors " +
        (aktiv
          ? "border-[var(--primary)] text-slate-900"
          : "border-transparent text-slate-500 hover:text-slate-800")
      }
    >
      {children}
      {antal !== undefined && antal > 0 && (
        <span className="rounded-full bg-[var(--primary)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {antal}
        </span>
      )}
    </button>
  );
}

interface KortProps {
  forfragan: Forfragan;
  state: KommunCirkularState;
  visaAtgarder: boolean;
  onGodkann: () => void;
  onAvsla: () => void;
  onOppnaObjekt: (id: string) => void;
}

function ForfraganKort({ forfragan, state, visaAtgarder, onGodkann, onAvsla, onOppnaObjekt }: KortProps) {
  const farg = STATUS_FARGER[forfragan.status];
  const fran = state.hamtaAvdelning(forfragan.franAvdelningId);
  const till = state.hamtaAvdelning(forfragan.tillAvdelningId);

  return (
    <Kort>
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Marke bakgrund={farg.bg} text={farg.text}>
              {FORFRAGAN_ETIKETT[forfragan.status]}
            </Marke>
            <span className="font-mono text-[11px] text-slate-400">{forfragan.id}</span>
            <span className="text-[11px] text-slate-400">{forfragan.skapad}</span>
          </div>

          <p className="mt-2 text-[13px] text-slate-700">
            <strong className="font-medium text-slate-900">{fran.namn}</strong> vill ta över från{" "}
            <strong className="font-medium text-slate-900">{till.namn}</strong>
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {forfragan.inventarieIds.map((id) => {
              const objekt = state.hamtaInventarie(id);
              return (
                <button
                  key={id}
                  onClick={() => onOppnaObjekt(id)}
                  className="rounded border border-[var(--border)] bg-slate-50 px-2.5 py-1 text-left text-xs hover:bg-slate-100"
                >
                  <span className="font-medium text-slate-800">{objekt?.namn ?? "Okänt objekt"}</span>
                  <span className="ml-1.5 font-mono text-[10px] text-slate-500">{id}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-3 border-l-2 border-[var(--border)] pl-3 text-[13px] italic leading-relaxed text-slate-600">
            {forfragan.meddelande}
          </p>
        </div>

        {visaAtgarder && (
          <div className="flex shrink-0 gap-2">
            <Knapp variant="kontur" storlek="sm" onClick={onAvsla}>
              Avslå
            </Knapp>
            <Knapp storlek="sm" onClick={onGodkann}>
              Godkänn
            </Knapp>
          </div>
        )}
      </div>
    </Kort>
  );
}
