import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text || typeof text !== 'string' || text.length === 0) {
    return text;
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
};
