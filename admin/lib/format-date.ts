/**
 * Hydration-safe date formatting. Uses fixed locale and options so server and
 * client render the same string (avoids React hydration mismatch).
 */

const LOCALE = "en-GB"
const DATE_TIME_OPTS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
}
const DATE_ONLY_OPTS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
}

/** Format ISO date string as "DD/MM/YYYY, HH:mm:ss" (same on server and client). */
export function formatDateTime(iso: string | null | undefined): string {
  if (iso == null) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString(LOCALE, DATE_TIME_OPTS)
}

/** Format ISO date string as "DD/MM/YYYY" (same on server and client). */
export function formatDate(iso: string | null | undefined): string {
  if (iso == null) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString(LOCALE, DATE_ONLY_OPTS)
}
