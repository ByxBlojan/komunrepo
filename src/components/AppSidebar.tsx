import {
  Boxes,
  Gavel,
  Home,
  Inbox,
  PackageCheck,
  PackagePlus,
  QrCode,
  Route,
  Store,
  Truck,
  Wrench,
  Recycle,
  X,
} from "lucide-react";
import type { Anvandartyp } from "@/data/anvandare";

export type Page =
  | "valj-lage"
  | "sa-fungerar-det"
  | "handelsplats"
  | "objekt"
  | "registrera"
  | "mina"
  | "forfragningar"
  | "skanna"
  | "leverans"
  | "renovera"
  | "upphandla"
  | "transportuppdrag";

interface NavPost {
  id: Page;
  etikett: string;
  ikon: React.ElementType;
  typer: Anvandartyp[];
}

const ALLA: Anvandartyp[] = ["kommun", "privatperson", "leverantor", "leveransbolag"];

const NAV: NavPost[] = [
  { id: "valj-lage", etikett: "Start", ikon: Home, typer: ALLA },
  { id: "handelsplats", etikett: "Köpa", ikon: Store, typer: ["kommun", "privatperson"] },
  { id: "mina", etikett: "Sälja", ikon: Boxes, typer: ["kommun"] },
  { id: "registrera", etikett: "Registrera", ikon: PackagePlus, typer: ["kommun"] },
  { id: "forfragningar", etikett: "Förfrågningar", ikon: Inbox, typer: ["kommun", "privatperson"] },
  { id: "leverans", etikett: "Leverans", ikon: PackageCheck, typer: ["kommun", "privatperson"] },
  { id: "transportuppdrag", etikett: "Transportuppdrag", ikon: Truck, typer: ["leveransbolag"] },
  { id: "renovera", etikett: "Renovera", ikon: Wrench, typer: ["kommun", "leverantor"] },
  { id: "upphandla", etikett: "Upphandla", ikon: Gavel, typer: ["kommun", "leverantor"] },
  { id: "skanna", etikett: "Skanna", ikon: QrCode, typer: ["kommun", "leveransbolag"] },
  { id: "sa-fungerar-det", etikett: "Så fungerar det", ikon: Route, typer: ALLA },
];

interface Props {
  aktivSida: Page;
  anvandartyp: Anvandartyp;
  onNavigera: (sida: Page) => void;
  antalAttGodkanna: number;
  oppen: boolean;
  onStang: () => void;
}

export function AppSidebar({ aktivSida, anvandartyp, onNavigera, antalAttGodkanna, oppen, onStang }: Props) {
  const poster = NAV.filter((p) => p.typer.includes(anvandartyp));

  return (
    <>
      {oppen && (
        <div
          onClick={onStang}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={
          "z-50 flex w-64 shrink-0 flex-col border-r border-[var(--border)] bg-white transition-transform lg:z-auto lg:w-60 lg:translate-x-0 " +
          "fixed inset-y-0 left-0 lg:static " +
          (oppen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex items-center justify-between border-b border-[var(--border)]">
          <button
            onClick={() => onNavigera("valj-lage")}
            className="flex flex-1 items-center gap-2.5 px-5 py-4 text-left hover:bg-slate-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--primary)]">
              <Recycle size={17} className="text-white" />
            </span>
            <span>
              <span className="block text-sm font-semibold leading-tight text-slate-900">KommunCirkulär</span>
              <span className="block text-[11px] text-slate-500">Internt återbruk</span>
            </span>
          </button>

          <button
            onClick={onStang}
            aria-label="Stäng menyn"
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {poster.map((post) => {
          const Ikon = post.ikon;
          const aktiv =
            aktivSida === post.id || (post.id === "handelsplats" && aktivSida === "objekt");
          return (
            <button
              key={post.id}
              onClick={() => onNavigera(post.id)}
              className={
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] font-medium transition-colors " +
                (aktiv
                  ? "bg-[var(--primary-soft)] text-[var(--primary-hover)]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")
              }
            >
              <Ikon size={16} className="shrink-0" />
              <span className="flex-1">{post.etikett}</span>
              {post.id === "forfragningar" && antalAttGodkanna > 0 && (
                <span className="rounded-full bg-[var(--primary)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {antalAttGodkanna}
                </span>
              )}
            </button>
          );
        })}
        </nav>

        <div className="border-t border-[var(--border)] px-5 py-3">
          <p className="text-[11px] leading-relaxed text-slate-400">
            Prototyp med exempeldata. Inget sparas mellan sidladdningar.
          </p>
        </div>
      </aside>
    </>
  );
}
