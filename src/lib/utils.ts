import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKRW(amount: number): string {
  return `${new Intl.NumberFormat('ko-KR').format(amount)}원`;
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
}

export function getStatusColor(status: "ongoing" | "upcoming" | "ended"): string {
  switch (status) {
    case "ongoing":
      return "bg-green-100 text-green-700";
    case "upcoming":
      return "bg-blue-100 text-blue-700";
    case "ended":
      return "bg-slate-100 text-slate-500";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getGradientBySlug(slug: string): [string, string] {
    const hash = simpleHash(slug);
    const h1 = hash % 360;
    const h2 = (h1 + 45) % 360;
    const s = 70;
    const l = 50;

    const color1 = `hsl(${h1}, ${s}%, ${l}%)`;
    const color2 = `hsl(${h2}, ${s}%, ${l}%)`;
    
    return [color1, color2];
}
