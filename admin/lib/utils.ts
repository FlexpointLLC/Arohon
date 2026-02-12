import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** AlignUI: native <select> matches .input-sleek with extra right padding for chevron */
export const selectClassName = "input-sleek pr-8"
