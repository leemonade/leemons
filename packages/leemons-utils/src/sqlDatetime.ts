/**
 * Converts a Date object to SQL datetime string format
 * @param date - The date to convert
 * @returns The date in SQL datetime format
 */
function dateToSql(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

/**
 * Converts a date value to SQL datetime string format
 * @param value - The value to convert (Date, string, or number)
 * @returns The date in SQL datetime format
 * @throws Error if the value is not a valid date
 */
function sqlDatetime(value: Date | string | number): string {
  if (value instanceof Date) {
    return dateToSql(value);
  }

  if (typeof value === "string" || typeof value === "number") {
    return dateToSql(new Date(value));
  }

  throw new Error(`Invalid value for sqlDatetime: ${value}`);
}

export { sqlDatetime };
