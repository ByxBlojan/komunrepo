import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKronor(varde: number): string {
  return `${varde.toLocaleString("sv-SE")} kr`;
}

export function idagIso(): string {
  const nu = new Date();
  const manad = String(nu.getMonth() + 1).padStart(2, "0");
  const dag = String(nu.getDate()).padStart(2, "0");
  return `${nu.getFullYear()}-${manad}-${dag}`;
}
