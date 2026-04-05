/**
 * CSV Utility — Lightweight JSON-to-CSV converter.
 * No external dependencies required.
 */
/**
 * Convert an array of objects to a CSV string.
 *
 * @param data    - Array of objects to convert.
 * @param columns - Column definitions: { header, accessor }
 *                  header = the CSV column header label
 *                  accessor = function to extract value from each row
 * @returns CSV string with headers and data rows, using CRLF line endings (per RFC 4180).
 */
export declare function toCSV<T>(data: T[], columns: {
    header: string;
    accessor: (row: T) => unknown;
}[]): string;
