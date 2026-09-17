import { useMemo, useState } from "react";
import { ChevronRight, LayoutGrid, List, MapPin, Search, X } from "lucide-react";
import { Inmatning, Knapp, TomtLage, Vallista } from "@/components/ui/primitiver";
import { StatusMarke } from "@/components/Delat";
import { HuvudkategoriBild, KategoriBild } from "@/data/bilder";
import {
  HUVUDKATEGORIER,
  SKICK_VARDEN,
  hittaUnderkategori,
  underkategoriernaFor,
  type Huvudkategori,
  type Inventarie,
} from "@/data/typer";
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
  const [huvud, setHuvud] = useState<Huvudkategori | null>(null);
  const [under, setUnder] = useState<string | null>(null);
  const [skick, setSkick] = useState("alla");
  const [avdelning, setAvdelning] = useState("alla");
  const [sortering, setSortering] = useState<Sortering>("senast");
  const [vy, setVy] = useState<Vy>("rutnat");

  const tillgangliga = useMemo(
    () => state.inventarier.filter((i) => i.status !== "avvecklad"),
    [state.inventarier],
  );

  const antalPerHuvud = useMemo(() => {
    const karta = new Map<Huvudkategori, number>();
    for (const objekt of tillgangliga) {
      const u = hittaUnderkategori(objekt.underkategoriId);
      if (!u) continue;
      karta.set(u.huvudkategori, (karta.get(u.huvudkategori) ?? 0) + 1);
    }
    return karta;
  }, [tillgangliga]);

  const antalPerUnder = useMemo(() => {
    const karta = new Map<string, number>();
    for (const objekt of tillgangliga) {
      karta.set(objekt.underkategoriId, (karta.get(objekt.underkategoriId) ?? 0) + 1);
    }
    return karta;
  }, [tillgangliga]);

  const sokning = sok.trim().toLowerCase();
  const visarResultat = sokning !== "" || huvud !== null;

  const traffar = useMemo(() => {
    const filtrerade = tillgangliga.filter((i) => {
      const u = hittaUnderkategori(i.underkategoriId);
      if (huvud && u?.huvudkategori !== huvud) return false;
      if (under && i.underkategoriId !== under) return false;
      if (skick !== "alla" && i.skick !== skick) return false;
      if (avdelning !== "alla" && i.agandeAvdelningId !== avdelning) return false;
      if (!sokning) return true;
      return (
        i.namn.toLowerCase().includes(sokning) ||
        i.id.toLowerCase().includes(sokning) ||
        i.beskrivning.toLowerCase().includes(sokning) ||
        (u?.namn.toLowerCase().includes(sokning) ?? false)
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
  }, [tillgangliga, sokning, huvud, under, skick, avdelning, sortering]);

  const tillStart = () => {
    setHuvud(null);
    setUnder(null);
    setSok("");
    setSkick("alla");
    setAvdelning("alla");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Handelsplats</h1>
          <p className="mt-1 text-[13px] text-slate-600">
            {tillgangliga.length} inventarier som kommunens verksamheter erbjuder just nu
          </p>
        </div>

        <div className="relative w-full max-w-md">
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Inmatning
            value={sok}
            onChange={(e) => setSok(e.target.value)}
            placeholder="Sök basketbollar, skrivbord, KOM-SKR-0101 …"
            className="h-11 pl-11 text-[14px]"
            aria-label="Sök inventarier"
          />
          {sok && (
            <button
              onClick={() => setSok("")}
              aria-label="Rensa sökning"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <Brodsmulor
        huvud={huvud}
        under={under}
        onStart={tillStart}
        onHuvud={() => setUnder(null)}
      />

      {!visarResultat ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HUVUDKATEGORIER.map((kategori) => (
            <button
              key={kategori}
              onClick={() => {
                setHuvud(kategori);
                setUnder(null);
              }}
              className="group flex flex-col overflow-clip rounded-lg border border-[var(--card-border)] bg-white text-left transition-all hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              <HuvudkategoriBild huvud={kategori} className="h-32 w-full" />
              <div className="flex items-center justify-between gap-2 px-5 py-4">
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-900">{kategori}</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {antalPerHuvud.get(kategori) ?? 0} inventarier ·{" "}
                    {underkategoriernaFor(kategori).length} underkategorier
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--primary)]"
                />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          {huvud && (
            <div className="mt-4 flex flex-wrap gap-2">
              <UnderChip aktiv={under === null} etikett="Allt i kategorin" onClick={() => setUnder(null)} />
              {underkategoriernaFor(huvud).map((u) => (
                <UnderChip
                  key={u.id}
                  aktiv={under === u.id}
                  etikett={u.namn}
                  antal={antalPerUnder.get(u.id) ?? 0}
                  onClick={() => setUnder(u.id)}
                />
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-slate-600">
              <strong className="font-semibold text-slate-900">{traffar.length}</strong>{" "}
              {traffar.length === 1 ? "träff" : "träffar"}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Vallista
                value={skick}
                onChange={(e) => setSkick(e.target.value)}
                className="h-8 w-[140px] text-xs"
                aria-label="Skick"
              >
                <option value="alla">Alla skick</option>
                {SKICK_VARDEN.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Vallista>

              <Vallista
                value={avdelning}
                onChange={(e) => setAvdelning(e.target.value)}
                className="h-8 w-[200px] text-xs"
                aria-label="Verksamhet"
              >
                <option value="alla">Alla verksamheter</option>
                {state.avdelningar.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.namn}
                  </option>
                ))}
              </Vallista>

              <Vallista
                value={sortering}
                onChange={(e) => setSortering(e.target.value as Sortering)}
                className="h-8 w-[170px] text-xs"
                aria-label="Sortering"
              >
                <option value="senast">Senast inlagda</option>
                <option value="billigast">Lägst värde</option>
                <option value="dyrast">Högst värde</option>
                <option value="namn">Namn A–Ö</option>
              </Vallista>

              <div className="flex overflow-clip rounded-md border border-[#d1d5db]">
                <VyKnapp aktiv={vy === "rutnat"} onClick={() => setVy("rutnat")} etikett="Rutnätsvy">
                  <LayoutGrid size={15} />
                </VyKnapp>
                <VyKnapp aktiv={vy === "lista"} onClick={() => setVy("lista")} etikett="Listvy">
                  <List size={15} />
                </VyKnapp>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {traffar.length === 0 ? (
              <TomtLage
                rubrik="Inga träffar"
                text="Prova ett bredare sökord eller en annan kategori."
              >
                <Knapp variant="kontur" onClick={tillStart}>
                  Till alla kategorier
                </Knapp>
              </TomtLage>
            ) : vy === "rutnat" ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
                {traffar.map((objekt) => (
                  <Annonskort
                    key={objekt.id}
                    objekt={objekt}
                    avdelningsnamn={state.hamtaAvdelning(objekt.agandeAvdelningId).namn}
                    onOppna={() => onOppnaObjekt(objekt.id)}
                  />
                ))}
              </div>
            ) : (
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
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface BrodsmulorProps {
  huvud: Huvudkategori | null;
  under: string | null;
  onStart: () => void;
  onHuvud: () => void;
}

function Brodsmulor({ huvud, under, onStart, onHuvud }: BrodsmulorProps) {
  if (!huvud) return null;
  const underNamn = under ? hittaUnderkategori(under)?.namn : null;

  return (
    <nav className="mt-4 flex flex-wrap items-center gap-1.5 text-[13px]">
      <button onClick={onStart} className="font-medium text-slate-500 hover:text-slate-900">
        Alla kategorier
      </button>
      <ChevronRight size={14} className="text-slate-300" />
      {underNamn ? (
        <>
          <button onClick={onHuvud} className="font-medium text-slate-500 hover:text-slate-900">
            {huvud}
          </button>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="font-semibold text-slate-900">{underNamn}</span>
        </>
      ) : (
        <span className="font-semibold text-slate-900">{huvud}</span>
      )}
    </nav>
  );
}

function UnderChip({
  aktiv,
  etikett,
  antal,
  onClick,
}: {
  aktiv: boolean;
  etikett: string;
  antal?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors " +
        (aktiv
          ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary-hover)]"
          : "border-[var(--border)] bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900")
      }
    >
      {etikett}
      {antal !== undefined && <span className="ml-1.5 text-[11px] text-slate-400">{antal}</span>}
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

function Annonskort({ objekt, avdelningsnamn, onOppna }: AnnonsProps) {
  return (
    <button
      onClick={onOppna}
      className="flex flex-col overflow-clip rounded-lg border border-[var(--card-border)] bg-white text-left transition-shadow hover:shadow-[0_6px_18px_rgba(15,23,42,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
    >
      <div className="relative">
        <KategoriBild underkategoriId={objekt.underkategoriId} className="h-36 w-full" />
        {objekt.antal > 1 && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
            {objekt.antal} st
          </span>
        )}
      </div>
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

function Annonsrad({ objekt, avdelningsnamn, onOppna }: AnnonsProps) {
  return (
    <button
      onClick={onOppna}
      className="flex items-stretch gap-4 overflow-clip rounded-lg border border-[var(--card-border)] bg-white text-left transition-shadow hover:shadow-[0_4px_14px_rgba(15,23,42,0.07)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
    >
      <KategoriBild underkategoriId={objekt.underkategoriId} className="h-[104px] w-[132px] shrink-0" />

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
          {objekt.antal > 1 && <span>{objekt.antal} st</span>}
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
