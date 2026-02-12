/**
 * Map Supabase Auth errors to user-friendly messages.
 * Supabase defaults to 2 emails/hour for signup/recover; use custom SMTP in
 * Dashboard → Auth → SMTP to increase limits.
 */
export function getAuthErrorMessage(error: string | null): string {
  if (!error) return "";
  const lower = error.toLowerCase();
  if (
    lower.includes("email rate limit") ||
    lower.includes("rate limit exceeded") ||
    lower.includes("email rate limit exceeded")
  ) {
    return "Too many sign-up or password-reset attempts. Supabase allows about 2 emails per hour by default. Try again in an hour, or ask your admin to configure custom SMTP in Supabase (Dashboard → Auth → SMTP) for higher limits.";
  }
  return error;
}
