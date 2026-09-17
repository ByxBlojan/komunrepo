import { ArrowLeft, Check } from "lucide-react";
import { Knapp, Kort, KortHuvud } from "@/components/ui/primitiver";
import { Sidrubrik } from "@/components/Delat";

interface Props {
  rubrik: string;
  ingress: string;
  punkter: string[];
  fas: string;
  onTillbaka: () => void;
}

export function KommandePage({ rubrik, ingress, punkter, fas, onTillbaka }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={onTillbaka}
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={15} />
        Tillbaka
      </button>

      <Sidrubrik titel={rubrik} beskrivning={ingress} />

      <Kort>
        <KortHuvud>Det här är tänkt att ingå</KortHuvud>
        <ul className="flex flex-col gap-3 px-5 py-5">
          {punkter.map((punkt) => (
            <li key={punkt} className="flex items-start gap-2.5">
              <Check size={15} className="mt-0.5 shrink-0 text-[var(--primary)]" />
              <span className="text-[13px] leading-relaxed text-slate-700">{punkt}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-[var(--border)] bg-slate-50 px-5 py-3">
          <p className="text-xs text-slate-500">{fas}</p>
        </div>
      </Kort>

      <div className="mt-5">
        <Knapp variant="kontur" onClick={onTillbaka}>
          Tillbaka till startsidan
        </Knapp>
      </div>
    </div>
  );
}
