import { hittaUnderkategori, type Huvudkategori } from "./typer";

interface Palett {
  bakgrund: string;
  bakgrundBotten: string;
  yta: string;
  ytaMork: string;
  ram: string;
  accent: string;
}

const PALETTER: Record<Huvudkategori, Palett[]> = {
  Möbler: [
    { bakgrund: "#f2f5f8", bakgrundBotten: "#e6ebf1", yta: "#d8b98c", ytaMork: "#c0a074", ram: "#8a8f96", accent: "#5b7186" },
    { bakgrund: "#f4f4f2", bakgrundBotten: "#e8e8e4", yta: "#e8e4dd", ytaMork: "#d2cdc4", ram: "#9aa0a6", accent: "#6b7280" },
    { bakgrund: "#f1f4f3", bakgrundBotten: "#e4eae8", yta: "#a8babd", ytaMork: "#8fa3a7", ram: "#7c8a90", accent: "#4a5f68" },
  ],
  Idrott: [
    { bakgrund: "#fdf3ee", bakgrundBotten: "#f8e6da", yta: "#e08b4c", ytaMork: "#c4703a", ram: "#a85f30", accent: "#b45f38" },
    { bakgrund: "#f0f5f2", bakgrundBotten: "#e0ece5", yta: "#f2f2f0", ytaMork: "#d8d8d4", ram: "#5f8f70", accent: "#3f7a5c" },
    { bakgrund: "#eff2f8", bakgrundBotten: "#e0e6f0", yta: "#5e7fc0", ytaMork: "#4a68a4", ram: "#3f5a90", accent: "#3f5a90" },
  ],
  "IT och teknik": [
    { bakgrund: "#eef0f3", bakgrundBotten: "#e0e3e8", yta: "#3c4450", ytaMork: "#2b323c", ram: "#5a626e", accent: "#4b5563" },
    { bakgrund: "#f1f2f4", bakgrundBotten: "#e4e6ea", yta: "#8d939c", ytaMork: "#757c86", ram: "#646b75", accent: "#4b5563" },
  ],
  "Kök och servering": [
    { bakgrund: "#eef5f1", bakgrundBotten: "#dfeee6", yta: "#dfe4e6", ytaMork: "#c4cccf", ram: "#8fa39a", accent: "#3f7a5c" },
    { bakgrund: "#f0f4f2", bakgrundBotten: "#e2eae6", yta: "#b9c6c9", ytaMork: "#9fb0b4", ram: "#7d9089", accent: "#3f7a5c" },
  ],
  "Lek och förskola": [
    { bakgrund: "#f7f1f7", bakgrundBotten: "#efe2ef", yta: "#d9a3c4", ytaMork: "#c288ae", ram: "#9c6e90", accent: "#7d5a86" },
    { bakgrund: "#f5f2f8", bakgrundBotten: "#e9e4f0", yta: "#e0c98a", ytaMork: "#c9b177", ram: "#9a8a6a", accent: "#7d5a86" },
  ],
  Belysning: [
    { bakgrund: "#fbf7ea", bakgrundBotten: "#f5eed7", yta: "#f0e2ae", ytaMork: "#ddcb91", ram: "#9a8a5a", accent: "#a1863b" },
    { bakgrund: "#f8f6f0", bakgrundBotten: "#efebe0", yta: "#cfd4d8", ytaMork: "#b4bac0", ram: "#878e96", accent: "#a1863b" },
  ],
};

function valjPalett(huvud: Huvudkategori, fro: string): Palett {
  const lista = PALETTER[huvud];
  let summa = 0;
  for (let i = 0; i < fro.length; i++) summa += fro.charCodeAt(i);
  return lista[summa % lista.length];
}

function Golv({ p }: { p: Palett }) {
  return (
    <>
      <defs>
        <linearGradient id={`bg-${p.accent.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.bakgrund} />
          <stop offset="100%" stopColor={p.bakgrundBotten} />
        </linearGradient>
      </defs>
      <rect width="240" height="180" fill={`url(#bg-${p.accent.slice(1)})`} />
      <ellipse cx="120" cy="152" rx="82" ry="9" fill="#0f172a" opacity="0.07" />
    </>
  );
}

function Figur({ under, p }: { under: string; p: Palett }) {
  switch (under) {
    case "skrivbord":
      return (
        <>
          <rect x="34" y="78" width="172" height="11" rx="3" fill={p.yta} />
          <rect x="34" y="89" width="172" height="5" rx="2" fill={p.ytaMork} />
          <rect x="52" y="94" width="9" height="52" rx="3" fill={p.ram} />
          <rect x="179" y="94" width="9" height="52" rx="3" fill={p.ram} />
          <rect x="48" y="142" width="17" height="6" rx="2" fill={p.accent} />
          <rect x="175" y="142" width="17" height="6" rx="2" fill={p.accent} />
          <rect x="88" y="94" width="64" height="7" rx="2" fill={p.ram} opacity="0.5" />
          <rect x="150" y="60" width="30" height="18" rx="3" fill={p.accent} opacity="0.25" />
        </>
      );

    case "kontorsstolar":
      return (
        <>
          <path d="M82 38h54a11 11 0 0 1 11 11v44H71V49a11 11 0 0 1 11-11Z" fill={p.yta} />
          <path d="M82 38h54a11 11 0 0 1 11 11v8H71v-8a11 11 0 0 1 11-11Z" fill={p.ytaMork} opacity="0.5" />
          <rect x="64" y="93" width="90" height="15" rx="6" fill={p.yta} />
          <rect x="64" y="103" width="90" height="6" rx="3" fill={p.ytaMork} />
          <rect x="104" y="108" width="9" height="22" rx="3" fill={p.ram} />
          <path d="M76 146l32-18 32 18" stroke={p.ram} strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="76" cy="147" r="5" fill={p.accent} />
          <circle cx="140" cy="147" r="5" fill={p.accent} />
        </>
      );

    case "bord":
      return (
        <>
          <ellipse cx="120" cy="80" rx="76" ry="21" fill={p.yta} />
          <ellipse cx="120" cy="84" rx="76" ry="21" fill={p.ytaMork} opacity="0.55" />
          <ellipse cx="120" cy="79" rx="62" ry="15" fill={p.yta} opacity="0.5" />
          <rect x="114" y="98" width="12" height="42" rx="4" fill={p.ram} />
          <ellipse cx="120" cy="142" rx="30" ry="7" fill={p.accent} />
        </>
      );

    case "forvaring":
      return (
        <>
          <rect x="66" y="36" width="108" height="112" rx="5" fill={p.yta} />
          <rect x="66" y="36" width="108" height="112" rx="5" stroke={p.ram} strokeWidth="3" fill="none" />
          <rect x="72" y="44" width="96" height="30" rx="3" fill={p.ytaMork} opacity="0.45" />
          <rect x="72" y="80" width="96" height="30" rx="3" fill={p.ytaMork} opacity="0.45" />
          <rect x="72" y="116" width="96" height="26" rx="3" fill={p.ytaMork} opacity="0.45" />
          <rect x="112" y="56" width="16" height="4" rx="2" fill={p.accent} />
          <rect x="112" y="92" width="16" height="4" rx="2" fill={p.accent} />
          <rect x="112" y="126" width="16" height="4" rx="2" fill={p.accent} />
        </>
      );

    case "sittmobler":
      return (
        <>
          <path d="M58 96V62a12 12 0 0 1 12-12h100a12 12 0 0 1 12 12v34" fill={p.yta} />
          <rect x="48" y="94" width="144" height="34" rx="10" fill={p.ytaMork} />
          <rect x="60" y="92" width="58" height="14" rx="6" fill={p.yta} opacity="0.7" />
          <rect x="124" y="92" width="58" height="14" rx="6" fill={p.yta} opacity="0.7" />
          <rect x="48" y="90" width="14" height="38" rx="6" fill={p.yta} />
          <rect x="178" y="90" width="14" height="38" rx="6" fill={p.yta} />
          <rect x="62" y="128" width="8" height="16" rx="3" fill={p.ram} />
          <rect x="170" y="128" width="8" height="16" rx="3" fill={p.ram} />
        </>
      );

    case "bollar":
      return (
        <>
          <circle cx="86" cy="98" r="44" fill={p.yta} />
          <circle cx="86" cy="98" r="44" stroke={p.ram} strokeWidth="2.5" fill="none" />
          <path d="M42 98h88M86 54v88" stroke={p.ram} strokeWidth="2.5" />
          <path d="M55 68c19 17 43 17 62 0M55 128c19-17 43-17 62 0" stroke={p.ram} strokeWidth="2.5" fill="none" />
          <circle cx="160" cy="118" r="26" fill={p.yta} opacity="0.85" />
          <circle cx="160" cy="118" r="26" stroke={p.ram} strokeWidth="2" fill="none" />
          <path d="M134 118h52M160 92v52" stroke={p.ram} strokeWidth="2" />
          <circle cx="190" cy="74" r="16" fill={p.yta} opacity="0.6" />
        </>
      );

    case "traningsredskap":
      return (
        <>
          <rect x="56" y="88" width="128" height="14" rx="7" fill={p.ram} />
          <rect x="34" y="68" width="26" height="54" rx="8" fill={p.yta} />
          <rect x="180" y="68" width="26" height="54" rx="8" fill={p.yta} />
          <rect x="26" y="78" width="14" height="34" rx="6" fill={p.ytaMork} />
          <rect x="200" y="78" width="14" height="34" rx="6" fill={p.ytaMork} />
          <rect x="82" y="84" width="76" height="6" rx="3" fill={p.accent} opacity="0.5" />
        </>
      );

    case "idrottsmaterial":
      return (
        <>
          <path d="M70 146V64a12 12 0 0 1 24 0v82" stroke={p.ram} strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M60 60c0-12 10-20 22-20s22 8 22 20-10 18-22 18-22-6-22-18Z" fill={p.yta} />
          <path d="M132 146V78" stroke={p.ram} strokeWidth="8" strokeLinecap="round" />
          <path d="M120 78h24l-6-30h-12Z" fill={p.yta} />
          <circle cx="176" cy="124" r="20" fill={p.yta} opacity="0.7" />
          <circle cx="176" cy="124" r="20" stroke={p.ram} strokeWidth="2" fill="none" />
        </>
      );

    case "skarmar":
      return (
        <>
          <rect x="52" y="38" width="136" height="80" rx="5" fill={p.yta} />
          <rect x="58" y="44" width="124" height="66" rx="3" fill={p.ytaMork} />
          <rect x="66" y="52" width="60" height="6" rx="3" fill={p.bakgrund} opacity="0.55" />
          <rect x="66" y="64" width="90" height="4" rx="2" fill={p.bakgrund} opacity="0.35" />
          <rect x="66" y="74" width="78" height="4" rx="2" fill={p.bakgrund} opacity="0.35" />
          <rect x="112" y="118" width="16" height="18" rx="3" fill={p.ram} />
          <rect x="84" y="136" width="72" height="9" rx="4" fill={p.ram} />
        </>
      );

    case "datorer":
      return (
        <>
          <path d="M66 46h108v70H66z" fill={p.yta} />
          <path d="M72 52h96v58H72z" fill={p.ytaMork} />
          <rect x="80" y="60" width="52" height="5" rx="2" fill={p.bakgrund} opacity="0.5" />
          <rect x="80" y="72" width="72" height="4" rx="2" fill={p.bakgrund} opacity="0.3" />
          <path d="M46 122h148l-10 16H56Z" fill={p.ram} />
          <rect x="100" y="126" width="40" height="4" rx="2" fill={p.accent} opacity="0.6" />
        </>
      );

    case "projektorer":
      return (
        <>
          <rect x="52" y="76" width="92" height="50" rx="10" fill={p.yta} />
          <rect x="52" y="76" width="92" height="16" rx="8" fill={p.ytaMork} opacity="0.5" />
          <circle cx="130" cy="101" r="17" fill={p.ytaMork} />
          <circle cx="130" cy="101" r="9" fill={p.accent} opacity="0.7" />
          <path d="M156 84l32-16M156 118l32 16M160 101h34" stroke={p.accent} strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
          <rect x="66" y="126" width="12" height="12" rx="3" fill={p.ram} />
          <rect x="118" y="126" width="12" height="12" rx="3" fill={p.ram} />
        </>
      );

    case "vitvaror":
      return (
        <>
          <rect x="78" y="30" width="84" height="118" rx="8" fill={p.yta} />
          <rect x="78" y="30" width="84" height="118" rx="8" stroke={p.ram} strokeWidth="2.5" fill="none" />
          <path d="M78 84h84" stroke={p.ram} strokeWidth="2.5" />
          <rect x="86" y="40" width="68" height="36" rx="4" fill={p.ytaMork} opacity="0.4" />
          <rect x="86" y="92" width="68" height="48" rx="4" fill={p.ytaMork} opacity="0.4" />
          <rect x="146" y="54" width="5" height="16" rx="2.5" fill={p.accent} />
          <rect x="146" y="102" width="5" height="16" rx="2.5" fill={p.accent} />
        </>
      );

    case "servering":
      return (
        <>
          <rect x="60" y="66" width="120" height="8" rx="3" fill={p.yta} />
          <rect x="60" y="112" width="120" height="8" rx="3" fill={p.yta} />
          <rect x="66" y="74" width="8" height="38" fill={p.ram} />
          <rect x="166" y="74" width="8" height="38" fill={p.ram} />
          <rect x="66" y="120" width="8" height="20" fill={p.ram} />
          <rect x="166" y="120" width="8" height="20" fill={p.ram} />
          <circle cx="70" cy="144" r="6" fill={p.accent} />
          <circle cx="170" cy="144" r="6" fill={p.accent} />
          <ellipse cx="108" cy="62" rx="22" ry="6" fill={p.ytaMork} />
          <ellipse cx="146" cy="62" rx="16" ry="5" fill={p.ytaMork} opacity="0.7" />
        </>
      );

    case "leksaker":
      return (
        <>
          <rect x="52" y="98" width="46" height="46" rx="5" fill={p.yta} />
          <rect x="102" y="112" width="34" height="32" rx="4" fill={p.ytaMork} />
          <circle cx="166" cy="120" r="24" fill={p.yta} />
          <circle cx="166" cy="120" r="24" stroke={p.ram} strokeWidth="2.5" fill="none" />
          <path d="M70 98V66l30 16-30 16Z" fill={p.accent} opacity="0.8" />
          <rect x="60" y="110" width="12" height="12" rx="2" fill={p.bakgrund} opacity="0.6" />
          <rect x="78" y="126" width="12" height="12" rx="2" fill={p.bakgrund} opacity="0.6" />
        </>
      );

    case "forskolemobler":
      return (
        <>
          <ellipse cx="120" cy="86" rx="62" ry="17" fill={p.yta} />
          <ellipse cx="120" cy="90" rx="62" ry="17" fill={p.ytaMork} opacity="0.5" />
          <rect x="72" y="100" width="8" height="40" rx="3" fill={p.ram} />
          <rect x="160" y="100" width="8" height="40" rx="3" fill={p.ram} />
          <rect x="94" y="52" width="52" height="30" rx="6" fill={p.accent} opacity="0.35" />
          <rect x="100" y="60" width="40" height="5" rx="2" fill={p.bakgrund} opacity="0.7" />
        </>
      );

    case "golvlampor":
      return (
        <>
          <path d="M120 142V74" stroke={p.ram} strokeWidth="6" strokeLinecap="round" />
          <path d="M84 74h72l-16-34h-40Z" fill={p.yta} />
          <path d="M84 74h72l-16-34h-40Z" stroke={p.ram} strokeWidth="2" fill="none" />
          <ellipse cx="120" cy="146" rx="30" ry="7" fill={p.ram} />
          <ellipse cx="120" cy="78" rx="32" ry="7" fill={p.accent} opacity="0.3" />
        </>
      );

    case "arbetsbelysning":
      return (
        <>
          <path d="M62 142V104l44-34" stroke={p.ram} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M106 70l26-22 30 26-26 22Z" fill={p.yta} />
          <path d="M106 70l26-22 30 26-26 22Z" stroke={p.ram} strokeWidth="2" fill="none" />
          <rect x="44" y="138" width="38" height="9" rx="4" fill={p.ram} />
          <circle cx="106" cy="70" r="6" fill={p.accent} />
        </>
      );

    default:
      return <circle cx="120" cy="94" r="42" fill={p.yta} />;
  }
}

interface Props {
  underkategoriId: string;
  fro?: string;
  className?: string;
}

export function KategoriBild({ underkategoriId, fro, className }: Props) {
  const under = hittaUnderkategori(underkategoriId);
  const huvud: Huvudkategori = under?.huvudkategori ?? "Möbler";
  const palett = valjPalett(huvud, fro ?? underkategoriId);

  return (
    <svg viewBox="0 0 240 180" className={className} role="img" aria-label={under?.namn ?? "Inventarie"}>
      <Golv p={palett} />
      <Figur under={underkategoriId} p={palett} />
    </svg>
  );
}

const FORSTA_UNDER: Record<Huvudkategori, string> = {
  Möbler: "skrivbord",
  Idrott: "bollar",
  "IT och teknik": "skarmar",
  "Kök och servering": "vitvaror",
  "Lek och förskola": "leksaker",
  Belysning: "golvlampor",
};

export function HuvudkategoriBild({ huvud, className }: { huvud: Huvudkategori; className?: string }) {
  return <KategoriBild underkategoriId={FORSTA_UNDER[huvud]} className={className} />;
}
