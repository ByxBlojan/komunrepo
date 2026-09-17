import { useMemo, useState } from "react";
import { LayoutGrid, List, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { Inmatning, Knapp, Kort, TomtLage, Vallista } from "@/components/ui/primitiver";
import { StatusMarke } from "@/components/Delat";
import { KategoriBild } from "@/data/bilder";
import { KATEGORIER, SKICK_VARDEN, type Inventarie, type Kategori } from "@/data/typer";
import type { KommunCirkularState } from "@/lib/state";
import { formatKronor } from "@/lib/utils";

type Sortering = "senast" | "billigast" | "dyrast" | "namn";
type Vy = "lista" | "rutnat";

interface Props {
  state: KommunCirkularState;
  onOppnaObjekt: (id: string) => void;
}

export function HandelsplatsPage({ state, onOppnaObjekt }: Props) {
  const [sok, setSok] = useState("");
  const [kategori, setKategori] = useState<Kategori | "alla">("alla");
  const [skick, setSkick] = useState("alla");
  const [avdelning, setAvdelning] = useState("alla");
  const [sortering, setSortering] = useState<Sortering>("senast");
  const [vy, setVy] = useState<Vy>("lista");
  const [visaFilter, setVisaFilter] = useState(false);

  const tillgangliga = useMemo(
    () => state.inventarier.filter((i) => i.status !== "avvecklad"),
    [state.inventarier],
  );

  const antalPerKategori = useMemo(() => {
    const karta = new Map<Kategori, number>();
    for (const objekt of tillgangliga) {
      karta.set(objekt.kategori, (karta.get(objekt.kategori) ?? 0) + 1);
    }
    return karta;
  }, [tillgangliga]);

  const traffar = useMemo(() => {
    const term = sok.trim().toLowerCase();
    const filtrerade = tillgangliga.filter((i) => {
      if (kategori !== "alla" && i.kategori !== kategori) return false;
      if (skick !== "alla" && i.skick !== skick) return false;
      if (avdelning !== "alla" && i.agandeAvdelningId !== avdelning) return false;
      if (!term) return true;
      return (
        i.namn.toLowerCase().includes(term) ||
        i.id.toLowerCase().includes(term) ||
        i.beskrivning.toLowerCase().includes(term)
      );
    });

    const sorterade = [...filtrerade];
    switch (sortering) {
      case "billigast":
        return sorterade.sort((a, b) => a.uppskattatVarde - b.uppskattatVarde);
      case "dyrast":
        return sorterade.sort((a, b) => b.uppskattatVarde - a.uppskattatVarde);
      case "namn":
        return sorterade.sort((a, b) => a.namn.localeCompare(b.namn, "sv"));
      default:
        return sorterade;
    }
  }, [tillgangliga, sok, kategori, skick, avdelning, sortering]);

  const aktivaFilter = [
    kategori !== "alla" ? { etikett: kategori, rensa: () => setKategori("alla") } : null,
    skick !== "alla" ? { etikett: skick, rensa: () => setSkick("alla") } : null,
    avdelning !== "alla"
      ? { etikett: state.hamtaAvdelning(avdelning).namn, rensa: () => setAvdelning("alla") }
      : null,
  ].filter((f): f is { etikett: string; rensa: () => void } => f !== null);

  const rensaAllt = () => {
    setSok("");
    setKategori("alla");
    setSkick("alla");
    setAvdelning("alla");
  };

  return (
    <div>
      <div className="rounded-lg border border-[var(--card-border)] bg-white px-6 py-6">
        <h1 className="text-xl font-semibold text-slate-900">Vad letar du efter?</h1>
        <p className="mt-1 text-[13px] text-slate-600">
          Sök bland inventarier som kommunens verksamheter erbjuder för internt övertagande.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="relative min-w-[260px] flex-1">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Inmatning
              value={sok}
              onChange={(e) => setSok(e.target.value)}
              placeholder="Skrivbord, kontorsstol, KOM-SKR-0001 …"
              className="h-11 pl-11 text-[15px]"
              aria-label="Sök inventarier"
            />
          </div>

          <Vallista
            value={kategori}
            onChange={(e) => setKategori(e.target.value as Kategori | "alla")}
            className="h-11 w-[190px]"
            aria-label="Kategori"
          >
            <option value="alla">Alla kategorier</option>
            {KATEGORIER.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </Vallista>

          <Knapp className="h-11 px-6" onClick={() => setVisaFilter(false)}>
            Sök
          </Knapp>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <KategoriBlock
            aktiv={kategori === "alla"}
            etikett="Allt"
            antal={tillgangliga.length}
            onClick={() => setKategori("alla")}
          />
          {KATEGORIER.map((k) => (
            <KategoriBlock
              key={k}
              aktiv={kategori === k}
              etikett={k}
              antal={antalPerKategori.get(k) ?? 0}
              kategori={k}
              onClick={() => setKategori(k)}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] text-slate-600">
            <strong className="font-semibold text-slate-900">{traffar.length}</strong>{" "}
            {traffar.length === 1 ? "träff" : "träffar"}
          </p>

          {aktivaFilter.map((f) => (
            <span
              key={f.etikett}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-xs text-slate-700"
            >
              {f.etikett}
              <button onClick={f.rensa} aria-label={`Ta bort filter ${f.etikett}`} className="text-slate-400 hover:text-slate-700">
                <X size={12} />
              </button>
            </span>
          ))}

          {(aktivaFilter.length > 0 || sok !== "") && (
            <button onClick={rensaAllt} className="text-xs font-medium text-slate-500 underline hover:text-slate-800">
              Rensa allt
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Knapp
            variant={visaFilter ? "sekundar" : "kontur"}
            storlek="sm"
            onClick={() => setVisaFilter((v) => !v)}
          >
            <SlidersHorizontal size={14} />
            Fler filter
          </Knapp>

          <Vallista
            value={sortering}
            onChange={(e) => setSortering(e.target.value as Sortering)}
            className="h-8 w-[185px] text-xs"
            aria-label="Sortering"
          >
            <option value="senast">Senast inlagda först</option>
            <option value="billigast">Lägst värde först</option>
            <option value="dyrast">Högst värde först</option>
            <option value="namn">Namn A–Ö</option>
          </Vallista>

          <div className="flex overflow-clip rounded-md border border-[#d1d5db]">
            <VyKnapp aktiv={vy === "lista"} onClick={() => setVy("lista")} etikett="Listvy">
              <List size={15} />
            </VyKnapp>
            <VyKnapp aktiv={vy === "rutnat"} onClick={() => setVy("rutnat")} etikett="Rutnätsvy">
              <LayoutGrid size={15} />
            </VyKnapp>
          </div>
        </div>
      </div>

      {visaFilter && (
        <Kort className="mt-3">
          <div className="flex flex-wrap items-end gap-3 px-5 py-4">
            <div className="w-[170px]">
              <label htmlFor="skick" className="mb-1.5 block text-xs font-medium text-slate-700">
                Skick
              </label>
              <Vallista id="skick" value={skick} onChange={(e) => setSkick(e.target.value)}>
                <option value="alla">Alla skick</option>
                {SKICK_VARDEN.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Vallista>
            </div>

            <div className="w-[240px]">
              <label htmlFor="avdelning" className="mb-1.5 block text-xs font-medium text-slate-700">
                Avdelning
              </label>
              <Vallista id="avdelning" value={avdelning} onChange={(e) => setAvdelning(e.target.value)}>
                <option value="alla">Alla avdelningar</option>
                {state.avdelningar.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.namn}
                  </option>
                ))}
              </Vallista>
            </div>
          </div>
        </Kort>
      )}

      <div className="mt-4">
        {traffar.length === 0 ? (
          <TomtLage
            rubrik="Inga träffar"
            text="Prova ett bredare sökord, eller rensa filtren för att se allt som erbjuds just nu."
          >
            <Knapp variant="kontur" onClick={rensaAllt}>
              Rensa sökningen
            </Knapp>
          </TomtLage>
        ) : vy === "lista" ? (
          <div className="flex flex-col gap-2">
            {traffar.map((objekt) => (
              <Annonsrad
                key={objekt.id}
                objekt={objekt}
                avdelningsnamn={state.hamtaAvdelning(objekt.agandeAvdelningId).namn}
                onOppna={() => onOppnaObjekt(objekt.id)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {traffar.map((objekt) => (
              <Annonskort
                key={objekt.id}
                objekt={objekt}
                avdelningsnamn={state.hamtaAvdelning(objekt.agandeAvdelningId).namn}
                onOppna={() => onOppnaObjekt(objekt.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface KategoriBlockProps {
  aktiv: boolean;
  etikett: string;
  antal: number;
  kategori?: Kategori;
  onClick: () => void;
}

function KategoriBlock({ aktiv, etikett, antal, kategori, onClick }: KategoriBlockProps) {
  return (
    <button
      onClick={onClick}
      className={
        "flex items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors " +
        (aktiv
          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
          : "border-[var(--border)] bg-white hover:border-slate-300 hover:bg-slate-50")
      }
    >
      {kategori && <KategoriBild kategori={kategori} className="h-8 w-10 shrink-0 rounded" />}
      <span>
        <span className="block text-[13px] font-medium text-slate-800">{etikett}</span>
        <span className="block text-[11px] text-slate-500">{antal} st</span>
      </span>
    </button>
  );
}

function VyKnapp({
  aktiv,
  onClick,
  etikett,
  children,
}: {
  aktiv: boolean;
  onClick: () => void;
  etikett: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={etikett}
      title={etikett}
      className={
        "flex h-8 w-9 items-center justify-center transition-colors " +
        (aktiv ? "bg-slate-100 text-slate-900" : "bg-white text-slate-500 hover:bg-slate-50")
      }
    >
      {children}
    </button>
  );
}

interface AnnonsProps {
  objekt: Inventarie;
  avdelningsnamn: string;
  onOppna: () => void;
}

function Annonsrad({ objekt, avdelningsnamn, onOppna }: AnnonsProps) {
  return (
    <button
      onClick={onOppna}
      className="flex items-stretch gap-4 overflow-clip rounded-lg border border-[var(--card-border)] bg-white text-left transition-shadow hover:shadow-[0_4px_14px_rgba(15,23,42,0.07)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
    >
      <KategoriBild kategori={objekt.kategori} className="h-[104px] w-[132px] shrink-0" />

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-3">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-900">{objekt.namn}</h3>
          <StatusMarke status={objekt.status} />
        </div>
        <p className="line-clamp-1 text-xs text-slate-600">{objekt.beskrivning}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin size={11} />
            {avdelningsnamn}
          </span>
          <span>{objekt.skick}</span>
          <span className="font-mono">{objekt.id}</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-center gap-1 px-5 py-3">
        <span className="text-sm font-semibold text-slate-900">{formatKronor(objekt.uppskattatVarde)}</span>
        <span className="text-[11px] text-slate-400">uppskattat värde</span>
      </div>
    </button>
  );
}

function Annonskort({ objekt, avdelningsnamn, onOppna }: AnnonsProps) {
  return (
    <button
      onClick={onOppna}
      className="flex flex-col overflow-clip rounded-lg border border-[var(--card-border)] bg-white text-left transition-shadow hover:shadow-[0_6px_18px_rgba(15,23,42,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
    >
      <KategoriBild kategori={objekt.kategori} className="h-36 w-full" />
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-slate-900">{objekt.namn}</h3>
          <StatusMarke status={objekt.status} />
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{objekt.beskrivning}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <span className="truncate text-[11px] text-slate-500" title={avdelningsnamn}>
            {avdelningsnamn}
          </span>
          <span className="shrink-0 text-[13px] font-semibold text-slate-900">
            {formatKronor(objekt.uppskattatVarde)}
          </span>
        </div>
      </div>
    </button>
  );
}
