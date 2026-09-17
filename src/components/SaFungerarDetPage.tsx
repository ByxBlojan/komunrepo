import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, Camera, Send, Store, Truck } from "lucide-react";
import { Knapp } from "@/components/ui/primitiver";
import { KategoriBild } from "@/data/bilder";

interface Props {
  onTillHandelsplats: () => void;
  visaFortsatt?: boolean;
}

interface Steg {
  nummer: number;
  rubrik: string;
  text: string;
  bild: React.ReactNode;
}

const STEG: Steg[] = [
  {
    nummer: 1,
    rubrik: "Överflödigt skrivbord",
    text: "Avdelning A behöver inte längre skrivbordet.",
    bild: <KategoriBild underkategoriId="skrivbord" className="h-full w-full" />,
  },
  {
    nummer: 2,
    rubrik: "Ta en bild",
    text: "Registrera bild, skick och placering.",
    bild: <IkonRuta ikon={<Camera size={34} />} etiketter={["Bild", "Skick", "Placering"]} />,
  },
  {
    nummer: 3,
    rubrik: "QR-kod skapas",
    text: "Objektet får ett id som märks upp: KOM-SKR-0001.",
    bild: <QrRuta />,
  },
  {
    nummer: 4,
    rubrik: "Publicera internt",
    text: "Lägg upp objektet på handelsplatsen.",
    bild: <IkonRuta ikon={<Store size={34} />} etiketter={["Synligt för alla verksamheter"]} />,
  },
  {
    nummer: 5,
    rubrik: "Ny avdelning bokar",
    text: "Avdelning B skickar en förfrågan som godkänns av Avdelning A.",
    bild: <ByggnadsRuta />,
  },
  {
    nummer: 6,
    rubrik: "Hämtning och klart",
    text: "Ny placering registreras. Inköpskostnad: 0 kr.",
    bild: <IkonRuta ikon={<Truck size={34} />} etiketter={["0 kr i inköp"]} />,
  },
];

export function SaFungerarDetPage({ onTillHandelsplats, visaFortsatt = true }: Props) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Så fungerar KommunCirkulär</h1>
        <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-slate-600">
          Från att ett skrivbord blir över till att det står på plats hos en annan verksamhet — utan att kommunen
          köper något nytt.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STEG.map((steg) => (
          <StegKort key={steg.nummer} steg={steg} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-1 border-t border-[var(--border)] pt-6">
        <p className="text-sm font-semibold text-slate-900">
          KommunCirkulär <span className="mx-1.5 text-slate-300">·</span>
          <span className="font-normal text-slate-600">Från överflöd till återbruk.</span>
        </p>
      </div>

      {visaFortsatt && (
        <div className="mt-6 flex justify-center">
          <Knapp className="h-11 px-6" onClick={onTillHandelsplats}>
            Till handelsplatsen
            <ArrowRight size={16} />
          </Knapp>
        </div>
      )}
    </div>
  );
}

function StegKort({ steg }: { steg: Steg }) {
  return (
    <div className="flex flex-col overflow-clip rounded-lg border border-[var(--card-border)] bg-white">
      <div className="flex items-start gap-3 px-5 pt-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white">
          {steg.nummer}
        </span>
        <div>
          <h2 className="text-[15px] font-semibold leading-tight text-slate-900">{steg.rubrik}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{steg.text}</p>
        </div>
      </div>

      <div className="mt-4 h-[150px] w-full overflow-clip bg-[#f4f7f3]">{steg.bild}</div>
    </div>
  );
}

function IkonRuta({ ikon, etiketter }: { ikon: React.ReactNode; etiketter: string[] }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[var(--primary)] shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
        {ikon}
      </span>
      <div className="flex flex-wrap justify-center gap-1.5">
        {etiketter.map((e) => (
          <span
            key={e}
            className="rounded-full border border-[var(--primary-soft-border)] bg-white px-2.5 py-0.5 text-[11px] font-medium text-[var(--primary-hover)]"
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}

function QrRuta() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-4 px-4">
      <KategoriBild underkategoriId="skrivbord" className="h-[92px] w-[110px] rounded" />
      <div className="flex flex-col items-center gap-1 rounded-md border border-[var(--border)] bg-white p-2">
        <QRCodeSVG value="KOM-SKR-0001" size={60} level="L" />
        <span className="font-mono text-[9px] text-slate-500">KOM-SKR-0001</span>
      </div>
    </div>
  );
}

function ByggnadsRuta() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-3 px-4">
      <Byggnad etikett="Avdelning A" ton="#1e3a5f" />
      <div className="flex flex-col items-center gap-1 text-[var(--primary)]">
        <Send size={18} />
        <ArrowRight size={16} />
      </div>
      <Byggnad etikett="Avdelning B" ton="var(--primary)" />
    </div>
  );
}

function Byggnad({ etikett, ton }: { etikett: string; ton: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg viewBox="0 0 64 60" className="h-[68px] w-[68px]" role="presentation">
        <rect x="8" y="16" width="48" height="40" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="8" y="16" width="48" height="9" rx="3" fill={ton} />
        {[0, 1, 2].map((rad) =>
          [0, 1, 2].map((kol) => (
            <rect
              key={`${rad}-${kol}`}
              x={16 + kol * 12}
              y={31 + rad * 8}
              width="7"
              height="5"
              rx="1"
              fill="#dbe4ee"
            />
          )),
        )}
      </svg>
      <span className="text-[10px] font-medium text-slate-600">{etikett}</span>
    </div>
  );
}
