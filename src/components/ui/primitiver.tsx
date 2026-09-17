import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type KnappVariant = "primar" | "sekundar" | "kontur" | "diskret" | "fara";
type KnappStorlek = "sm" | "md";

const VARIANT_KLASSER: Record<KnappVariant, string> = {
  primar: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] border border-transparent",
  sekundar: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-transparent",
  kontur: "bg-white text-slate-800 border border-[#d1d5db] hover:bg-slate-50",
  diskret: "bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent",
  fara: "bg-red-600 text-white hover:bg-red-700 border border-transparent",
};

const STORLEK_KLASSER: Record<KnappStorlek, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
};

interface KnappProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: KnappVariant;
  storlek?: KnappStorlek;
}

export function Knapp({ variant = "primar", storlek = "md", className, ...props }: KnappProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        VARIANT_KLASSER[variant],
        STORLEK_KLASSER[storlek],
        className,
      )}
      {...props}
    />
  );
}

export function Kort({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white border border-[var(--card-border)] rounded-lg overflow-clip",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className,
      )}
      {...props}
    />
  );
}

export function KortHuvud({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 py-3 bg-[var(--table-head-bg)] border-b border-[var(--border)]",
        "text-sm font-semibold text-slate-800",
        className,
      )}
      {...props}
    />
  );
}

interface FaltProps {
  etikett: string;
  hjalptext?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export function Falt({ etikett, hjalptext, children, htmlFor }: FaltProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-slate-700">
        {etikett}
      </label>
      {children}
      {hjalptext && <p className="text-xs text-slate-500">{hjalptext}</p>}
    </div>
  );
}

const FALT_KLASSER =
  "h-9 w-full rounded-md border border-[#d1d5db] bg-white px-3 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary)] " +
  "focus:ring-2 focus:ring-[var(--primary-soft)]";

export function Inmatning({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(FALT_KLASSER, className)} {...props} />;
}

export function Textyta({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(FALT_KLASSER, "h-auto py-2 leading-relaxed", className)} {...props} />;
}

export function Vallista({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(FALT_KLASSER, "appearance-none pr-8 cursor-pointer", className)} {...props}>
      {children}
    </select>
  );
}

interface MarkeProps {
  bakgrund: string;
  text: string;
  children: React.ReactNode;
}

export function Marke({ bakgrund, text, children }: MarkeProps) {
  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap"
      style={{ background: bakgrund, color: text }}
    >
      {children}
    </span>
  );
}

interface ModalProps {
  oppen: boolean;
  rubrik: string;
  children: React.ReactNode;
  onStang: () => void;
  bredd?: number;
}

export function Modal({ oppen, rubrik, children, onStang, bredd = 440 }: ModalProps) {
  React.useEffect(() => {
    if (!oppen) return;
    const vidTangent = (e: KeyboardEvent) => {
      if (e.key === "Escape") onStang();
    };
    document.addEventListener("keydown", vidTangent);
    return () => document.removeEventListener("keydown", vidTangent);
  }, [oppen, onStang]);

  if (!oppen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
      onClick={onStang}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full flex flex-col max-h-[85vh]"
        style={{ maxWidth: bredd }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] shrink-0">
          <h2 className="text-sm font-semibold text-slate-900">{rubrik}</h2>
          <button
            onClick={onStang}
            aria-label="Stäng"
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100"
          >
            <X size={15} />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

interface TomtLageProps {
  rubrik: string;
  text: string;
  children?: React.ReactNode;
}

export function TomtLage({ rubrik, text, children }: TomtLageProps) {
  return (
    <div className="bg-white border border-dashed border-[#d1d5db] rounded-lg px-6 py-12 text-center">
      <p className="text-sm font-medium text-slate-700">{rubrik}</p>
      <p className="text-[13px] text-slate-500 mt-1 max-w-md mx-auto">{text}</p>
      {children && <div className="mt-4 flex justify-center">{children}</div>}
    </div>
  );
}
