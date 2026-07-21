/**
 * Input sanitization and validation for API routes.
 * Strip control characters from user-supplied strings before prompt interpolation.
 */

/** Remove control characters (including newlines) to prevent prompt injection. */
export function sanitizeText(input: unknown, maxLen: number): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\x00-\x1F\x7F]/g, ' ')
    .trim()
    .slice(0, maxLen);
}

/** Validate dd/mm/yyyy birth date. Year must be 1900–present. */
export function isValidDate(dateStr: string): boolean {
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return false;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  return true;
}

/** Validate hh:mm time format. */
export function isValidTime(timeStr: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr);
}

/** Strip HTML-significant characters from output before sending to client. */
export function sanitizeOutput(str: string): string {
  return str.replace(/[<>]/g, '').trim().slice(0, 300);
}
