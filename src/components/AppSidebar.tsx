import { Boxes, Inbox, PackagePlus, QrCode, Route, Store, Recycle } from "lucide-react";

export type Page =
  | "sa-fungerar-det"
  | "handelsplats"
  | "objekt"
  | "registrera"
  | "mina"
  | "forfragningar"
  | "skanna";

interface NavPost {
  id: Page;
  etikett: string;
  ikon: React.ElementType;
}

const NAV: NavPost[] = [
  { id: "handelsplats", etikett: "Handelsplats", ikon: Store },
  { id: "mina", etikett: "Våra inventarier", ikon: Boxes },
  { id: "registrera", etikett: "Registrera", ikon: PackagePlus },
  { id: "forfragningar", etikett: "Förfrågningar", ikon: Inbox },
  { id: "skanna", etikett: "Skanna", ikon: QrCode },
  { id: "sa-fungerar-det", etikett: "Så fungerar det", ikon: Route },
];

interface Props {
  aktivSida: Page;
  onNavigera: (sida: Page) => void;
  antalAttGodkanna: number;
}

export function AppSidebar({ aktivSida, onNavigera, antalAttGodkanna }: Props) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-white">
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--primary)]">
          <Recycle size={17} className="text-white" />
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight text-slate-900">KommunCirkulär</p>
          <p className="text-[11px] text-slate-500">Internt återbruk</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {NAV.map((post) => {
          const Ikon = post.ikon;
          const aktiv = aktivSida === post.id || (post.id === "handelsplats" && aktivSida === "objekt");
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
  );
}
