import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function round(n: number, digits = 3): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function fmt(n: number, digits = 3): string {
  if (Math.abs(n) < 1e-9) return "0";
  return String(round(n, digits));
}
