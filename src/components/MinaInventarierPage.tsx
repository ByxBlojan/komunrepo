import { Knapp, Kort, TomtLage } from "@/components/ui/primitiver";
import { Sidrubrik, StatusMarke } from "@/components/Delat";
import type { KommunCirkularState } from "@/lib/state";
import { formatKronor } from "@/lib/utils";

interface Props {
  state: KommunCirkularState;
  onOppnaObjekt: (id: string) => void;
  onRegistrera: () => void;
}

const TH = "bg-[var(--table-head-bg)] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-600";

export function MinaInventarierPage({ state, onOppnaObjekt, onRegistrera }: Props) {
  const lista = state.minaInventarier;

  const summa = lista.reduce((acc, i) => acc + i.uppskattatVarde, 0);
  const tillgangliga = lista.filter((i) => i.status === "tillganglig").length;

  return (
    <div>
      <Sidrubrik
        titel="Våra inventarier"
        beskrivning={`Objekt som ${state.aktivAvdelning.namn} ansvarar för.`}
      >
        <Knapp onClick={onRegistrera}>Registrera inventarie</Knapp>
      </Sidrubrik>

      {lista.length === 0 ? (
        <TomtLage
          rubrik="Inga registrerade inventarier"
          text="När ni registrerar något blir det synligt här och kan erbjudas till andra verksamheter."
        >
          <Knapp onClick={onRegistrera}>Registrera inventarie</Knapp>
        </TomtLage>
      ) : (
        <>
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <Nyckeltal etikett="Registrerade objekt" varde={String(lista.length)} />
            <Nyckeltal etikett="Erbjuds internt" varde={String(tillgangliga)} />
            <Nyckeltal etikett="Samlat uppskattat värde" varde={formatKronor(summa)} />
          </div>

          <Kort>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className={TH}>Inventarie</th>
                    <th className={TH}>Id</th>
                    <th className={TH}>Kategori</th>
                    <th className={TH}>Placering</th>
                    <th className={TH}>Skick</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((objekt, index) => (
                    <tr
                      key={objekt.id}
                      onClick={() => onOppnaObjekt(objekt.id)}
                      className={
                        "cursor-pointer border-t border-[var(--border)] hover:bg-[var(--table-hover)] " +
                        (index % 2 === 1 ? "bg-[var(--table-zebra)]" : "bg-white")
                      }
                    >
                      <td className="px-4 py-3 text-[13px] font-medium text-slate-800">{objekt.namn}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{objekt.id}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-600">{objekt.kategori}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-600">{objekt.placering.rum}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-600">{objekt.skick}</td>
                      <td className="px-4 py-3">
                        <StatusMarke status={objekt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Kort>
        </>
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
