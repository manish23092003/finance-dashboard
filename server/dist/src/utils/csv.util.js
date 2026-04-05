"use strict";
/**
 * CSV Utility — Lightweight JSON-to-CSV converter.
 * No external dependencies required.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCSV = toCSV;
/**
 * Escape a single CSV field value.
 * Wraps in double-quotes if the value contains commas, quotes, or newlines.
 */
function escapeCSVField(value) {
    if (value === null || value === undefined)
        return '';
    const str = String(value);
    // If the field contains a comma, double-quote, or newline, wrap it in quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        // Escape internal double-quotes by doubling them
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}
/**
 * Convert an array of objects to a CSV string.
 *
 * @param data    - Array of objects to convert.
 * @param columns - Column definitions: { header, accessor }
 *                  header = the CSV column header label
 *                  accessor = function to extract value from each row
 * @returns CSV string with headers and data rows, using CRLF line endings (per RFC 4180).
 */
function toCSV(data, columns) {
    // Header row
    const headerRow = columns.map((col) => escapeCSVField(col.header)).join(',');
    // Data rows
    const dataRows = data.map((row) => columns.map((col) => escapeCSVField(col.accessor(row))).join(','));
    return [headerRow, ...dataRows].join('\r\n');
}
//# sourceMappingURL=csv.util.js.map