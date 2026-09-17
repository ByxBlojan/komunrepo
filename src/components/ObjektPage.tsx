import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, MapPin, Ruler, Tag, Wallet } from "lucide-react";
import { Falt, Knapp, Kort, KortHuvud, Modal, Textyta, TomtLage } from "@/components/ui/primitiver";
import { StatusMarke, SuccessBanner, useSuccessBanner } from "@/components/Delat";
import { KategoriBild } from "@/data/bilder";
import { HANDELSE_ETIKETT, hittaUnderkategori } from "@/data/typer";
import type { KommunCirkularState } from "@/lib/state";
import { formatKronor } from "@/lib/utils";

interface Props {
  state: KommunCirkularState;
  objektId: string | null;
  onTillbaka: () => void;
}

export function ObjektPage({ state, objektId, onTillbaka }: Props) {
  const [modalOppen, setModalOppen] = useState(false);
  const [meddelandetext, setMeddelandetext] = useState("");
  const banner = useSuccessBanner();

  const objekt = objektId ? state.hamtaInventarie(objektId) : undefined;

  if (!objekt) {
    return (
      <TomtLage
        rubrik="Inventariet hittades inte"
        text="Kontrollera att id:t är rätt. Har du skannat en QR-kod kan objektet ha tagits bort ur registret."
      >
        <Knapp variant="kontur" onClick={onTillbaka}>
          Till handelsplatsen
        </Knapp>
      </TomtLage>
    );
  }

  const agare = state.hamtaAvdelning(objekt.agandeAvdelningId);
  const arEgen = objekt.agandeAvdelningId === state.aktivAvdelning.id;
  const kanBegara = objekt.status === "tillganglig" && !arEgen;
  const qrVarde = `${window.location.origin}${window.location.pathname}#/objekt/${objekt.id}`;

  const skicka = () => {
    const id = state.skapaForfragan(objekt.id, meddelandetext.trim() || "Ingen kommentar angiven.");
    setModalOppen(false);
    setMeddelandetext("");
    if (id) banner.visa("Förfrågan skickad. Avdelningen som äger objektet får den för godkännande.");
  };

  return (
    <div>
      <button
        onClick={onTillbaka}
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={15} />
        Till handelsplatsen
      </button>

      <SuccessBanner meddelande={banner.meddelande} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-5">
          <Kort>
            <KategoriBild underkategoriId={objekt.underkategoriId} className="h-64 w-full" />
            <div className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">{objekt.namn}</h1>
                  <p className="mt-0.5 font-mono text-xs text-slate-500">{objekt.id}</p>
                </div>
                <StatusMarke status={objekt.status} />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-700">{objekt.beskrivning}</p>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <Uppgift
                  ikon={<Tag size={14} />}
                  etikett="Kategori"
                  varde={hittaUnderkategori(objekt.underkategoriId)?.namn ?? "—"}
                />
                <Uppgift
                  ikon={<Ruler size={14} />}
                  etikett="Mått och antal"
                  varde={objekt.antal > 1 ? `${objekt.matt} · ${objekt.antal} st` : objekt.matt}
                />
                <Uppgift ikon={<Wallet size={14} />} etikett="Uppskattat värde" varde={formatKronor(objekt.uppskattatVarde)} />
                <Uppgift ikon={<Tag size={14} />} etikett="Skick" varde={`${objekt.skick} · inköpt ${objekt.inkopsar}`} />
                <Uppgift
                  ikon={<MapPin size={14} />}
                  etikett="Placering"
                  varde={`${objekt.placering.adress} · ${objekt.placering.rum}`}
                />
                <Uppgift ikon={<MapPin size={14} />} etikett="Ansvarig avdelning" varde={agare.namn} />
              </dl>
            </div>
          </Kort>

          <Kort>
            <KortHuvud>Historik</KortHuvud>
            <ol className="px-5 py-4">
              {[...objekt.historik].reverse().map((h, index) => (
                <li key={index} className="relative flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />
                    {index < objekt.historik.length - 1 && <span className="w-px flex-1 bg-[var(--border)]" />}
                  </div>
                  <div className="pb-1">
                    <p className="text-[13px] font-medium text-slate-800">{HANDELSE_ETIKETT[h.typ]}</p>
                    <p className="text-xs text-slate-600">{h.kommentar}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {h.datum} · {state.hamtaAvdelning(h.avdelningId).namn}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Kort>
        </div>

        <div className="flex flex-col gap-5">
          <Kort>
            <KortHuvud>QR-kod</KortHuvud>
            <div className="flex flex-col items-center gap-3 px-5 py-5">
              <div className="rounded-md border border-[var(--border)] bg-white p-3">
                <QRCodeSVG value={qrVarde} size={168} level="M" />
              </div>
              <p className="text-center text-xs leading-relaxed text-slate-600">
                Märk objektet med koden. Skanning leder hit — uppgifterna visas alltid som de ser ut just nu.
              </p>
              <p className="font-mono text-[11px] text-slate-400">{objekt.id}</p>
            </div>
          </Kort>

          <Kort>
            <KortHuvud>Övertagande</KortHuvud>
            <div className="px-5 py-4">
              {arEgen ? (
                <p className="text-[13px] leading-relaxed text-slate-600">
                  Din avdelning äger det här objektet. Förfrågningar från andra verksamheter dyker upp under
                  Förfrågningar.
                </p>
              ) : objekt.status === "tillganglig" ? (
                <p className="text-[13px] leading-relaxed text-slate-600">
                  Objektet erbjuds internt av {agare.namn}. En förfrågan skickas till dem för godkännande.
                </p>
              ) : objekt.status === "reserverad" ? (
                <p className="text-[13px] leading-relaxed text-slate-600">
                  Objektet är reserverat i väntan på att en förfrågan behandlas.
                </p>
              ) : (
                <p className="text-[13px] leading-relaxed text-slate-600">
                  Objektet erbjuds inte för övertagande just nu.
                </p>
              )}

              <Knapp className="mt-4 w-full" disabled={!kanBegara} onClick={() => setModalOppen(true)}>
                Begär övertagande
              </Knapp>
            </div>
          </Kort>
        </div>
      </div>

      <Modal oppen={modalOppen} rubrik="Begär övertagande" onStang={() => setModalOppen(false)}>
        <p className="mb-4 text-[13px] leading-relaxed text-slate-600">
          Förfrågan skickas från <strong className="font-medium text-slate-800">{state.aktivAvdelning.namn}</strong> till{" "}
          <strong className="font-medium text-slate-800">{agare.namn}</strong> för godkännande.
        </p>

        <div className="mb-4 rounded-md border border-[var(--border)] bg-slate-50 px-3 py-2.5">
          <p className="text-[13px] font-medium text-slate-800">{objekt.namn}</p>
          <p className="font-mono text-[11px] text-slate-500">{objekt.id}</p>
        </div>

        <Falt
          etikett="Meddelande till avdelningen"
          htmlFor="meddelande"
          hjalptext="Skriv gärna vad objektet ska användas till — det gör godkännandet enklare."
        >
          <Textyta
            id="meddelande"
            rows={4}
            value={meddelandetext}
            onChange={(e) => setMeddelandetext(e.target.value)}
            placeholder="Vi behöver skrivbordet till en ny arbetsplats i personalrummet."
          />
        </Falt>

        <div className="mt-5 flex justify-end gap-2">
          <Knapp variant="kontur" onClick={() => setModalOppen(false)}>
            Avbryt
          </Knapp>
          <Knapp onClick={skicka}>Skicka förfrågan</Knapp>
        </div>
      </Modal>
    </div>
  );
}

interface UppgiftProps {
  ikon: React.ReactNode;
  etikett: string;
  varde: string;
}

function Uppgift({ ikon, etikett, varde }: UppgiftProps) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.04em] text-slate-400">
        {ikon}
        {etikett}
      </dt>
      <dd className="mt-0.5 text-[13px] font-medium text-slate-800">{varde}</dd>
    </div>
  );
}
