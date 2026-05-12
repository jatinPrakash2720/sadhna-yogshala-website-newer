/**
 * Yogshala LMS — Date Formatting Utilities
 */

/**
 * Format a Date to a readable string (e.g., "May 12, 2026").
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a Date to ISO date string (YYYY-MM-DD).
 */
export function toISODate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

/**
 * Check if a date is in the past.
 */
export function isPastDate(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.getTime() < Date.now();
}

/**
 * Get a future date by adding hours to now.
 */
export function addHours(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

export default { formatDate, toISODate, isPastDate, addHours };
