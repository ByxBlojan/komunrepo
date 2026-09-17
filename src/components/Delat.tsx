import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Marke } from "@/components/ui/primitiver";
import { STATUS_ETIKETT, type InventarieStatus } from "@/data/typer";

const STATUS_FARGER: Record<InventarieStatus, { bg: string; text: string }> = {
  tillganglig: { bg: "var(--status-tillganglig-bg)", text: "var(--status-tillganglig-text)" },
  reserverad: { bg: "var(--status-reserverad-bg)", text: "var(--status-reserverad-text)" },
  flyttad: { bg: "var(--status-flyttad-bg)", text: "var(--status-flyttad-text)" },
  avvecklad: { bg: "var(--status-avvecklad-bg)", text: "var(--status-avvecklad-text)" },
};

export function StatusMarke({ status }: { status: InventarieStatus }) {
  const farg = STATUS_FARGER[status];
  return (
    <Marke bakgrund={farg.bg} text={farg.text}>
      {STATUS_ETIKETT[status]}
    </Marke>
  );
}

export function useSuccessBanner() {
  const [meddelande, setMeddelande] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const visa = (text: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMeddelande(text);
    timer.current = setTimeout(() => setMeddelande(null), 5000);
  };

  return { meddelande, visa };
}

export function SuccessBanner({ meddelande }: { meddelande: string | null }) {
  if (!meddelande) return null;
  return (
    <div className="mb-4 flex items-center gap-2 rounded-md border border-[var(--primary-soft-border)] bg-[var(--primary-soft)] px-4 py-2.5">
      <CheckCircle2 size={16} className="text-[var(--primary)] shrink-0" />
      <span className="text-[13px] font-medium text-[var(--primary-hover)]">{meddelande}</span>
    </div>
  );
}

interface SidrubrikProps {
  titel: string;
  beskrivning?: string;
  children?: React.ReactNode;
}

export function Sidrubrik({ titel, beskrivning, children }: SidrubrikProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{titel}</h1>
        {beskrivning && <p className="mt-1 max-w-2xl text-[13px] text-slate-600">{beskrivning}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
