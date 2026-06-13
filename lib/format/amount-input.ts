const NON_DIGITS = /[^\d]/g;

/**
 * Parse formatted amount back to number.
 * Strips all non-digit characters (dots, commas, spaces are all thousand separators).
 * "150.000" → 150000, "150,500" → 150500, "150.000.500" → 150000500
 */
export function parseFormattedAmount(formatted: string): number {
  const digits = formatted.replace(NON_DIGITS, "");
  if (digits === "") return NaN;
  return Number(digits);
}

/**
 * Format raw digit input with Vietnamese thousand separators (dots).
 * Accepts dots and commas in input (both treated as thousand separators).
 * "150500" → "150.500", "14,500" → "14.500"
 */
export function formatAmountInput(raw: string): string {
  const digits = raw.replace(NON_DIGITS, "");
  if (digits === "") return "";
  const num = Number(digits);
  if (Number.isNaN(num)) return "";
  return num.toLocaleString("vi-VN");
}
