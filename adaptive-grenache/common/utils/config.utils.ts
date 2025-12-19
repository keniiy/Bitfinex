// Utility functions for loading and validating configuration

/**
 * Parse comma-separated string into array
 * @param str - The string to parse
 * @returns The array of strings
 */
export function parseArray(
  value: string | undefined,
  defaultValue: string[]
): string[] {
  if (!value) return defaultValue;
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Parse integer with default value
 * @param value - The value to parse
 * @param defaultValue - The default value
 * @returns The integer
 */
export function parseInteger(
  value: string | undefined,
  defaultValue: number
): number {
  if (!value) return defaultValue;
  return parseInt(value, 10);
}

/**
 * Parse float with default value
 * @param value - The value to parse
 * @param defaultValue - The default value
 * @returns The float
 */
export function parseFloat(
  value: string | undefined,
  defaultValue: number
): number {
  if (!value) return defaultValue;
  const parsed = Number.parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse boolean with default value
 * @param value - The value to parse
 * @param defaultValue - The default value
 * @returns The boolean
 */
export function parseBoolean(
  value: string | undefined,
  defaultValue: boolean
): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}
