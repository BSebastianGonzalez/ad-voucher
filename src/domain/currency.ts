/**
 * Formats an integer COP amount with thousands separator (e.g. `$25.000`).
 */
export function formatPesos(amount: number): string {
  const safeInt = Number.isFinite(amount) ? Math.max(0, Math.trunc(amount)) : 0;
  const formatted = safeInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${formatted}`;
}

/**
 * Parses a user-entered currency string into an integer peso amount.
 */
export function parsePesos(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  if (!digits) {
    return 0;
  }
  return Number.parseInt(digits, 10);
}
