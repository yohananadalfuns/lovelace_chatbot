import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const baseURL = "http://localhost:3000";

export const absoluteFilePath = function (url: string | URL) {
  return new URL(url, baseURL);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function groupByDate(sessions: any[]): Record<string, any[]> {
  const now = new Date();
  const today = startOfDay(now);
  const yesterday = startOfDay(new Date(now.getTime() - 86400000));
  const sevenDaysAgo = startOfDay(new Date(now.getTime() - 7 * 86400000));

  const groups: Record<string, any[]> = {};

  for (const s of sessions) {
    const ts = s.updatedAt ?? s.createdAt;
    const d = ts ? startOfDay(new Date(ts)) : null;

    let label: string;
    if (!d || d >= today) {
      label = "Today";
    } else if (d >= yesterday) {
      label = "Yesterday";
    } else if (d >= sevenDaysAgo) {
      label = "Previous 7 days";
    } else {
      label = "Older";
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(s);
  }

  const order = ["Today", "Yesterday", "Previous 7 days", "Older"];
  const ordered: Record<string, any[]> = {};
  for (const key of order) {
    if (groups[key]) ordered[key] = groups[key];
  }
  return ordered;
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
