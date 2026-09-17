import { hittaUnderkategori, type Huvudkategori } from "./typer";

const FARGER: Record<Huvudkategori, { bg: string; linje: string; detalj: string }> = {
  Möbler: { bg: "#eef2f7", linje: "#5b7186", detalj: "#cbd5e1" },
  Idrott: { bg: "#fdf1ec", linje: "#b45f38", detalj: "#f4cfbd" },
  "IT och teknik": { bg: "#eef0f4", linje: "#4b5563", detalj: "#cbd0d8" },
  "Kök och servering": { bg: "#eef5f1", linje: "#3f7a5c", detalj: "#c3ded0" },
  "Lek och förskola": { bg: "#f6f0f6", linje: "#7d5a86", detalj: "#ddcbe2" },
  Belysning: { bg: "#fbf6e9", linje: "#a1863b", detalj: "#ecdfb8" },
};

function Figur({ under, huvud }: { under: string; huvud: Huvudkategori }) {
  const f = FARGER[huvud];
  const linje = { stroke: f.linje, strokeWidth: 4, fill: "none", strokeLinecap: "round" as const };

  switch (under) {
    case "skrivbord":
      return (
        <>
          <rect x="24" y="70" width="152" height="10" rx="3" fill={f.linje} />
          <path d="M40 80v54M160 80v54" {...linje} />
          <path d="M46 100h28M126 100h28" stroke={f.detalj} strokeWidth="6" />
        </>
      );
    case "kontorsstolar":
      return (
        <>
          <path d="M70 44h60a8 8 0 0 1 8 8v36H62V52a8 8 0 0 1 8-8Z" fill={f.detalj} />
          <rect x="62" y="96" width="76" height="12" rx="4" fill={f.linje} />
          <path d="M100 108v26M76 148l24-14 24 14" {...linje} />
        </>
      );
    case "bord":
      return (
        <>
          <ellipse cx="100" cy="72" rx="66" ry="18" fill={f.detalj} />
          <path d="M100 90v46M74 136h52" {...linje} />
        </>
      );
    case "forvaring":
      return (
        <>
          <rect x="52" y="40" width="96" height="104" rx="6" fill={f.detalj} />
          <path d="M52 74h96M52 108h96" stroke={f.linje} strokeWidth="4" />
          <circle cx="134" cy="92" r="4" fill={f.linje} />
        </>
      );
    case "sittmobler":
      return (
        <>
          <path d="M50 90V64a8 8 0 0 1 8-8h84a8 8 0 0 1 8 8v26" fill={f.detalj} />
          <rect x="42" y="90" width="116" height="32" rx="8" fill={f.linje} />
          <path d="M56 122v16M144 122v16" {...linje} />
        </>
      );

    case "bollar":
      return (
        <>
          <circle cx="100" cy="88" r="44" fill={f.detalj} />
          <circle cx="100" cy="88" r="44" stroke={f.linje} strokeWidth="4" fill="none" />
          <path d="M56 88h88M100 44v88M68 57c20 18 44 18 64 0M68 119c20-18 44-18 64 0" {...linje} strokeWidth="3" />
        </>
      );
    case "traningsredskap":
      return (
        <>
          <rect x="40" y="76" width="120" height="16" rx="8" fill={f.linje} />
          <rect x="26" y="62" width="22" height="44" rx="6" fill={f.detalj} />
          <rect x="152" y="62" width="22" height="44" rx="6" fill={f.detalj} />
        </>
      );
    case "idrottsmaterial":
      return (
        <>
          <path d="M62 132V62a10 10 0 0 1 20 0v70" {...linje} />
          <ellipse cx="72" cy="58" rx="22" ry="16" fill={f.detalj} />
          <path d="M120 132V70" {...linje} />
          <circle cx="120" cy="58" r="14" fill={f.detalj} />
        </>
      );

    case "skarmar":
      return (
        <>
          <rect x="46" y="46" width="108" height="66" rx="5" fill={f.detalj} />
          <rect x="46" y="46" width="108" height="66" rx="5" stroke={f.linje} strokeWidth="4" fill="none" />
          <path d="M100 112v18M78 136h44" {...linje} />
        </>
      );
    case "datorer":
      return (
        <>
          <path d="M58 52h84v56H58z" fill={f.detalj} />
          <path d="M58 52h84v56H58z" stroke={f.linje} strokeWidth="4" fill="none" />
          <path d="M40 120h120l-8 12H48Z" fill={f.linje} />
        </>
      );
    case "projektorer":
      return (
        <>
          <rect x="44" y="70" width="80" height="44" rx="8" fill={f.detalj} />
          <circle cx="112" cy="92" r="14" fill={f.linje} />
          <path d="M140 74l24-12M140 110l24 12M144 92h26" {...linje} strokeWidth="3" />
        </>
      );

    case "vitvaror":
      return (
        <>
          <rect x="62" y="38" width="76" height="108" rx="8" fill={f.detalj} />
          <path d="M62 84h76" stroke={f.linje} strokeWidth="4" />
          <path d="M124 62v12M124 98v12" {...linje} strokeWidth="5" />
        </>
      );
    case "servering":
      return (
        <>
          <path d="M52 96h96a48 48 0 0 1-96 0Z" fill={f.detalj} />
          <path d="M52 96h96" stroke={f.linje} strokeWidth="4" />
          <path d="M100 96V54" {...linje} />
          <ellipse cx="100" cy="50" rx="16" ry="8" fill={f.linje} />
        </>
      );

    case "leksaker":
      return (
        <>
          <rect x="44" y="92" width="44" height="44" rx="6" fill={f.detalj} />
          <circle cx="132" cy="114" r="22" fill={f.detalj} />
          <path d="M66 92V64l22 14-22 14" fill={f.linje} />
          <circle cx="132" cy="114" r="22" stroke={f.linje} strokeWidth="4" fill="none" />
        </>
      );
    case "forskolemobler":
      return (
        <>
          <rect x="52" y="78" width="96" height="10" rx="3" fill={f.linje} />
          <path d="M64 88v34M136 88v34" {...linje} />
          <rect x="76" y="54" width="48" height="24" rx="6" fill={f.detalj} />
        </>
      );

    case "golvlampor":
      return (
        <>
          <path d="M100 136V68" {...linje} />
          <path d="M72 68h56l-12-26H84L72 68Z" fill={f.detalj} />
          <path d="M74 140h52" {...linje} />
        </>
      );
    case "arbetsbelysning":
      return (
        <>
          <path d="M56 138V96l38-30" {...linje} />
          <path d="M94 66l22-18 26 22-22 18Z" fill={f.detalj} />
          <path d="M44 138h28" {...linje} />
        </>
      );

    default:
      return <circle cx="100" cy="88" r="40" fill={f.detalj} />;
  }
}

interface Props {
  underkategoriId: string;
  className?: string;
}

export function KategoriBild({ underkategoriId, className }: Props) {
  const under = hittaUnderkategori(underkategoriId);
  const huvud: Huvudkategori = under?.huvudkategori ?? "Möbler";

  return (
    <svg viewBox="0 0 200 170" className={className} role="img" aria-label={under?.namn ?? "Inventarie"}>
      <rect width="200" height="170" fill={FARGER[huvud].bg} />
      <Figur under={underkategoriId} huvud={huvud} />
    </svg>
  );
}

export function HuvudkategoriBild({ huvud, className }: { huvud: Huvudkategori; className?: string }) {
  const forsta = {
    Möbler: "skrivbord",
    Idrott: "bollar",
    "IT och teknik": "skarmar",
    "Kök och servering": "vitvaror",
    "Lek och förskola": "leksaker",
    Belysning: "golvlampor",
  }[huvud];

  return <KategoriBild underkategoriId={forsta} className={className} />;
}
