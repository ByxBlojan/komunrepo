import type { Kategori } from "./typer";

interface BildProps {
  kategori: Kategori;
  className?: string;
}

const FARGER: Record<Kategori, { bg: string; linje: string; detalj: string }> = {
  Skrivbord: { bg: "#eef2f7", linje: "#64748b", detalj: "#cbd5e1" },
  Kontorsstol: { bg: "#f1f5f0", linje: "#5b7355", detalj: "#cddcc7" },
  Förvaring: { bg: "#f7f2ec", linje: "#8a6d4f", detalj: "#e2d3c1" },
  Bord: { bg: "#f0f4f8", linje: "#57728c", detalj: "#c9d8e4" },
  Sittmöbel: { bg: "#f6f0f4", linje: "#83607a", detalj: "#ddc9d7" },
  Belysning: { bg: "#fbf6e9", linje: "#a1863b", detalj: "#ecdfb8" },
  Skärm: { bg: "#eef0f4", linje: "#4b5563", detalj: "#cbd0d8" },
};

function Figur({ kategori }: { kategori: Kategori }) {
  const f = FARGER[kategori];
  const linje = { stroke: f.linje, strokeWidth: 4, fill: "none", strokeLinecap: "round" as const };

  switch (kategori) {
    case "Skrivbord":
      return (
        <>
          <rect x="24" y="72" width="152" height="10" rx="3" fill={f.linje} />
          <path d="M40 82v52M160 82v52" {...linje} />
          <path d="M40 108h120" stroke={f.detalj} strokeWidth="6" />
        </>
      );
    case "Kontorsstol":
      return (
        <>
          <path d="M70 46h60a8 8 0 0 1 8 8v36H62V54a8 8 0 0 1 8-8Z" fill={f.detalj} />
          <rect x="62" y="98" width="76" height="12" rx="4" fill={f.linje} />
          <path d="M100 110v26M76 150l24-14 24 14" {...linje} />
        </>
      );
    case "Förvaring":
      return (
        <>
          <rect x="52" y="42" width="96" height="104" rx="6" fill={f.detalj} />
          <path d="M52 76h96M52 110h96" stroke={f.linje} strokeWidth="4" />
          <circle cx="134" cy="94" r="4" fill={f.linje} />
        </>
      );
    case "Bord":
      return (
        <>
          <ellipse cx="100" cy="74" rx="66" ry="18" fill={f.detalj} />
          <path d="M100 92v48M74 140h52" {...linje} />
        </>
      );
    case "Sittmöbel":
      return (
        <>
          <path d="M50 92V66a8 8 0 0 1 8-8h84a8 8 0 0 1 8 8v26" fill={f.detalj} />
          <rect x="42" y="92" width="116" height="32" rx="8" fill={f.linje} />
          <path d="M56 124v16M144 124v16" {...linje} />
        </>
      );
    case "Belysning":
      return (
        <>
          <path d="M100 138V70" {...linje} />
          <path d="M72 70h56l-12-26H84L72 70Z" fill={f.detalj} />
          <path d="M74 142h52" {...linje} />
        </>
      );
    case "Skärm":
      return (
        <>
          <rect x="46" y="48" width="108" height="66" rx="5" fill={f.detalj} />
          <rect x="46" y="48" width="108" height="66" rx="5" stroke={f.linje} strokeWidth="4" fill="none" />
          <path d="M100 114v18M78 138h44" {...linje} />
        </>
      );
  }
}

export function KategoriBild({ kategori, className }: BildProps) {
  return (
    <svg viewBox="0 0 200 170" className={className} role="img" aria-label={kategori}>
      <rect width="200" height="170" fill={FARGER[kategori].bg} />
      <Figur kategori={kategori} />
    </svg>
  );
}
